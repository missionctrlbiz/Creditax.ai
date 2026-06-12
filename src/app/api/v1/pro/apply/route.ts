import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { getServiceSupabase } from "@/lib/supabase";

const proApplicationSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  cacNumber: z.string().min(6, "CAC number must be at least 6 characters"),
  firsTin: z.string().optional(),
  yearsExperience: z.number().int().min(0).max(50),
  services: z.array(z.string()).min(1, "Select at least one service"),
  priceMin: z.number().min(0),
  priceMax: z.number().min(0),
  description: z.string().min(50, "Description must be at least 50 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  whatsapp: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  documents: z.object({
    cacCertificate: z.string().min(1, "CAC Certificate is required"),
    firsCertificate: z.string().min(1, "FIRS Certificate is required"),
    idDocument: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authorization required" } },
        { status: 401 }
      );
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_TOKEN", message: "Invalid authentication token" } },
        { status: 401 }
      );
    }

    const validationResult = proApplicationSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: String(issue.path.join(".")),
        message: issue.message,
      }));
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Validation failed", details: errors },
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    const supabaseAdmin = getServiceSupabase();

    const { data: application, error: insertError } = await supabaseAdmin
      .from("pro_applications")
      .insert({
        user_id: user.id,
        business_name: data.businessName,
        owner_name: data.ownerName,
        cac_number: data.cacNumber,
        firs_tin: data.firsTin || null,
        years_experience: data.yearsExperience,
        services: data.services,
        price_min: data.priceMin,
        price_max: data.priceMax,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        lat: data.lat || null,
        lng: data.lng || null,
        phone: data.phone,
        email: data.email,
        whatsapp: data.whatsapp || null,
        website: data.website || null,
        documents: data.documents,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Pro application insert error:", insertError);
      return NextResponse.json(
        { success: false, error: { code: "INSERT_ERROR", message: "Failed to submit application" } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully. You will be notified once reviewed.",
    });
  } catch (error) {
    console.error("Pro apply API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}