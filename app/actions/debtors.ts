"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type DebtorActionState = {
  success: boolean;
  message: string;
};

export async function createDebtor(
  _prevState: DebtorActionState,
  formData: FormData,
): Promise<DebtorActionState> {
  const supabase = await createClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const apelido = String(formData.get("apelido") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const observacoes = String(formData.get("observacoes") ?? "").trim();

  if (!nome) {
    return {
      success: false,
      message: "Informe o nome do devedor.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("devedores").insert({
    nome,
    apelido: apelido || null,
    telefone: telefone || null,
    observacoes: observacoes || null,
    created_by: user?.id ?? null,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/devedores");
  revalidatePath("/dashboard");
  revalidatePath("/emprestimos/novo");
  revalidatePath("/pagamentos");

  return {
    success: true,
    message: "Devedor cadastrado com sucesso.",
  };
}
