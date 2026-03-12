import Navbar from "@/components/navbar";
import IptuContributionForm from "@/components/iptu-contribution-form";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

type Cycle = {
  id: string;
  year: number;
  monthly_amount: number | string;
};

type Installment = {
  id: string;
  month_number: number;
  due_date: string;
  amount: number | string;
};

type Contribution = {
  id: string;
  installment_id: string;
  person_name: string;
  contribution_type: "principal" | "extra";
  amount: number | string;
  paid_at: string | null;
  notes: string | null;
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const principalPeople = ["Leandro", "Everton", "Robson"];
const extraPeople = ["Joice", "Sheila", "Sabryna"];

function getInstallmentStatus(dueDate: string, paidAmount: number, amount: number) {
  const today = new Date();
  const due = new Date(`${dueDate}T00:00:00`);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (paidAmount >= amount) return "paid";
  if (diffDays < 0) return "late";
  if (diffDays <= 15) return "due_soon";
  return "future";
}

function getStatusStyles(status: string) {
  switch (status) {
    case "paid":
      return "border-green-200 bg-green-50 text-green-700";
    case "late":
      return "border-red-200 bg-red-50 text-red-600";
    case "due_soon":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "paid":
      return "Pago";
    case "late":
      return "Atrasado";
    case "due_soon":
      return "Vence em breve";
    default:
      return "Futuro";
  }
}

export default async function IptuPage() {
  const supabase = await createClient();

  const [{ data: cycle }, { data: installments }, { data: contributions }] = await Promise.all([
    supabase.from("iptu_cycles").select("*").eq("year", 2026).maybeSingle(),
    supabase
      .from("iptu_installments")
      .select("*")
      .order("month_number", { ascending: true }),
    supabase
      .from("iptu_contributions")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const currentCycle = cycle as Cycle | null;
  const installmentRows = (installments ?? []) as Installment[];
  const contributionRows = (contributions ?? []) as Contribution[];

  const monthlyAmount = Number(currentCycle?.monthly_amount ?? 450);
  const principalShare = monthlyAmount / 3;
  const totalYear = installmentRows.reduce((acc, item) => acc + Number(item.amount ?? 0), 0);
  const totalPaid = contributionRows.reduce((acc, item) => acc + Number(item.amount ?? 0), 0);
  const totalOpen = totalYear - totalPaid;

  const activeInstallment =
    installmentRows.find((item) => {
      const paidAmount = contributionRows
        .filter((c) => c.installment_id === item.id)
        .reduce((acc, c) => acc + Number(c.amount ?? 0), 0);

      return paidAmount < Number(item.amount ?? 0);
    }) ?? installmentRows[0];

  const activeContributions = activeInstallment
    ? contributionRows.filter((item) => item.installment_id === activeInstallment.id)
    : [];

  const paidPrincipalPeople = Array.from(
    new Set(
      activeContributions
        .filter((item) => item.contribution_type === "principal")
        .map((item) => item.person_name),
    ),
  );

  const missingPrincipalPeople = principalPeople.filter(
    (person) => !paidPrincipalPeople.includes(person),
  );

  const installmentOptions = installmentRows.map((item) => ({
    id: item.id,
    label: `${monthNames[item.month_number - 1]} / 2026`,
  }));

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
            Patrimônio
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">IPTU 2026</h2>
          <p className="mt-2 text-slate-600">
            Controle mensal do IPTU, com divisão principal e ajuda extra da família.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Valor mensal</p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {formatCurrency(monthlyAmount)}
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total do ano</p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {formatCurrency(totalYear)}
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total pago</p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Em aberto</p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {formatCurrency(totalOpen)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-green-700">Pagadores principais</p>
              <h3 className="text-2xl font-bold text-slate-900">Divisão do IPTU</h3>

              <div className="mt-5 space-y-3">
                {principalPeople.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3"
                  >
                    <span className="font-semibold text-slate-900">{name}</span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(principalShare)}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm font-semibold text-slate-700">Ajuda extra</p>

              <div className="mt-3 space-y-3">
                {extraPeople.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <span className="font-semibold text-slate-900">{name}</span>
                    <span className="text-sm text-slate-500">opcional</span>
                  </div>
                ))}
              </div>
            </div>

            {activeInstallment ? (
              <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-green-700">Mês em foco</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {monthNames[activeInstallment.month_number - 1]} / 2026
                </h3>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">Quem pagou</p>
                    <div className="space-y-3">
                      {activeContributions.length ? (
                        activeContributions.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-slate-100 bg-white/60 px-4 py-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-slate-900">
                                {item.person_name}
                              </span>
                              <span className="font-bold text-green-700">
                                {formatCurrency(Number(item.amount ?? 0))}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.contribution_type === "principal"
                                ? "Pagamento principal"
                                : "Ajuda extra"}
                              {item.notes ? ` • ${item.notes}` : ""}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Nenhum pagamento registrado ainda.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">Quem falta pagar</p>
                    <div className="space-y-3">
                      {missingPrincipalPeople.length ? (
                        missingPrincipalPeople.map((person) => (
                          <div
                            key={person}
                            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-slate-900">{person}</span>
                              <span className="font-bold text-amber-700">
                                {formatCurrency(principalShare)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-green-700">
                          Todos os pagadores principais já contribuíram neste mês.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-green-700">Registrar pagamento</p>
              <h3 className="text-2xl font-bold text-slate-900">Contribuição do IPTU</h3>
              <p className="mt-2 text-slate-600">
                Registre quem pagou a parcela do mês ou quem ajudou com valor extra.
              </p>

              <div className="mt-5">
                <IptuContributionForm
                  installments={installmentOptions}
                  defaultInstallmentId={activeInstallment?.id}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-green-700">Meses</p>
            <h3 className="text-2xl font-bold text-slate-900">Situação de 2026</h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {installmentRows.map((item) => {
                const paidAmount = contributionRows
                  .filter((c) => c.installment_id === item.id)
                  .reduce((acc, c) => acc + Number(c.amount ?? 0), 0);

                const amount = Number(item.amount ?? 0);
                const status = getInstallmentStatus(item.due_date, paidAmount, amount);

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border px-4 py-4 ${getStatusStyles(status)}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{monthNames[item.month_number - 1]}</p>
                        <p className="text-sm opacity-80">{getStatusLabel(status)}</p>
                      </div>

                      <span className="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold">
                        {formatCurrency(paidAmount)}
                      </span>
                    </div>

                    <div className="mt-3 text-sm opacity-80">
                      Total do mês: {formatCurrency(amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
