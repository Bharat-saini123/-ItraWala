"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `products/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-gold/20">
            <Image src={url} alt="Product image" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-ivory hover:bg-terracotta"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gold/40 text-ink/50 hover:border-gold hover:text-maroon">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="font-body text-[10px] uppercase tracking-wide">
            {uploading ? "Uploading" : "Add Image"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="mt-2 font-body text-xs text-terracotta">{error}</p>}
      <p className="mt-2 font-body text-xs text-ink/45">
        Uploads go to your Supabase &ldquo;products&rdquo; storage bucket. You can also paste an
        image URL below instead.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          className="flex-1 rounded-lg border border-gold/30 bg-ivory px-3 py-1.5 font-body text-xs text-ink focus-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) {
                onChange([...images, val]);
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
        <span className="font-body text-xs text-ink/40 self-center">↵ to add</span>
      </div>
    </div>
  );
}
