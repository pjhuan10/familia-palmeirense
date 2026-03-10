"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  eventId: string;
};

export default function FamilyPhotoUploadForm({ eventId }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setMessage("Selecione uma foto.");
      setSuccess(false);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Formato inválido. Use JPG, PNG ou WEBP.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const supabase = createClient();

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `${eventId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("family-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setMessage(uploadError.message);
        setSuccess(false);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("family-photos")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("family_event_photos").insert({
        event_id: eventId,
        photo_url: publicUrlData.publicUrl,
        caption: null,
      });

      if (insertError) {
        setMessage(insertError.message);
        setSuccess(false);
        setLoading(false);
        return;
      }

      setFile(null);
      setMessage("Fotos enviadas com sucesso.");
      setSuccess(true);
      router.refresh();
    } catch {
      setMessage("Não foi possível enviar as fotos.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Fotos</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
      >
        {loading ? "Enviando..." : "Adicionar fotos"}
      </button>

      {message ? (
        <p className={`text-sm ${success ? "text-green-700" : "text-red-600"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
