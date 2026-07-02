"use client";

import { FormEvent, useMemo, useState } from "react";
import { SERVICES, TIME_SLOTS, isClosedDate, isPastDate, validateAppointmentInput } from "@/lib/booking";

const initialState = {
  customerName: "",
  phone: "",
  email: "",
  service: "",
  appointmentDate: "",
  startTime: "",
  note: ""
};

export function BookingForm() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const validationError = validateAppointmentInput(form);

    if (validationError) {
      setMessageType("error");
      setMessage(validationError);
      return;
    }

    setIsConfirmModalOpen(true);
  }

  async function createBooking() {
    setMessage("");
    setIsConfirmModalOpen(false);
    setIsSubmitting(true);

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const result = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessageType("error");
      setMessage(result.error || "Die Reservierung konnte nicht erstellt werden.");
      return;
    }

    setMessageType("success");
    setMessage("Vielen Dank. Ihre Terminanfrage wurde erfolgreich gespeichert.");
    setIsSuccessModalOpen(true);
    setForm(initialState);
  }

  const dateHint =
    form.appointmentDate && (isClosedDate(form.appointmentDate) || isPastDate(form.appointmentDate))
      ? "Dieses Datum ist nicht buchbar."
      : "Dienstag bis Samstag, jeweils 09:00 bis 18:00.";

  return (
    <form onSubmit={submitBooking} className="grid gap-4 rounded border border-gold/30 bg-white p-5 shadow-glow md:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Termin buchen</p>
        <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Ihr Besuch bei Legend Hair</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Wählen Sie Dienstleistung, Datum und Uhrzeit. Falls der Termin bereits vergeben ist, erhalten Sie direkt eine
          kurze Meldung.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Name *
          <input
            data-testid="booking-name"
            value={form.customerName}
            onChange={(event) => updateField("customerName", event.target.value)}
            className="h-12 rounded border border-neutral-300 bg-pearl px-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
            placeholder="Vor- und Nachname"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Telefon *
          <input
            data-testid="booking-phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="h-12 rounded border border-neutral-300 bg-pearl px-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
            placeholder="Telefonnummer"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-ink">
        E-Mail
        <input
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="h-12 rounded border border-neutral-300 bg-pearl px-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          placeholder="Optional"
          type="email"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        Dienstleistung *
        <select
          data-testid="booking-service"
          value={form.service}
          onChange={(event) => updateField("service", event.target.value)}
          className="h-12 rounded border border-neutral-300 bg-pearl px-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
        >
          <option value="">Bitte auswählen</option>
          {SERVICES.map((service) => (
            <option value={service} key={service}>
              {service}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Datum *
          <input
            data-testid="booking-date"
            value={form.appointmentDate}
            onChange={(event) => updateField("appointmentDate", event.target.value)}
            onInput={(event) => updateField("appointmentDate", event.currentTarget.value)}
            className="h-12 rounded border border-neutral-300 bg-pearl px-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
            min={minDate}
            type="date"
          />
          <span className="text-xs font-normal text-neutral-500">{dateHint}</span>
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Uhrzeit *
          <select
            data-testid="booking-time"
            value={form.startTime}
            onChange={(event) => updateField("startTime", event.target.value)}
            className="h-12 rounded border border-neutral-300 bg-pearl px-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">Bitte auswählen</option>
            {TIME_SLOTS.map((slot) => (
              <option value={slot} key={slot}>
                {slot}
              </option>
            ))}
          </select>
          <span className="text-xs font-normal text-neutral-500">Jeder Termin dauert eine Stunde.</span>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-ink">
        Nachricht
        <textarea
          value={form.note}
          onChange={(event) => updateField("note", event.target.value)}
          className="min-h-28 rounded border border-neutral-300 bg-pearl px-3 py-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          placeholder="Optional, z. B. Farbwunsch oder besondere Hinweise"
        />
      </label>

      {message ? (
        <p
          className={`rounded border px-4 py-3 text-sm ${
            messageType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded bg-gold px-5 text-sm font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Wird gesendet..." : "Termin anfragen"}
      </button>

      {isConfirmModalOpen ? (
        <div data-testid="booking-confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4">
          <div className="w-full max-w-md rounded border border-gold/40 bg-white p-7 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Termin bestätigen</p>
            <h3 className="mt-3 font-display text-3xl text-ink">Stimmt alles?</h3>
            <p className="mt-4 leading-7 text-neutral-700">
              Sie möchten am <strong>{form.appointmentDate}</strong> um <strong>{form.startTime}</strong> Uhr die
              Dienstleistung <strong>{form.service}</strong> buchen.
            </p>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Möchten Sie diesen Termin verbindlich anfragen?</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="h-11 rounded border border-ink px-5 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-pearl"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Abbrechen
              </button>
              <button
                type="button"
                className="h-11 rounded bg-gold px-5 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-gold-soft"
                onClick={createBooking}
              >
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSuccessModalOpen ? (
        <div data-testid="booking-success-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4">
          <div className="w-full max-w-md rounded border border-gold/40 bg-white p-7 text-center shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Termin erstellt</p>
            <h3 className="mt-3 font-display text-3xl text-ink">Vielen Dank!</h3>
            <p className="mt-4 leading-7 text-neutral-700">
              Ihr Termin wurde erfolgreich erstellt. Falls es eine Änderung gibt, werden Sie informiert. Bis bald bei
              Legend Hair.
            </p>
            <button
              type="button"
              className="mt-6 h-11 rounded bg-gold px-6 text-sm font-bold uppercase tracking-[0.16em] text-ink transition hover:bg-gold-soft"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Schließen
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
