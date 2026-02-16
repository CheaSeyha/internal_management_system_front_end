import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function ImageDropzoneHoverRemove({
  maxSizeMB = 5,
  onChange, // (file: File | null) => void
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null); // File | null
  const [previewUrl, setPreviewUrl] = useState(null); // ✅ null instead of ""

  const maxBytes = maxSizeMB * 1024 * 1024;

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null); // ✅ do not set ""
      return;
    }

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
    onChange?.(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const onFileChange = (e) => {
    validateAndSet(e.target.files?.[0]);
    e.target.value = ""; // allow reselect same file
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFile(null);
    onChange?.(null);
  };

  return (
    <div className="w-full">
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
          file ? "p-0" : "p-8",
          isDragging
            ? "border-primary ring-2 ring-primary/30"
            : "border-border hover:border-primary/60",
        ].join(" ")}
      >
        {/* If no file: show instructions */}
        {!file && (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="grid place-items-center rounded-lg border p-2">
              <Upload className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium">Drag & drop an image here</p>
            <p className="text-xs text-muted-foreground">
              or click to browse (max {maxSizeMB}MB)
            </p>

            <div className="mt-3">
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
          </div>
        )}

        {/* If file: show preview */}
        {file && (
          <>
            {/* ✅ only render img when previewUrl exists */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt={file.name}
                className="h-56 w-full object-contain"
              />
            )}

            {/* Top overlay (shows on hover) */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

            {/* Remove button (only appears on hover) */}
            <button
              type="button"
              onClick={removeImage}
              className={[
                "absolute right-3 top-3",
                "opacity-0 group-hover:opacity-100 transition",
                "pointer-events-auto",
                "rounded-full bg-background/90 border shadow-sm",
                "h-9 w-9 grid place-items-center",
                "hover:bg-background",
              ].join(" ")}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Bottom info bar */}
            <div className="flex items-center justify-between gap-2 border-t bg-background px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="truncate text-xs text-muted-foreground">
                  {file.name}
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
