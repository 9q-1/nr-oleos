"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImagemAction } from "@/app/actions/upload";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  pasta: "clientes" | "veiculos" | "produtos";
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  shape?: "circle" | "square";
}

export function ImageUpload({
  pasta,
  value,
  onChange,
  label = "Foto",
  shape = "circle",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File) {
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("pasta", pasta);

    startTransition(async () => {
      const result = await uploadImagemAction(formData);
      if (result.error) {
        toast.error(result.error);
        setPreview(value);
        return;
      }
      if (result.url) {
        onChange(result.url);
        toast.success("Imagem enviada com sucesso.");
      }
    });
  }

  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-white/[0.03]",
          shape === "circle" ? "rounded-full" : "rounded-xl"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <Camera className="h-6 w-6 text-muted-foreground" />
        )}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-5 w-5 animate-spin text-brand-yellow" />
          </div>
        )}
        {preview && !isPending && (
          <button
            type="button"
            aria-label="Remover imagem"
            onClick={() => {
              setPreview(undefined);
              onChange("");
            }}
            className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.08] disabled:opacity-50"
        >
          {preview ? "Trocar foto" : `Enviar ${label.toLowerCase()}`}
        </button>
        <p className="mt-1.5 text-xs text-muted-foreground">JPG, PNG ou WEBP · até 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
