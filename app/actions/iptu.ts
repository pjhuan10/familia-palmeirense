"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type IptuActionState = {
  success: boolean;
  message: string;
};

const principalPeople = new Set(["Leandro", "Everton", "Robson"]);

export async function registerIptuContribution(
  _prevState: IptuActionState,
  formData: FormData,
): Promise<IptuActionState> {
  const supabase = await createClient();

  const installmentId = String(formData.get("installment_id") ?? "").trim();
  const personName = String(formData.get("person_name") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const paidAt = String(formData.get("paid_at") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!installmentId) {
    return { success: false, message: "Selecione o mês do IPTU." };
  }

  if (!personName) {
    return { success: false, message: "Informe quem pagou." };
  }

  if (!amountRaw) {
    return { success: false, message: "Informe o valor." };
  }

  const amount = Number(amountRaw.replace(",", "."));

  if (Number.isNaN(amount) || amount <= 0) {
    return { success: false, message: "Informe um valor válido." };
  }

  const contributionType = principalPeople.has(personName) ? "principal" : "extra";

  const { error } = await supabase.from("iptu_contributions").insert({
    installment_id: installmentId,
    person_name: personName,
    contribution_type: contributionType,
    amount,
    paid_at: paidAt || null,
    notes: notes || null,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/iptu");

  return {
    success: true,
    message: "Pagamento registrado com sucesso.",
  };
}
