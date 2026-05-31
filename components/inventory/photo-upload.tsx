"use client";

import { Camera, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PhotoUploadProps {
  onSelect: (file: File) => void;
  disabled?: boolean;
  isAnalyzing?: boolean;
}

const ACCEPTED_IMAGE_TYPES =
  "image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif";

const FILE_INPUT_CLASS =
  "absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0";

function handleFileChange(
  event: React.ChangeEvent<HTMLInputElement>,
  onSelect: (file: File) => void,
) {
  const file = event.target.files?.[0];
  if (file) {
    onSelect(file);
  }
  event.target.value = "";
}

export function PhotoUpload({
  onSelect,
  disabled,
  isAnalyzing,
}: PhotoUploadProps) {
  const isDisabled = disabled || isAnalyzing;

  return (
    <div
      className={cn(
        "flex min-h-[140px] w-full flex-col items-center justify-center gap-4 rounded-3xl",
        "border-2 border-dashed border-primary/40 bg-primary-light/40 p-6",
        isDisabled && "pointer-events-none opacity-50",
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
          {isAnalyzing
            ? "Tunggu sebentar ya, Pak..."
            : "Ambil foto baru atau pilih dari galeri"}
        </p>
      </div>

      {!isAnalyzing ? (
        <div className="grid w-full grid-cols-2 gap-3">
          <label
            className={cn(
              "relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-2",
              "rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground",
              "shadow-md transition-colors hover:bg-primary-hover",
              "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
            )}
          >
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              capture="environment"
              className={FILE_INPUT_CLASS}
              onChange={(event) => handleFileChange(event, onSelect)}
              disabled={isDisabled}
              aria-label="Ambil foto rak barang dengan kamera"
            />
            <Camera className="h-4 w-4 shrink-0" aria-hidden />
            Ambil Foto
          </label>

          <label
            className={cn(
              "relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-2",
              "rounded-2xl border border-primary/30 bg-surface px-4 py-3 text-sm font-semibold text-primary",
              "transition-colors hover:bg-primary-light/60",
              "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
            )}
          >
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              className={FILE_INPUT_CLASS}
              onChange={(event) => handleFileChange(event, onSelect)}
              disabled={isDisabled}
              aria-label="Pilih foto rak barang dari galeri"
            />
            <ImagePlus className="h-4 w-4 shrink-0" aria-hidden />
            Galeri
          </label>
        </div>
      ) : null}
    </div>
  );
}
