"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function registerPayment(formData: FormData) {
  const supabase = await createClient();

  const emprestimoId = String(formData.get("emprestimo_id") ?? "").trim();
  const valor = Number(String(formData.get("valor_pago") ?? "0").replace(",", "."));

  if (!emprestimoId || !valor) {
    return;
  }

  await supabase.from("pagamentos").insert({
    emprestimo_id: emprestimoId,
    valor_pago: valor,
  });

  revalidatePath("/dashboard");
  revalidatePath("/pagamentos");
  revalidatePath("/devedores");
}
