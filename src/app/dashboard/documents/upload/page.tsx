'use client';

import { useState, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/file-dropzone';
import { Badge } from '@/components/ui/Badge';
import type { Document, DocumentStatus } from '@/lib/types';
import { formatFileSize, getFileTypeFromMime } from '@/lib/storage';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
  document?: Document;
}

const statusConfig: Record<DocumentStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'brand' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  complete: { label: 'Complete', variant: 'success' },
  failed: { label: 'Failed', variant: 'error' },
};

export default function DocumentUploadPage() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentDocuments = useCallback(async () => {
    try {
      const token = localStorage.getItem('supabase-token');
      const response = await fetch('/api/v1/documents', {
        headers: { authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentDocuments((data.documents || []).slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentDocuments();
  }, [fetchRecentDocuments]);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    for (const file of files) {
      const tempId = `${Date.now()}-${Math.random()}`;
      const uploadingFile: UploadingFile = {
        id: tempId,
        file,
        progress: 0,
        status: 'uploading',
      };

      setUploadingFiles((prev) => [uploadingFile, ...prev]);

      try {
        const token = localStorage.getItem('supabase-token');
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadingFiles((prev) =>
              prev.map((f) => (f.id === tempId ? { ...f, progress } : f))
            );
          }
        };

        const response = await new Promise<{ document?: Document; error?: string }>((resolve, reject) => {
          xhr.onload = async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } catch {
                reject(new Error('Invalid response'));
              }
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                reject(new Error(data.error || 'Upload failed'));
              } catch {
                reject(new Error(`Upload failed: ${xhr.status}`));
              }
            }
          };

          xhr.onerror = () => reject(new Error('Network error'));

          xhr.open('POST', '/api/v1/documents');
          xhr.setRequestHeader('authorization', `Bearer ${token}`);
          xhr.send(formData);
        });

        if (response.document) {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === tempId ? { ...f, status: 'complete', progress: 100, document: response.document } : f
            )
          );
          setRecentDocuments((prev) => [response.document!, ...prev.slice(0, 4)]);
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      } catch (err) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === tempId
              ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Upload failed' }
              : f
          )
        );
      }
    }
  }, []);

  const removeUpload = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (mimeType: string) => {
    const type = getFileTypeFromMime(mimeType);
    if (type === 'pdf') {
      return (
        <div className="w-12 h-12 rounded-lg bg-yellow-500/15 text-yellow-500 grid place-items-center text-xs font-bold font-mono">
          PDF
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-lg bg-[rgba(50,232,117,0.15)] text-[#32E875] grid place-items-center text-xs font-bold font-mono">
        IMG
      </div>
    );
  };

  return (
    <div className="p-8 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">Upload Documents</h1>
        <p className="text-text-secondary text-sm mt-1">
          Upload receipts, invoices, or tax forms — our AI extracts data automatically.
        </p>
      </div>

      <FileDropzone
        onFilesSelected={handleFilesSelected}
        accept="image/jpeg,image/png,.pdf"
        maxSize={10 * 1024 * 1024}
        multiple
        className="mb-10"
      />

      {uploadingFiles.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Uploading</h2>
          <div className="flex flex-col gap-3 mb-10">
            {uploadingFiles.map((uf) => (
              <div
                key={uf.id}
                className="bg-surface-overlay border border-border-subtle rounded-xl p-5 flex items-center gap-4"
              >
                {getFileIcon(uf.file.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">{uf.file.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {formatFileSize(uf.file.size)}
                    {uf.status === 'uploading' && ` · ${uf.progress}%`}
                    {uf.status === 'error' && <span className="text-red-400 ml-1"> · {uf.error}</span>}
                  </div>
                  {uf.status === 'uploading' && (
                    <div className="w-full h-1 bg-border-strong rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-[#0D7377] rounded-full transition-all duration-300"
                        style={{ width: `${uf.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {uf.status === 'uploading' && (
                    <div className="text-[#0D7377] text-xs font-semibold flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 border-2 border-[rgba(13,115,119,0.2)] border-t-[#0D7377] rounded-full animate-spin" />
                      Uploading...
                    </div>
                  )}
                  {uf.status === 'complete' && (
                    <div className="text-[#32E875] text-xs font-semibold flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Done
                    </div>
                  )}
                  {uf.status === 'error' && (
                    <div className="text-red-400 text-xs font-semibold">Failed</div>
                  )}
                  <button
                    onClick={() => removeUpload(uf.id)}
                    className="text-text-muted text-xs hover:text-text-primary transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Recent Uploads</h2>
        <a
          href="/dashboard/documents"
          className="text-[#0D7377] text-xs font-semibold hover:underline"
        >
          View all →
        </a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-[rgba(13,115,119,0.2)] border-t-[#0D7377] rounded-full animate-spin" />
        </div>
      ) : recentDocuments.length === 0 ? (
        <div className="text-center py-10 border border-border-default rounded-xl bg-surface-overlay text-text-secondary text-sm">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {recentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-surface-overlay border border-border-subtle hover:border-border-default rounded-xl p-5 flex items-start gap-4 transition-all"
            >
              {getFileIcon(doc.mime_type)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">{doc.filename}</div>
                <div className="text-xs text-text-muted mt-0.5">
                  Uploaded{' '}
                  {new Date(doc.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' · '}
                  {formatFileSize(doc.file_size)}
                </div>
                {doc.extracted_data && (
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {typeof doc.extracted_data.amount === 'number' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(50,232,117,0.15)] text-[#32E875]">
                        ₦{doc.extracted_data.amount.toLocaleString()}
                      </span>
                    )}
                    {typeof doc.extracted_data.category === 'string' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(13,115,119,0.15)] text-[#0D7377]">
                        {doc.extracted_data.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Badge variant={statusConfig[doc.status].variant}>
                  {statusConfig[doc.status].label}
                </Badge>
                <div className="flex gap-3 text-xs">
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0D7377] font-semibold hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}