"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { DocumentUpload } from "@/components/DocumentUpload";
import { Check, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const basicInfoSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  cacNumber: z.string().min(6, "CAC number must be at least 6 characters"),
  firsTin: z.string().optional(),
  yearsExperience: z.number().int().min(0).max(50, "Invalid years of experience"),
});

const servicesSchema = z.object({
  selectedServices: z.array(z.string()).min(1, "Select at least one service"),
  priceMin: z.number().min(0, "Minimum price must be 0 or greater"),
  priceMax: z.number().min(0, "Maximum price must be 0 or greater"),
  description: z.string().min(50, "Description must be at least 50 characters"),
});

const locationSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

const contactSchema = z.object({
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  whatsapp: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const verificationSchema = z.object({
  cacCertificate: z.string().min(1, "CAC Certificate is required"),
  firsCertificate: z.string().min(1, "FIRS Certificate is required"),
  validId: z.string().min(1, "Valid ID is required"),
});

const fullSchema = basicInfoSchema
  .merge(servicesSchema)
  .merge(locationSchema)
  .merge(contactSchema)
  .merge(verificationSchema);

type Step = 1 | 2 | 3 | 4 | 5;

const steps = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Services" },
  { number: 3, label: "Location" },
  { number: 4, label: "Contact" },
  { number: 5, label: "Verification" },
];

const availableServices = [
  "Personal Income Tax",
  "Business Tax Filing",
  "VAT Returns",
  "Withholding Tax",
  "Tax Audit Support",
  "Company Secretarial",
  "Tax Planning & Advisory",
  "International Tax",
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

type FormData = z.infer<typeof fullSchema>;

export default function ProApplyPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [cacVerified, setCacVerified] = useState(false);
  const [cacBusinessName, setCacBusinessName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [documentPaths, setDocumentPaths] = useState<{
    cacCertificate: string;
    firsCertificate: string;
    validId: string;
  }>({
    cacCertificate: "",
    firsCertificate: "",
    validId: "",
  });

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      selectedServices: [],
      priceMin: 50000,
      priceMax: 500000,
      yearsExperience: 0,
    },
  });

  const verifyCAC = async () => {
    const cacNumber = getValues("cacNumber");
    if (cacNumber && cacNumber.length >= 5) {
      setCacVerified(true);
      setCacBusinessName("GreenLeaf Tax Services Ltd");
    }
  };

  const validateStep = async (step: Step): Promise<boolean> => {
    switch (step) {
      case 1:
        const basicFields = ["businessName", "ownerName", "cacNumber", "yearsExperience"] as const;
        return await trigger(basicFields) && cacVerified;
      case 2:
        const serviceFields = ["selectedServices", "priceMin", "priceMax", "description"] as const;
        return await trigger(serviceFields);
      case 3:
        const locationFields = ["address", "city", "state"] as const;
        return await trigger(locationFields);
      case 4:
        const contactFields = ["phone", "email"] as const;
        return await trigger(contactFields);
      case 5:
        return !!(
          documentPaths.cacCertificate &&
          documentPaths.firsCertificate &&
          documentPaths.validId
        );
      default:
        return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const toggleService = (service: string) => {
    const current = getValues("selectedServices") || [];
    if (current.includes(service)) {
      setValue(
        "selectedServices",
        current.filter((s) => s !== service),
        { shouldValidate: true }
      );
    } else {
      setValue("selectedServices", [...current, service], { shouldValidate: true });
    }
  };

  const handleDocumentUpload = (field: "cacCertificate" | "firsCertificate" | "validId") => (
    path: string,
    _url: string
  ) => {
    setDocumentPaths((prev) => ({ ...prev, [field]: path }));
    setValue(field, path, { shouldValidate: true });
    void _url;
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const isValidDocuments = !!(
      documentPaths.cacCertificate &&
      documentPaths.firsCertificate &&
      documentPaths.validId
    );

    if (!isValidDocuments) {
      setSubmitError("Please upload all required documents");
      setIsSubmitting(false);
      return;
    }

    try {
      const formValues = getValues();
      const response = await fetch("/api/v1/pro/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("supabase-token") || ""}`,
        },
        body: JSON.stringify({
          businessName: formValues.businessName,
          ownerName: formValues.ownerName,
          cacNumber: formValues.cacNumber,
          firsTin: formValues.firsTin,
          yearsExperience: formValues.yearsExperience,
          services: formValues.selectedServices,
          priceMin: formValues.priceMin,
          priceMax: formValues.priceMax,
          description: formValues.description,
          address: formValues.address,
          city: formValues.city,
          state: formValues.state,
          lat: undefined,
          lng: undefined,
          phone: formValues.phone,
          email: formValues.email,
          whatsapp: formValues.whatsapp,
          website: formValues.website,
          documents: {
            cacCertificate: documentPaths.cacCertificate,
            firsCertificate: documentPaths.firsCertificate,
            idDocument: documentPaths.validId,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setApplicationId(data.applicationId);
      } else {
        setSubmitError(data.error?.message || "Failed to submit application");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-1">Basic Information</h2>
              <p className="text-text-muted text-sm">Tell us about your practice</p>
            </div>

            <Input
              label="Business Name *"
              placeholder="GreenLeaf Tax Services Ltd"
              error={errors.businessName?.message}
              {...register("businessName")}
            />

            <Input
              label="Owner/Principal Name *"
              placeholder="Adaeze Obi"
              error={errors.ownerName?.message}
              {...register("ownerName")}
            />

            <div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label="CAC Registration Number *"
                    placeholder="RC-1234567"
                    error={errors.cacNumber?.message}
                    {...register("cacNumber")}
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={verifyCAC}
                  disabled={!getValues("cacNumber") || getValues("cacNumber")?.length < 5}
                >
                  Verify via API
                </Button>
              </div>
              {cacVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-success text-sm"
                >
                  <Check className="w-4 h-4" /> Verified! {cacBusinessName}
                </motion.div>
              )}
            </div>

            <Input
              label="FIRS TIN (optional)"
              placeholder="1234567-0001"
              error={errors.firsTin?.message}
              {...register("firsTin")}
            />

            <div>
              <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-1.5">
                Years of Experience *
              </label>
              <select
                className="h-12 w-full rounded-input px-4 font-sans text-sm
                  bg-surface-base border border-border-strong text-text-primary
                  transition-all duration-150
                  focus:outline-none focus:ring-2
                  focus:ring-[var(--color-focus-ring)]
                  focus:border-brand-primary cursor-pointer"
                {...register("yearsExperience", { valueAsNumber: true })}
              >
                <option value={0}>Select years</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((y) => (
                  <option key={y} value={y}>
                    {y} years{y > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              {errors.yearsExperience && (
                <p className="mt-1 text-xs text-error-text">{errors.yearsExperience.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-1">Services</h2>
              <p className="text-text-muted text-sm">Select the services you offer</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map((service) => {
                const currentServices = getValues("selectedServices") || [];
                const isSelected = currentServices.includes(service);
                return (
                  <label
                    key={service}
                    className={`
                      flex items-center gap-3 p-4 rounded-card border cursor-pointer transition-all
                      ${isSelected
                        ? "border-brand-primary bg-brand-primary-bg"
                        : "border-border-default hover:border-[var(--color-border-strong)]"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleService(service)}
                      className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                    />
                    <span className="text-text-primary text-sm">{service}</span>
                  </label>
                );
              })}
            </div>
            {errors.selectedServices && (
              <p className="text-xs text-error-text">{errors.selectedServices.message}</p>
            )}

            <div className="pt-4 border-t border-border-default">
              <p className="text-text-muted text-sm mb-4">Price Range</p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum (₦)"
                  type="number"
                  placeholder="50,000"
                  error={errors.priceMin?.message}
                  {...register("priceMin", { valueAsNumber: true })}
                />
                <Input
                  label="Maximum (₦)"
                  type="number"
                  placeholder="500,000"
                  error={errors.priceMax?.message}
                  {...register("priceMax", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-1.5">
                Description (for RAG search) *
              </label>
              <textarea
                {...register("description")}
                placeholder="Professional tax services for individuals and businesses. Specializing in corporate tax, VAT returns, and tax planning for SMEs..."
                className="w-full h-24 rounded-input px-4 py-3 font-sans text-sm
                  bg-surface-base border border-border-strong text-text-primary
                  placeholder:text-text-placeholder
                  transition-all duration-150
                  focus:outline-none focus:ring-2
                  focus:ring-[var(--color-focus-ring)]
                  focus:border-brand-primary resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-error-text">{errors.description.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-1">Location</h2>
              <p className="text-text-muted text-sm">Where is your practice located?</p>
            </div>

            <Input
              label="Business Address *"
              placeholder="15 Admiralty Way, Lekki Phase 1, Lagos"
              error={errors.address?.message}
              {...register("address")}
            />

            <div className="h-48 rounded-card bg-surface-inset border border-border-default flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-text-muted text-sm">Map preview</p>
                <p className="text-text-muted text-xs">Location will be detected from address</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City *"
                placeholder="Lagos"
                error={errors.city?.message}
                {...register("city")}
              />
              <div>
                <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-1.5">
                  State *
                </label>
                <select
                  className="h-12 w-full rounded-input px-4 font-sans text-sm
                    bg-surface-base border border-border-strong text-text-primary
                    transition-all duration-150
                    focus:outline-none focus:ring-2
                    focus:ring-[var(--color-focus-ring)]
                    focus:border-brand-primary cursor-pointer"
                  {...register("state")}
                >
                  <option value="">Select state</option>
                  {nigerianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-xs text-error-text">{errors.state.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-1">Contact Information</h2>
              <p className="text-text-muted text-sm">How can clients reach you?</p>
            </div>

            <div className="flex gap-3">
              <div className="w-20">
                <Input label="Code" defaultValue="+234" disabled />
              </div>
              <div className="flex-1">
                <Input
                  label="Phone *"
                  placeholder="812 345 6789"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
            </div>

            <Input
              label="Email *"
              type="email"
              placeholder="adaeze@greenleaf.ng"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="flex gap-3">
              <div className="w-20">
                <Input label="Code" defaultValue="+234" disabled />
              </div>
              <div className="flex-1">
                <Input
                  label="WhatsApp (optional)"
                  placeholder="812 345 6789"
                  error={errors.whatsapp?.message}
                  {...register("whatsapp")}
                />
              </div>
            </div>

            <Input
              label="Website (optional)"
              placeholder="https://greenleaf.ng"
              error={errors.website?.message}
              {...register("website")}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-1">Verification Documents</h2>
              <p className="text-text-muted text-sm">Upload required documents to verify your practice</p>
            </div>

            <DocumentUpload
              label="CAC Certificate"
              required
              accept=".pdf"
              onUpload={handleDocumentUpload("cacCertificate")}
              currentPath={documentPaths.cacCertificate}
              hint="PDF format, max 10MB"
            />

            <DocumentUpload
              label="FIRS Certificate"
              required
              accept=".pdf"
              onUpload={handleDocumentUpload("firsCertificate")}
              currentPath={documentPaths.firsCertificate}
              hint="PDF format, max 10MB"
            />

            <DocumentUpload
              label="Valid ID"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onUpload={handleDocumentUpload("validId")}
              currentPath={documentPaths.validId}
              hint="Passport, NIN, or Driver License"
            />

            <div className="pt-4 border-t border-border-default">
              <p className="text-text-muted text-sm">
                By submitting, you agree to our{" "}
                <a href="#" className="text-brand-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-brand-primary hover:underline">
                  Verification Policy
                </a>
                .
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-surface-base">
        <div className="fixed inset-0 pointer-events-none" style={{ background: "var(--ambient-glow)" }} />
        <div className="relative max-w-2xl mx-auto px-6 py-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4">Application Submitted!</h1>
            <p className="text-text-secondary mb-2">
              Your application is now pending review by our team.
            </p>
            <p className="text-text-muted text-sm mb-6">
              Application ID: {applicationId}
            </p>
            <p className="text-text-muted text-sm mb-8">
              You will receive an email notification once your application has been reviewed.
              This typically takes 1-2 business days.
            </p>
            <Button variant="primary" onClick={() => (window.location.href = "/pro/dashboard")}>
              Go to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <div className="fixed inset-0 pointer-events-none" style={{ background: "var(--ambient-glow)" }} />

      <div className="relative max-w-2xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="brand" className="mb-4">
            PRO PORTAL
          </Badge>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-text-primary mb-2">
            Apply as a Tax Professional
          </h1>
          <p className="text-text-secondary">
            Join our marketplace and connect with clients who need your expertise
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-inset" />
            <motion.div
              className="absolute top-5 left-0 h-0.5 bg-brand-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />

            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-200 z-10
                    ${
                      step.number < currentStep
                        ? "bg-brand-primary text-text-inverse"
                        : step.number === currentStep
                        ? "bg-brand-primary text-text-inverse ring-4 ring-brand-primary/30"
                        : "bg-surface-inset text-text-muted"
                    }
                  `}
                >
                  {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${step.number === currentStep ? "text-text-primary" : "text-text-muted"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-8">
              {renderStepContent()}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-error-bg border border-error-border flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-error" />
                  <p className="text-error-text text-sm">{submitError}</p>
                </motion.div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-default">
                <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>

                {currentStep < 5 ? (
                  <Button variant="primary" onClick={nextStep}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="primary" onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-text-muted text-sm">
            Need help?{" "}
            <a href="#" className="text-brand-primary hover:underline">
              Contact support
            </a>{" "}
            or read our{" "}
            <a href="#" className="text-brand-primary hover:underline">
              verification guide
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}