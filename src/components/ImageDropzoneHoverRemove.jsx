import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function ImageDropzoneHoverRemove({
  maxSizeMB = 5,
  value = null, // ✅ NEW: accept external value (File | string)
  onChange,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null); // File | null
  const [previewUrl, setPreviewUrl] = useState(null);

  const maxBytes = maxSizeMB * 1024 * 1024;

  // ✅ Sync with external value (IMPORTANT)
  useEffect(() => {
    if (!value) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    // If it's a string (blob/url)
    if (typeof value === "string") {
      setFile(null);
      setPreviewUrl(value);
      return;
    }

    // If it's a File
    if (value instanceof File) {
      setFile(value);
    }
  }, [value]);

  // ✅ Create preview for File only
  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const openFileDialog = () => inputRef.current?.click();

  const validateAndSet = (f) => {
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    if (f.size > maxBytes) {
      alert(`Image too large. Max ${maxSizeMB}MB.`);
      return;
    }

    setFile(f);
    onChange?.(f); // ✅ send File back
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const onFileChange = (e) => {
    validateAndSet(e.target.files?.[0]);
    e.target.value = "";
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreviewUrl(null);
    onChange?.(null);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(e) => e.key === "Enter" && openFileDialog()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        className={[
          "group relative w-full overflow-hidden rounded-xl border border-dashed transition",
          "bg-background cursor-pointer select-none outline-none",
          previewUrl ? "p-0" : "p-8",
          isDragging
            ? "border-primary ring-2 ring-primary/30"
            : "border-border hover:border-primary/60",
        ].join(" ")}
      >
        {/* EMPTY STATE */}
        {!previewUrl && (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="grid place-items-center rounded-lg border p-2">
              <Upload className="h-4 w-4" />
            </div>

            <p className="text-sm font-medium">
              Drag & drop or paste image URL
            </p>
            <p className="text-xs text-muted-foreground">
              Click to browse (max {maxSizeMB}MB)
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              Choose image
            </Button>
          </div>
        )}

        {/* PREVIEW */}
        {previewUrl && (
          <>
            <img
              src={previewUrl}
              alt="preview"
              className="h-56 w-full object-contain"
            />

            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

            <button
              type="button"
              onClick={removeImage}
              className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition pointer-events-auto rounded-full bg-background/90 border shadow-sm h-9 w-9 grid place-items-center"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-between gap-2 border-t bg-background px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="truncate text-xs text-muted-foreground">
                  {file?.name || "Image URL"}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                Change
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
