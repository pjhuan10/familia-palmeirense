import {
  BanknoteArrowUp,
  CircleDollarSign,
  Clock3,
  TriangleAlert,
  Trophy,
} from "lucide-react";
import Navbar from "@/components/navbar";
import SummaryCard from "@/components/summary-card";
import DeleteLoanButton from "@/components/delete-loan-button";
import RegisterPaymentButton from "@/components/register-payment-button";
import DebtChart from "@/components/debt-chart";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

type LoanSummary = {
  id: string;
  devedor_id: string;
  devedor_nome: string;
  emprestador_nome: string | null;
  titulo: string;
  valor_total: number | string;
  valor_pago: number | string;
  valor_restante: number | string;
  data_vencimento: string | null;
  status_calculado: string;
};

type DebtorScore = {
  nome: string;
  totalAberto: number;
  pagos: number;
  atrasados: number;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: resumo }, { data: devedores }, { data: vencimentos }] = await Promise.all([
    supabase.from("vw_emprestimos_resumo").select("*"),
    supabase.from("devedores").select("id"),
    supabase
      .from("vw_emprestimos_resumo")
      .select("*")
      .gt("valor_restante", 0)
      .order("data_vencimento", { ascending: true })
      .limit(5),
  ]);

  const rows = (resumo ?? []) as LoanSummary[];

  const totalEmprestado = rows.reduce((acc, item) => acc + Number(item.valor_total ?? 0), 0);
  const totalRestante = rows.reduce((acc, item) => acc + Number(item.valor_restante ?? 0), 0);
  const atrasados = rows.filter((item) => item.status_calculado === "atrasado").length;

  const scoreMap = new Map<string, DebtorScore>();

  for (const item of rows) {
    const current = scoreMap.get(item.devedor_nome) ?? {
      nome: item.devedor_nome,
      totalAberto: 0,
      pagos: 0,
      atrasados: 0,
    };

    current.totalAberto += Number(item.valor_restante ?? 0);

    if (item.status_calculado === "pago") {
      current.pagos += 1;
    }

    if (item.status_calculado === "atrasado") {
      current.atrasados += 1;
    }

    scoreMap.set(item.devedor_nome, current);
  }

  const ranking = Array.from(scoreMap.values());

  const chartData = ranking
    .filter((item) => item.totalAberto > 0)
    .sort((a, b) => b.totalAberto - a.totalAberto)
    .slice(0, 6)
    .map((item) => ({
      nome: item.nome,
      totalAberto: Number(item.totalAberto.toFixed(2)),
    }));

  const bonsPagadores = ranking
    .filter((item) => item.pagos > 0)
    .sort((a, b) => {
      if (b.pagos !== a.pagos) return b.pagos - a.pagos;
      return a.totalAberto - b.totalAberto;
    })
    .slice(0, 5);

  const caloteiros = ranking
    .filter((item) => item.totalAberto > 0 || item.atrasados > 0)
    .sort((a, b) => {
      if (b.atrasados !== a.atrasados) return b.atrasados - a.atrasados;
      return b.totalAberto - a.totalAberto;
    })
    .slice(0, 5);

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
            Uma visão rápida do que foi emprestado, do que falta receber e de quem está em dia.
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
          <div className="space-y-6">
            {chartData.length ? <DebtChart data={chartData} /> : null}

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
                      className="rounded-2xl border border-slate-100 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{item.devedor_nome}</p>
                          <p className="text-sm text-slate-500">
                            Emprestado por: {item.emprestador_nome || "Não informado"}
                          </p>
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

                      <div className="mt-4 flex flex-wrap justify-end gap-3">
                        <RegisterPaymentButton loanId={item.id} />
                        <DeleteLoanButton loanId={item.id} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">Nenhum vencimento encontrado.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                  <Trophy size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">Ranking</p>
                  <h3 className="text-2xl font-bold text-slate-900">🏆 Pagadores em dia</h3>
                </div>
              </div>

              <div className="space-y-3">
                {bonsPagadores.length ? (
                  bonsPagadores.map((item, index) => (
                    <div
                      key={item.nome}
                      className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {index + 1}. {item.nome}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.pagos} pagamento(s) concluído(s)
                        </p>
                      </div>
                      <p className="text-sm font-bold text-green-700">
                        Aberto: {formatCurrency(item.totalAberto)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">Ainda não há pagamentos concluídos.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-sm font-semibold text-red-600">Ranking</p>
                <h3 className="text-2xl font-bold text-slate-900">💀 Caloteiros da família</h3>
              </div>

              <div className="space-y-3">
                {caloteiros.length ? (
                  caloteiros.map((item, index) => (
                    <div
                      key={item.nome}
                      className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {index + 1}. {item.nome}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.atrasados} registro(s) atrasado(s)
                        </p>
                      </div>
                      <p className="text-sm font-bold text-red-600">
                        Aberto: {formatCurrency(item.totalAberto)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">Ninguém atrasado. Milagre palmerense.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
