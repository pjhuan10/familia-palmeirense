import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DevedoresPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("devedores")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
            Cadastro
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Devedores</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.map((pessoa) => (
            <div
              key={pessoa.id}
              className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
            >
              <p className="text-xl font-bold text-slate-900">{pessoa.nome}</p>
              <p className="mt-1 text-sm text-slate-500">{pessoa.apelido || "Sem apelido"}</p>
              <p className="mt-4 text-sm text-slate-600">{pessoa.telefone || "Sem telefone"}</p>
              <p className="mt-2 text-sm text-slate-500">
                {pessoa.observacoes || "Sem observações"}
              </p>
            </div>
          ))}

          {!data?.length ? (
            <div className="rounded-3xl border border-dashed border-green-200 bg-white p-6 text-slate-500">
              Nenhum devedor cadastrado ainda.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
