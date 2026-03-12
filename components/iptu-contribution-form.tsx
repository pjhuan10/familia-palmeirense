"use client";

import { useActionState, useEffect } from "react";
import { registerIptuContribution } from "@/app/actions/iptu";

type InstallmentOption = {
  id: string;
  label: string;
};

type Props = {
  installments: InstallmentOption[];
  defaultInstallmentId?: string;
};

const initialState = {
  success: false,
  message: "",
};

const people = ["Joice", "Leandro", "Everton", "Robson", "Sheila", "Sabryna"];

export default function IptuContributionForm({
  installments,
  defaultInstallmentId,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    registerIptuContribution,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("iptu-contribution-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.success]);

  return (
    <form id="iptu-contribution-form" action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Mês</label>
          <select
            name="installment_id"
            defaultValue={defaultInstallmentId ?? ""}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
          >
            <option value="">Selecione</option>
            {installments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Pessoa</label>
          <select
            name="person_name"
            required
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
          >
            <option value="">Selecione</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Valor</label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder="112.50"
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Data do pagamento</label>
          <input
            name="paid_at"
            type="date"
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Observação</label>
        <input
          name="notes"
          placeholder="Ex.: ajudou Sheila"
          className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Registrar pagamento"}
      </button>

      {state.message ? (
        <p className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
