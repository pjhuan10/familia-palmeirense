import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_35%),linear-gradient(to_bottom,_#ffffff,_#f7fbf7)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
            Família Palmerense
          </p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-slate-900 md:text-7xl">
            O banco mais organizado da família.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Registre empréstimos, acompanhe vencimentos, marque pagamentos e veja quem
            está em dia com a tia.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Entrar no sistema
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-green-200 bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50"
            >
              Ver dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
