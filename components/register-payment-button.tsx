"use client";

import { registerPayment } from "@/app/actions/payments";
import { useState } from "react";

type Props = {
  loanId: string;
};

export default function RegisterPaymentButton({ loanId }: Props) {
  const [valor, setValor] = useState("");

  return (
    <form action={registerPayment} className="flex items-center gap-2">
      <input type="hidden" name="emprestimo_id" value={loanId} />

      <input
        name="valor_pago"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
      />

      <button
        type="submit"
        className="rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
      >
        Pagar
      </button>
    </form>
  );
}
