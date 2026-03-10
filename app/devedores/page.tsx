import DebtorForm from "@/components/debtor-form";
import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

type DevedorResumo = {
  nome: string;
  apelido: string | null;
  telefone: string | null;
  observacoes: string | null;
  total_aberto: number;
  total_pago: number;
  atrasados: number;
};

export default async function DevedoresPage() {
  const supabase = await createClient();

  const [{ data: devedores }, { data: emprestimos }] = await Promise.all([
    supabase.from("devedores").select("*").order("created_at", { ascending: false }),
    supabase.from("vw_emprestimos_resumo").select("*"),
  ]);

  const resumoMap = new Map<string, DevedorResumo>();

  for (const pessoa of devedores ?? []) {
    resumoMap.set(pessoa.nome, {
      nome: pessoa.nome,
      apelido: pessoa.apelido,
      telefone: pessoa.telefone,
      observacoes: pessoa.observacoes,
      total_aberto: 0,
      total_pago: 0,
      atrasados: 0,
    });
  }

  for (const item of emprestimos ?? []) {
    const resumo = resumoMap.get(item.devedor_nome);

    if (!resumo) continue;

    resumo.total_aberto += Number(item.valor_restante ?? 0);
    resumo.total_pago += Number(item.valor_pago ?? 0);

    if (item.status_calculado === "atrasado") {
      resumo.atrasados += 1;
    }
  }

  const cards = Array.from(resumoMap.values());

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <DebtorForm />

          <div>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
                Lista
              </p>
              <h2 className="mt-2 text-4xl font-black text-slate-900">Devedores cadastrados</h2>
              <p className="mt-2 text-slate-600">
                Veja o resumo de cada pessoa cadastrada no banco da família.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {cards.map((pessoa) => (
                <div
                  key={pessoa.nome}
                  className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
                >
                  <p className="text-xl font-bold text-slate-900">{pessoa.nome}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {pessoa.apelido || "Sem apelido"}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-green-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                        Pago
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formatCurrency(pessoa.total_pago)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-red-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600">
                        Em aberto
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formatCurrency(pessoa.total_aberto)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 p-3">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Telefone:</span>{" "}
                      {pessoa.telefone || "Sem telefone"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold">Atrasos:</span> {pessoa.atrasados}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {pessoa.observacoes || "Sem observações"}
                    </p>
                  </div>
                </div>
              ))}

              {!cards.length ? (
                <div className="rounded-3xl border border-dashed border-green-200 bg-white p-6 text-slate-500">
                  Nenhum devedor cadastrado ainda.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
