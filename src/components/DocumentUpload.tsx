"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/storage";
import { Check, Upload, FileText, AlertCircle } from "lucide-react";

interface DocumentUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  onUpload: (path: string, url: string) => void;
  currentPath?: string;
  hint?: string;
}

export function DocumentUpload({
  label,
  required = false,
  accept = ".pdf",
  onUpload,
  currentPath,
  hint,
}: DocumentUploadProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "uploaded" | "error">(
    currentPath ? "uploaded" : "idle"
  );
  const [fileName, setFileName] = useState<string>(currentPath ? "Document uploaded" : "");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setStatus("error");
        setErrorMessage("File too large (max 10MB)");
        return;
      }

      const allowedTypes = accept.split(",").map((t) => t.trim());
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.some((type) => type.toLowerCase() === fileExt || file.type.startsWith(type.replace("*", "")))) {
        setStatus("error");
        setErrorMessage(`Invalid file type. Accepted: ${accept}`);
        return;
      }

      setStatus("uploading");
      setFileName(file.name);
      setErrorMessage("");
      setProgress(0);

      try {
        const userId = "temp-user";
        const { path, url } = await uploadFile(userId, file, setProgress);
        setStatus("uploaded");
        onUpload(path, url);
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Upload failed");
      }
    },
    [accept, onUpload]
  );

  return (
    <div className="p-4 rounded-card border border-border-default">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              status === "uploaded"
                ? "bg-success-bg"
                : status === "error"
                ? "bg-error-bg"
                : status === "uploading"
                ? "bg-brand-primary-bg"
                : "bg-surface-inset"
            )}
          >
            {status === "uploaded" ? (
              <Check className="w-5 h-5 text-success" />
            ) : status === "error" ? (
              <AlertCircle className="w-5 h-5 text-error" />
            ) : status === "uploading" ? (
              <Upload className="w-5 h-5 text-brand-primary animate-pulse" />
            ) : (
              <FileText className="w-5 h-5 text-text-muted" />
            )}
          </div>
          <div>
            <p className="text-text-primary text-sm font-medium">
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </p>
            <p className="text-text-muted text-xs">
              {fileName || hint || `PDF format, max 10MB`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "uploading" && (
            <span className="text-xs text-brand-primary">{progress}%</span>
          )}
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-btn text-sm font-semibold transition-all duration-150 bg-transparent text-brand-primary border border-brand-primary hover:bg-brand-primary-bg disabled:opacity-40 disabled:cursor-not-allowed">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              disabled={status === "uploading"}
            />
            {status === "uploaded" ? (
              <>
                <Check className="w-4 h-4" /> Uploaded
              </>
            ) : status === "uploading" ? (
              "Uploading..."
            ) : (
              "Upload"
            )}
          </label>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-2 text-xs text-error-text">{errorMessage}</p>
      )}
    </div>
  );
}