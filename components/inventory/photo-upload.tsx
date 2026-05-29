"use client";

import { Camera, ImagePlus } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface PhotoUploadProps {
  onSelect: (file: File) => void;
  disabled?: boolean;
  isAnalyzing?: boolean;
}

export function PhotoUpload({
  onSelect,
  disabled,
  isAnalyzing,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onSelect(file);
    }
    event.target.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled || isAnalyzing}
        aria-label="Pilih foto rak barang"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isAnalyzing}
        className={cn(
          "flex min-h-[140px] w-full flex-col items-center justify-center gap-3 rounded-3xl",
          "border-2 border-dashed border-primary/40 bg-primary-light/40 p-6",
          "transition-colors hover:border-primary hover:bg-primary-light/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          {isAnalyzing ? (
            <span
              className="h-7 w-7 animate-spin rounded-full border-2 border-white border-t-transparent"
              aria-hidden
            />
          ) : (
            <Camera className="h-7 w-7" aria-hidden />
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {isAnalyzing ? "Mas Gemini lagi analisis..." : "Foto Rak Barang"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ketuk untuk ambil foto atau pilih dari galeri
          </p>
        </div>
        {!isAnalyzing ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            <ImagePlus className="h-4 w-4" aria-hidden />
            Upload foto rak
          </span>
        ) : null}
      </button>
    </>
  );
}
