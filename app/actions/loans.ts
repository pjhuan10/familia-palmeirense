"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type LoanActionState = {
  success: boolean;
  message: string;
};

export async function createLoan(
  _prevState: LoanActionState,
  formData: FormData,
): Promise<LoanActionState> {
  const supabase = await createClient();

  const emprestadorNome = String(formData.get("emprestador_nome") ?? "").trim();
  const devedorId = String(formData.get("devedor_id") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const valorTotalRaw = String(formData.get("valor_total") ?? "").trim();
  const dataVencimento = String(formData.get("data_vencimento") ?? "").trim();
  const observacoes = String(formData.get("observacoes") ?? "").trim();

  if (!emprestadorNome) {
    return { success: false, message: "Informe quem emprestou." };
  }

  if (!devedorId) {
    return { success: false, message: "Selecione o devedor." };
  }

  if (!titulo) {
    return { success: false, message: "Informe o título do empréstimo." };
  }

  if (!valorTotalRaw) {
    return { success: false, message: "Informe o valor do empréstimo." };
  }

  const valorTotal = Number(valorTotalRaw.replace(",", "."));

  if (Number.isNaN(valorTotal) || valorTotal <= 0) {
    return { success: false, message: "Informe um valor válido." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("emprestimos").insert({
    emprestador_nome: emprestadorNome,
    devedor_id: devedorId,
    titulo,
    valor_total: valorTotal,
    data_vencimento: dataVencimento || null,
    observacoes: observacoes || null,
    created_by: user?.id ?? null,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/devedores");
  revalidatePath("/pagamentos");
  revalidatePath("/emprestimos/novo");

  return {
    success: true,
    message: "Empréstimo cadastrado com sucesso.",
  };
}

export async function deleteLoan(formData: FormData) {
  const supabase = await createClient();

  const loanId = String(formData.get("loan_id") ?? "").trim();

  if (!loanId) {
    return;
  }

  await supabase.from("emprestimos").delete().eq("id", loanId);

  revalidatePath("/dashboard");
  revalidatePath("/devedores");
  revalidatePath("/pagamentos");
  revalidatePath("/emprestimos/novo");
}