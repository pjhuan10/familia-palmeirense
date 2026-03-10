import Navbar from "@/components/navbar";
import LoanForm from "@/components/loan-form";
import { createClient } from "@/lib/supabase/server";

export default async function NovoEmprestimoPage() {
  const supabase = await createClient();
  const { data: devedores } = await supabase
    .from("devedores")
    .select("id, nome")
    .order("nome");

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
            Registre um novo empréstimo para um devedor já cadastrado.
          </p>
        </div>

        <LoanForm devedores={devedores ?? []} />
      </section>
    </main>
  );
}
