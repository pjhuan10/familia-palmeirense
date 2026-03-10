"use client";

import { Trash2 } from "lucide-react";
import { deleteFamilyEvent } from "@/app/actions/family-events";

type Props = {
  eventId: string;
};

export default function DeleteFamilyEventButton({ eventId }: Props) {
  return (
    <form
      action={deleteFamilyEvent}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Tem certeza que deseja excluir este evento da agenda da família?",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="event_id" value={eventId} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        <Trash2 size={15} />
        Excluir
      </button>
    </form>
  );
}
