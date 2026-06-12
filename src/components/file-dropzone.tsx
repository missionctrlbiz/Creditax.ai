'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  accept = 'image/*,.pdf',
  maxSize = 10 * 1024 * 1024,
  multiple = true,
  className,
  disabled = false,
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      const validFiles: File[] = [];
      const acceptedTypeList = accept.split(',').map((t) => t.trim());
      const maxSizeBytes = maxSize;

      for (const file of files) {
        const typeMatch = acceptedTypeList.some((type) => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'));
          }
          return file.type === type || file.name.endsWith(type.replace('.', ''));
        });

        if (!typeMatch) {
          setError(`Invalid file type: ${file.name}`);
          continue;
        }

        if (file.size > maxSizeBytes) {
          setError(`File too large: ${file.name} (max ${Math.round(maxSizeBytes / 1024 / 1024)}MB)`);
          continue;
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [accept, maxSize]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: { file: File; errors: readonly { message: string }[] }[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const errorMessages = fileRejections
          .flatMap((r) => r.errors.map((e) => e.message))
          .join(', ');
        setError(errorMessages || 'Some files were rejected');
      }

      const validFiles = validateFiles(acceptedFiles);
      if (validFiles.length > 0) {
        onFilesSelected(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [onFilesSelected, multiple, validateFiles]
  );

  const acceptedTypesMap = accept.split(',').reduce(
    (acc, type) => {
      const trimmed = type.trim();
      acc[trimmed] = [];
      return acc;
    },
    {} as Record<string, string[]>
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypesMap,
    maxSize,
    multiple,
    disabled,
  });

  return (
    <div className={cn('relative', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          'hover:border-[#0D7377]/70 hover:bg-[rgba(13,115,119,0.03)]',
          isDragActive && 'border-[#0D7377] bg-[rgba(13,115,119,0.06)]',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500/50',
          'border-[rgba(13,115,119,0.5)] bg-surface-overlay'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-[#0D7377] mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12 mx-auto"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="text-base font-semibold text-text-primary mb-1">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </div>
        <div className="text-text-muted text-xs mb-3">or click to browse</div>
        <div className="text-text-muted text-xs">
          Supported: JPG, PNG, PDF · Max {Math.round(maxSize / 1024 / 1024)}MB per file
        </div>
      </div>
      {error && (
        <div className="mt-2 text-red-500 text-xs">{error}</div>
      )}
    </div>
  );
}