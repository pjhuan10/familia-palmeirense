"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type FamilyPhotoActionState = {
  success: boolean;
  message: string;
};

export async function uploadFamilyPhoto(
  _prevState: FamilyPhotoActionState,
  formData: FormData,
): Promise<FamilyPhotoActionState> {
  const supabase = await createClient();

  const eventId = String(formData.get("event_id") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const photo = formData.get("photo");

  if (!eventId) {
    return { success: false, message: "Evento não informado." };
  }

  if (!(photo instanceof File) || photo.size === 0) {
    return { success: false, message: "Selecione uma foto." };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(photo.type)) {
    return {
      success: false,
      message: "Formato inválido. Use JPG, PNG ou WEBP.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${eventId}/${randomUUID()}.${extension}`;

  const arrayBuffer = await photo.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("family-photos")
    .upload(filePath, fileBytes, {
      contentType: photo.type,
      upsert: false,
    });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("family-photos")
    .getPublicUrl(filePath);

  const photoUrl = publicUrlData.publicUrl;

  const { error: insertError } = await supabase.from("family_event_photos").insert({
    event_id: eventId,
    photo_url: photoUrl,
    caption: caption || null,
    created_by: user?.id ?? null,
  });

  if (insertError) {
    return { success: false, message: insertError.message };
  }

  revalidatePath("/agenda");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Foto enviada com sucesso.",
  };
}
