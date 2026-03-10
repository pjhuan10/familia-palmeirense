import Navbar from "@/components/navbar";
import SummaryCard from "@/components/summary-card";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BanknoteArrowUp, CircleDollarSign, Clock3, TriangleAlert } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: resumo }, { data: devedores }, { data: vencimentos }] = await Promise.all([
    supabase.from("vw_emprestimos_resumo").select("*"),
    supabase.from("devedores").select("id"),
    supabase
      .from("vw_emprestimos_resumo")
      .select("*")
      .order("data_vencimento", { ascending: true })
      .limit(5),
  ]);

  const totalEmprestado =
    resumo?.reduce((acc, item) => acc + Number(item.valor_total ?? 0), 0) ?? 0;
  const totalRestante =
    resumo?.reduce((acc, item) => acc + Number(item.valor_restante ?? 0), 0) ?? 0;
  const atrasados =
    resumo?.filter((item) => item.status_calculado === "atrasado").length ?? 0;

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
            Painel geral
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Dashboard Palmerense</h2>
          <p className="mt-2 text-slate-600">
            Uma visão rápida do que foi emprestado, do que falta receber e dos próximos vencimentos.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total emprestado"
            value={formatCurrency(totalEmprestado)}
            subtitle="Soma de todos os empréstimos"
            icon={<BanknoteArrowUp size={22} />}
          />
          <SummaryCard
            title="Total pendente"
            value={formatCurrency(totalRestante)}
            subtitle="Valor ainda em aberto"
            icon={<CircleDollarSign size={22} />}
          />
          <SummaryCard
            title="Devedores cadastrados"
            value={String(devedores?.length ?? 0)}
            subtitle="Pessoas registradas no sistema"
            icon={<Clock3 size={22} />}
          />
          <SummaryCard
            title="Atrasados"
            value={String(atrasados)}
            subtitle="Registros vencidos sem quitação"
            icon={<TriangleAlert size={22} />}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold text-green-700">Próximos vencimentos</p>
              <h3 className="text-2xl font-bold text-slate-900">Agenda de cobrança</h3>
            </div>

            <div className="space-y-4">
              {vencimentos?.length ? (
                vencimentos.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{item.devedor_nome}</p>
                      <p className="text-sm text-slate-500">{item.titulo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">
                        {formatCurrency(Number(item.valor_restante ?? 0))}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(item.data_vencimento)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">Nenhum vencimento encontrado.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold text-green-700">Clima da família</p>
              <h3 className="text-2xl font-bold text-slate-900">Resumo rápido</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm text-green-800">Em aberto</p>
                <p className="mt-1 text-2xl font-bold text-green-900">
                  {formatCurrency(totalRestante)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Quantidade de registros</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {String(resumo?.length ?? 0)}
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-green-200 p-4">
                <p className="text-sm text-slate-600">
                  Dica: depois a gente pode adicionar ranking dos pagadores e mural dos atrasados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
