"use client";

import { useActionState, useEffect, useState } from "react";
import { registerPayment } from "@/app/actions/payments";

type EmprestimoOption = {
  id: string;
  devedor_nome: string;
  titulo: string;
  valor_restante: number | string;
  data_vencimento: string | null;
  status_calculado: string;
};

type Props = {
  emprestimos: EmprestimoOption[];
};

const initialState = {
  success: false,
  message: "",
};

export default function PaymentForm({ emprestimos }: Props) {
  const [state, formAction, isPending] = useActionState(registerPayment, initialState);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("payment-form") as HTMLFormElement | null;
      form?.reset();
      setSelectedId("");
    }
  }, [state.success]);

  const selectedLoan = emprestimos.find((item) => item.id === selectedId);

  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
          Pagamentos
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Registrar pagamento</h2>
        <p className="mt-2 text-slate-600">
          Escolha o empréstimo e registre quanto foi pago.
        </p>
      </div>

      <form id="payment-form" action={formAction} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Empréstimo</label>
          <select
            name="emprestimo_id"
            required
            defaultValue=""
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          >
            <option value="" disabled>
              Selecione um empréstimo
            </option>
            {emprestimos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.devedor_nome} • {item.titulo} • R$ {Number(item.valor_restante).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {selectedLoan ? (
          <div className="rounded-2xl bg-green-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Devedor:</span> {selectedLoan.devedor_nome}
            </p>
            <p>
              <span className="font-semibold">Título:</span> {selectedLoan.titulo}
            </p>
            <p>
              <span className="font-semibold">Valor restante:</span> R${" "}
              {Number(selectedLoan.valor_restante).toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {selectedLoan.status_calculado}
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Valor pago</label>
            <input
              name="valor_pago"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="150.00"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Data do pagamento
            </label>
            <input
              name="data_pagamento"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Observações</label>
          <textarea
            name="observacoes"
            rows={4}
            placeholder="Ex.: pagou parte no pix"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
        >
          {isPending ? "Salvando..." : "Registrar pagamento"}
        </button>

        {state.message ? (
          <p className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
