"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type FamilyEventActionState = {
  success: boolean;
  message: string;
};

export async function createFamilyEvent(
  _prevState: FamilyEventActionState,
  formData: FormData,
): Promise<FamilyEventActionState> {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "").trim();
  const eventTime = String(formData.get("event_time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!title) {
    return { success: false, message: "Informe o título do evento." };
  }

  if (!eventDate) {
    return { success: false, message: "Informe a data do evento." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("family_events").insert({
    title,
    description: description || null,
    event_date: eventDate,
    event_time: eventTime || null,
    location: location || null,
    category: category || "confraternizacao",
    created_by: user?.id ?? null,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/agenda");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Evento cadastrado com sucesso.",
  };
}

export async function deleteFamilyEvent(formData: FormData) {
  const supabase = await createClient();

  const eventId = String(formData.get("event_id") ?? "").trim();

  if (!eventId) {
    return;
  }

  await supabase.from("family_events").delete().eq("id", eventId);

  revalidatePath("/agenda");
  revalidatePath("/dashboard");
}
