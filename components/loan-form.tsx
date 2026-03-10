"use client";

import { useActionState, useEffect } from "react";
import { createLoan } from "@/app/actions/loans";

type DevedorOption = {
  id: string;
  nome: string;
};

type Props = {
  devedores: DevedorOption[];
};

const initialState = {
  success: false,
  message: "",
};

export default function LoanForm({ devedores }: Props) {
  const [state, formAction, isPending] = useActionState(createLoan, initialState);

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("loan-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <form id="loan-form" action={formAction}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Quem emprestou
            </label>
            <input
              name="emprestador_nome"
              required
              placeholder="Ex.: Joice"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Devedor
            </label>
            <select
              name="devedor_id"
              required
              defaultValue=""
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            >
              <option value="" disabled>
                Selecione
              </option>
              {devedores.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Valor
            </label>
            <input
              name="valor_total"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="1030.00"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Vencimento
            </label>
            <input
              name="data_vencimento"
              type="date"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Título
            </label>
            <input
              name="titulo"
              required
              placeholder="Ajuda no cartão"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Observações
          </label>
          <textarea
            name="observacoes"
            rows={5}
            placeholder="Ex.: combinou pagar no próximo salário"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
        >
          {isPending ? "Salvando..." : "Salvar empréstimo"}
        </button>

        {state.message ? (
          <p className={`mt-4 text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}