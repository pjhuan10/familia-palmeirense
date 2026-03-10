import Navbar from "@/components/navbar";
import PaymentForm from "@/components/payment-form";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PagamentosPage() {
  const supabase = await createClient();

  const [{ data: emprestimos }, { data: pagamentos }] = await Promise.all([
    supabase
      .from("vw_emprestimos_resumo")
      .select("id, devedor_nome, titulo, valor_restante, data_vencimento, status_calculado")
      .gt("valor_restante", 0)
      .order("data_vencimento", { ascending: true }),
    supabase
      .from("pagamentos")
      .select("id, valor_pago, data_pagamento, observacoes, emprestimos(titulo, devedores(nome))")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const paymentOptions =
    emprestimos?.map((item) => ({
      id: item.id,
      devedor_nome: item.devedor_nome,
      titulo: item.titulo,
      valor_restante: item.valor_restante,
      data_vencimento: item.data_vencimento,
      status_calculado: item.status_calculado,
    })) ?? [];

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <PaymentForm emprestimos={paymentOptions} />

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                Histórico
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Últimos pagamentos</h2>
            </div>

            <div className="space-y-4">
              {pagamentos?.length ? (
                pagamentos.map((pagamento) => {
                  const emprestimo = Array.isArray(pagamento.emprestimos)
                    ? pagamento.emprestimos[0]
                    : pagamento.emprestimos;

                  const devedor = emprestimo && "devedores" in emprestimo
                    ? Array.isArray(emprestimo.devedores)
                      ? emprestimo.devedores[0]
                      : emprestimo.devedores
                    : null;

                  return (
                    <div
                      key={pagamento.id}
                      className="rounded-2xl border border-slate-100 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {devedor?.nome ?? "Devedor"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {emprestimo?.titulo ?? "Empréstimo"}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">
                            {pagamento.observacoes || "Sem observações"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-700">
                            {formatCurrency(Number(pagamento.valor_pago))}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatDate(pagamento.data_pagamento)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500">Nenhum pagamento registrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
