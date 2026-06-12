import { getServiceSupabase } from './supabase';

const DOCUMENTS_BUCKET = 'documents';

export async function uploadFile(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ path: string; url: string }> {
  const supabase = getServiceSupabase();
  const ext = file.name.split('.').pop() || '';
  const filename = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const path = `${DOCUMENTS_BUCKET}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  onProgress?.(100);

  const { data: urlData } = supabase.storage
    .from(DOCUMENTS_BUCKET)
    .getPublicUrl(path);

  return {
    path,
    url: urlData.publicUrl,
  };
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = getServiceSupabase();
  const { error } = await supabase.storage.from(DOCUMENTS_BUCKET).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export function getFileUrl(path: string): string {
  const supabase = getServiceSupabase();
  const { data } = supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function getFileTypeFromMime(mimeType: string): 'pdf' | 'image' | 'other' {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  return 'other';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}