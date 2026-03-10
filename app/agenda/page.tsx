import Navbar from "@/components/navbar";
import FamilyEventForm from "@/components/family-event-form";
import DeleteFamilyEventButton from "@/components/delete-family-event-button";
import { createClient } from "@/lib/supabase/server";

function formatEventDate(date: string, time?: string | null) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR").format(
    new Date(`${date}T00:00:00`),
  );

  if (!time) return formattedDate;

  return `${formattedDate} às ${time.slice(0, 5)}`;
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "aniversario":
      return "Aniversário";
    case "churrasco":
      return "Churrasco";
    case "almoco":
      return "Almoço";
    case "culto":
      return "Culto";
    case "viagem":
      return "Viagem";
    case "reuniao":
      return "Reunião";
    case "confraternizacao":
      return "Confraternização";
    default:
      return "Outro";
  }
}

export default async function AgendaPage() {
  const supabase = await createClient();

  const { data: eventos } = await supabase
    .from("family_events")
    .select("*")
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true });

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
            Família
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Agenda da Família</h2>
          <p className="mt-2 text-slate-600">
            Organize aniversários, festas, churrascos e encontros em um só lugar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <FamilyEventForm />

          <div className="space-y-4">
            {eventos?.length ? (
              eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="glass-card lift-hover rounded-[28px] p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                        {getCategoryLabel(evento.category)}
                      </p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {evento.title}
                      </h3>
                    </div>

                    <div className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {formatEventDate(evento.event_date, evento.event_time)}
                    </div>
                  </div>

                  {evento.location ? (
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Local:</span> {evento.location}
                    </p>
                  ) : null}

                  {evento.description ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {evento.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex justify-end">
                    <DeleteFamilyEventButton eventId={evento.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card rounded-[28px] p-6 text-slate-500">
                Nenhum evento cadastrado ainda.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
