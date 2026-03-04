"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  /** Current uploaded URL (controlled) */
  value?: string;
  /** Callback when URL changes (set to "" to clear) */
  onChange: (url: string) => void;
  /** Optional extra class on the outer wrapper */
  className?: string;
  /** Whether the control is disabled */
  disabled?: boolean;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export function ImageUpload({
  value,
  onChange,
  className,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>(value ? "success" : "idle");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(value ?? "");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  // ── Upload handler ────────────────────────────────────
  const handleFile = useCallback(
    async (file: File) => {
      setErrorMsg("");

      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg("Only JPEG, PNG, and WebP files are allowed.");
        setState("error");
        return;
      }
      if (file.size > MAX_SIZE) {
        setErrorMsg("File is too large. Maximum size is 5 MB.");
        setState("error");
        return;
      }

      // Show a local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setState("uploading");
      setProgress(0);

      try {
        const result = await uploadImage(file, (p) => setProgress(p));
        // Replace local preview with Cloudinary URL
        setPreviewUrl(result.url);
        onChange(result.url);
        setState("success");
      } catch (err: unknown) {
        setState("error");
        const message =
          (err as { response?: { data?: { error?: { message?: string } } } })
            ?.response?.data?.error?.message || "Upload failed. Please try again.";
        setErrorMsg(message);
        // Revoke local blob
        URL.revokeObjectURL(localUrl);
        setPreviewUrl("");
      }
    },
    [onChange],
  );

  // ── Event handlers ────────────────────────────────────
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so re-selecting the same file triggers onChange
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled || state === "uploading") return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && state !== "uploading") setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const handleRemove = () => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    onChange("");
    setState("idle");
    setProgress(0);
    setErrorMsg("");
  };

  // ── Render: Preview with remove button ─────────────
  if ((state === "success" || state === "uploading") && previewUrl) {
    return (
      <div className={cn("relative", className)}>
        <div className="group relative overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Upload preview"
            className={cn(
              "h-48 w-full object-cover transition-opacity",
              state === "uploading" && "opacity-50",
            )}
          />

          {/* Upload progress overlay */}
          <AnimatePresence>
            {state === "uploading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40"
              >
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <div className="w-3/4">
                  <div className="h-2 overflow-hidden rounded-full bg-white/30">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="mt-1 text-center text-xs text-white">
                    {progress}%
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success badge */}
          {state === "success" && (
            <div className="absolute left-2 top-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-600/90 px-2 py-0.5 text-xs font-medium text-white">
                <CheckCircle2 className="h-3 w-3" /> Uploaded
              </span>
            </div>
          )}

          {/* Remove button */}
          {state !== "uploading" && !disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Render: Error state ────────────────────────────
  if (state === "error") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{errorMsg}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setState("idle");
            setErrorMsg("");
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  // ── Render: Drop zone (idle) ───────────────────────
  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            dragActive ? "bg-primary/10" : "bg-muted",
          )}
        >
          {dragActive ? (
            <Upload className="h-6 w-6 text-primary" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            {dragActive ? (
              "Drop your image here"
            ) : (
              <>
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG, or WebP &bull; Max 5 MB
          </p>
        </div>
      </button>
    </div>
  );
}
