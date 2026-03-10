import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function NovoEmprestimoPage() {
  const supabase = await createClient();
  const { data: devedores } = await supabase.from("devedores").select("id, nome").order("nome");

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
            Novo registro
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Cadastrar empréstimo</h2>
          <p className="mt-2 text-slate-600">
            Nessa primeira versão, deixei a tela pronta visualmente. No próximo passo eu te mando o form salvando no banco.
          </p>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Devedor</label>
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500">
                <option>Selecione</option>
                {devedores?.map((item) => (
                  <option key={item.id}>{item.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Valor</label>
              <input
                placeholder="R$ 0,00"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Título</label>
              <input
                placeholder="Ajuda no cartão"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Vencimento</label>
              <input
                type="date"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Observações</label>
            <textarea
              rows={5}
              placeholder="Ex.: combinou pagar no próximo salário"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <button className="mt-6 rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">
            Salvar empréstimo
          </button>
        </div>
      </section>
    </main>
  );
}
