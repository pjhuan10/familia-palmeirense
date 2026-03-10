import Navbar from "@/components/navbar";
import DeleteLoanButton from "@/components/delete-loan-button";
import RegisterPaymentButton from "@/components/register-payment-button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

type LoanRow = {
  id: string;
  devedor_nome: string;
  emprestador_nome: string | null;
  titulo: string;
  valor_total: number | string;
  valor_pago: number | string;
  valor_restante: number | string;
  data_vencimento: string | null;
  status_calculado: string;
};

function getStatusLabel(status: string) {
  switch (status) {
    case "pago":
      return "Pago";
    case "atrasado":
      return "Atrasado";
    case "parcial":
      return "Parcial";
    case "pendente":
      return "Pendente";
    case "cancelado":
      return "Cancelado";
    default:
      return status;
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "pago":
      return "bg-green-50 text-green-700 border-green-200";
    case "atrasado":
      return "bg-red-50 text-red-600 border-red-200";
    case "parcial":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "pendente":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "cancelado":
      return "bg-slate-100 text-slate-500 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default async function EmprestimosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("vw_emprestimos_resumo")
    .select("*")
    .order("created_at", { ascending: false });

  const emprestimos = (data ?? []) as LoanRow[];

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
            Gestão
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Todos os empréstimos</h2>
          <p className="mt-2 text-slate-600">
            Visualize todos os registros da família em uma tabela completa.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-green-50">
                <tr className="text-sm text-slate-700">
                  <th className="px-4 py-4 font-semibold">Emprestado por</th>
                  <th className="px-4 py-4 font-semibold">Devedor</th>
                  <th className="px-4 py-4 font-semibold">Título</th>
                  <th className="px-4 py-4 font-semibold">Total</th>
                  <th className="px-4 py-4 font-semibold">Pago</th>
                  <th className="px-4 py-4 font-semibold">Restante</th>
                  <th className="px-4 py-4 font-semibold">Vencimento</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Ações</th>
                </tr>
              </thead>

              <tbody>
                {emprestimos.length ? (
                  emprestimos.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.emprestador_nome || "Não informado"}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{item.devedor_nome}</p>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.titulo}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        {formatCurrency(Number(item.valor_total ?? 0))}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {formatCurrency(Number(item.valor_pago ?? 0))}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-green-700">
                        {formatCurrency(Number(item.valor_restante ?? 0))}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {formatDate(item.data_vencimento)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            item.status_calculado,
                          )}`}
                        >
                          {getStatusLabel(item.status_calculado)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {Number(item.valor_restante ?? 0) > 0 ? (
                            <RegisterPaymentButton loanId={item.id} />
                          ) : null}
                          <DeleteLoanButton loanId={item.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      Nenhum empréstimo cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
