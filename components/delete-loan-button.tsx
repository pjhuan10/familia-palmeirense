"use client";

import { Trash2 } from "lucide-react";
import { deleteLoan } from "@/app/actions/loans";

type Props = {
  loanId: string;
};

export default function DeleteLoanButton({ loanId }: Props) {
  return (
    <form
      action={deleteLoan}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Tem certeza que deseja excluir este empréstimo? Essa ação também remove os pagamentos vinculados.",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="loan_id" value={loanId} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        <Trash2 size={15} />
        Excluir
      </button>
    </form>
  );
}
