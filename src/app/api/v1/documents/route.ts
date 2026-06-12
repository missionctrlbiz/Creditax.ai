import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getServiceSupabase } from '@/lib/supabase';
import { uploadFile, deleteFile } from '@/lib/storage';
import type { Document } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const supabaseAdmin = getServiceSupabase();
    const { data: documents, error: dbError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }

    return NextResponse.json({ documents: documents as Document[] });
  } catch (error) {
    console.error('Documents GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, PDF' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 10MB allowed' }, { status: 400 });
    }

    const { path, url } = await uploadFile(user.id, file);

    const supabaseAdmin = getServiceSupabase();
    const { data: document, error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: user.id,
        filename: file.name,
        file_path: path,
        file_url: url,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending',
      })
      .select('*')
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      await deleteFile(path);
      return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
    }

    setTimeout(async () => {
      try {
        await supabaseAdmin
          .from('documents')
          .update({ status: 'processing' })
          .eq('id', document.id);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await supabaseAdmin
          .from('documents')
          .update({
            status: 'complete',
            extracted_data: {
              amount: Math.floor(Math.random() * 500000) + 50000,
              category: 'Receipt',
              date: new Date().toISOString(),
            },
          })
          .eq('id', document.id);
      } catch (err) {
        console.error('Document processing error:', err);
        await supabaseAdmin
          .from('documents')
          .update({ status: 'failed' })
          .eq('id', document.id);
      }
    }, 1000);

    return NextResponse.json({ document: document as Document });
  } catch (error) {
    console.error('Documents POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const supabaseAdmin = getServiceSupabase();
    const { data: document, error: fetchError } = await supabaseAdmin
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    await deleteFile(document.file_path);

    const { error: deleteError } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Documents DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}