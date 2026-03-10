"use client";

import { useActionState, useEffect } from "react";
import { createDebtor } from "@/app/actions/debtors";

const initialState = {
  success: false,
  message: "",
};

export default function DebtorForm() {
  const [state, formAction, isPending] = useActionState(createDebtor, initialState);

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("debtor-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
          Cadastro
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Novo devedor</h2>
        <p className="mt-2 text-slate-600">
          Cadastre uma pessoa para depois vincular empréstimos e pagamentos.
        </p>
      </div>

      <form id="debtor-form" action={formAction} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Nome</label>
          <input
            name="nome"
            required
            placeholder="Ex.: Tio Marcos"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Apelido</label>
            <input
              name="apelido"
              placeholder="Ex.: Marcão"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Telefone</label>
            <input
              name="telefone"
              placeholder="(11) 99999-9999"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Observações</label>
          <textarea
            name="observacoes"
            rows={4}
            placeholder="Ex.: sempre diz que paga no próximo salário"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
        >
          {isPending ? "Salvando..." : "Cadastrar devedor"}
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
