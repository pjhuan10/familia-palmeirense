import Navbar from "@/components/navbar";
import FamilyEventForm from "@/components/family-event-form";
import DeleteFamilyEventButton from "@/components/delete-family-event-button";
import FamilyPhotoUploadForm from "@/components/family-photo-upload-form";
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

type Evento = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  category: string;
};

type Foto = {
  id: string;
  event_id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
};

export default async function AgendaPage() {
  const supabase = await createClient();

  const [{ data: eventos }, { data: fotos }] = await Promise.all([
    supabase
      .from("family_events")
      .select("*")
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true }),
    supabase
      .from("family_event_photos")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const eventosTyped = (eventos ?? []) as Evento[];
  const fotosTyped = (fotos ?? []) as Foto[];

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
            {eventosTyped.length ? (
              eventosTyped.map((evento) => {
                const fotosDoEvento = fotosTyped.filter((foto) => foto.event_id === evento.id);

                return (
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

                    <FamilyPhotoUploadForm eventId={evento.id} />

                    {fotosDoEvento.length ? (
                      <div className="mt-5">
                        <p className="mb-3 text-sm font-semibold text-slate-700">
                          Fotos do evento
                        </p>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {fotosDoEvento.map((foto) => (
                            <div
                              key={foto.id}
                              className="overflow-hidden rounded-2xl border border-slate-100 bg-white/60"
                            >
                              <img
                                src={foto.photo_url}
                                alt={foto.caption || "Foto do evento"}
                                className="h-32 w-full object-cover transition duration-200 hover:scale-[1.02]"
                              />
                              {foto.caption ? (
                                <div className="px-3 py-2 text-xs text-slate-600">
                                  {foto.caption}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 flex justify-end">
                      <DeleteFamilyEventButton eventId={evento.id} />
                    </div>
                  </div>
                );
              })
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
