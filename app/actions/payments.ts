"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type PaymentActionState = {
  success: boolean;
  message: string;
};

function normalizeAmount(value: string) {
  const normalized = Number(value.replace(",", "."));
  return Number.isNaN(normalized) ? 0 : normalized;
}

async function insertPaymentIntoDatabase(formData: FormData) {
  const supabase = await createClient();

  const emprestimoId = String(formData.get("emprestimo_id") ?? "").trim();
  const valorPagoRaw = String(formData.get("valor_pago") ?? "").trim();
  const dataPagamento = String(formData.get("data_pagamento") ?? "").trim();
  const observacoes = String(formData.get("observacoes") ?? "").trim();

  if (!emprestimoId) {
    return { ok: false, message: "Empréstimo não informado." };
  }

  if (!valorPagoRaw) {
    return { ok: false, message: "Informe o valor do pagamento." };
  }

  const valorPago = normalizeAmount(valorPagoRaw);

  if (valorPago <= 0) {
    return { ok: false, message: "Informe um valor válido para o pagamento." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("pagamentos").insert({
    emprestimo_id: emprestimoId,
    valor_pago: valorPago,
    data_pagamento: dataPagamento || new Date().toISOString().slice(0, 10),
    observacoes: observacoes || null,
    created_by: user?.id ?? null,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/pagamentos");
  revalidatePath("/devedores");
  revalidatePath("/emprestimos/novo");

  return { ok: true, message: "Pagamento registrado com sucesso." };
}

export async function registerPayment(formData: FormData) {
  await insertPaymentIntoDatabase(formData);
}

export async function registerPaymentWithState(
  _prevState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const result = await insertPaymentIntoDatabase(formData);

  return {
    success: result.ok,
    message: result.message,
  };
}
