"use client";

import { useActionState, useEffect } from "react";
import { createFamilyEvent } from "@/app/actions/family-events";

const initialState = {
  success: false,
  message: "",
};

export default function FamilyEventForm() {
  const [state, formAction, isPending] = useActionState(createFamilyEvent, initialState);

  useEffect(() => {
    if (state.success) {
      const form = document.getElementById("family-event-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.success]);

  return (
    <div className="glass-card lift-hover rounded-[30px] p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
          Agenda da família
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Novo evento</h2>
        <p className="mt-2 text-slate-600">
          Cadastre aniversários, churrascos, reuniões e confraternizações.
        </p>
      </div>

      <form id="family-event-form" action={formAction} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Título</label>
          <input
            name="title"
            required
            placeholder="Ex.: Churrasco da família"
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Categoria</label>
            <select
              name="category"
              defaultValue="confraternizacao"
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
            >
              <option value="aniversario">Aniversário</option>
              <option value="churrasco">Churrasco</option>
              <option value="almoco">Almoço</option>
              <option value="culto">Culto</option>
              <option value="viagem">Viagem</option>
              <option value="reuniao">Reunião</option>
              <option value="confraternizacao">Confraternização</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Local</label>
            <input
              name="location"
              placeholder="Ex.: Casa da Joice"
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Data</label>
            <input
              name="event_date"
              type="date"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Horário</label>
            <input
              name="event_time"
              type="time"
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Descrição</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Ex.: Levar carne, refrigerante e bolo"
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
        >
          {isPending ? "Salvando..." : "Salvar evento"}
        </button>

        {state.message ? (
          <p className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
