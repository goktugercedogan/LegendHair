"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Appointment, AppointmentStatus, TIME_SLOTS, validateAppointmentInput } from "@/lib/booking";
import {
  deleteBrowserDemoAppointment,
  listBrowserDemoAppointments,
  mergeDemoAppointments,
  updateBrowserDemoAppointmentDateTime,
  updateBrowserDemoAppointmentStatus
} from "@/lib/demo-browser-store";
import { createBrowserSupabaseClient } from "@/lib/supabase";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Offen",
  confirmed: "Bestätigt",
  cancelled: "Storniert",
  completed: "Erledigt"
};

type ViewMode = "all" | "day" | "week";

export function AdminDashboard() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  useEffect(() => {
    async function loadSession() {
      if (!supabase) {
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setToken(data.session.access_token);
        setIsLoggedIn(true);
      }
    }

    loadSession();
  }, [supabase]);

  const loadAppointments = useCallback(async () => {
    const response = await fetch("/api/appointments", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Termine konnten nicht geladen werden.");
      return;
    }

    const serverAppointments = result.appointments as Appointment[];
    const browserAppointments = supabase ? [] : listBrowserDemoAppointments();
    setAppointments(mergeDemoAppointments(serverAppointments, browserAppointments));
  }, [supabase, token]);

  useEffect(() => {
    if (isLoggedIn) {
      loadAppointments();
    }
  }, [isLoggedIn, loadAppointments]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);

      if (error || !data.session) {
        setMessage("Login fehlgeschlagen.");
        return;
      }

      setToken(data.session.access_token);
      setIsLoggedIn(true);
      return;
    }

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setIsLoading(false);

    if (!response.ok) {
      setMessage("Login fehlgeschlagen. Demo-Passwort: legend-demo");
      return;
    }

    setIsLoggedIn(true);
  }

  async function logout() {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      await fetch("/api/admin/logout", { method: "POST" });
    }

    setIsLoggedIn(false);
    setToken("");
    setAppointments([]);
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    const response = await fetch(`/api/appointments/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    });

    if (!supabase) {
      const updated = updateBrowserDemoAppointmentStatus(id, status);

      if (updated) {
        await loadAppointments();
        return;
      }
    }

    if (!response.ok) {
      setMessage("Status konnte nicht aktualisiert werden.");
      return;
    }

    await loadAppointments();
  }

  function openEditDialog(appointment: Appointment) {
    setMessage("");
    setEditingAppointment(appointment);
    setEditDate(appointment.appointmentDate);
    setEditTime(appointment.startTime);
  }

  async function updateAppointmentDateTime() {
    if (!editingAppointment) {
      return;
    }

    setMessage("");

    const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ appointmentDate: editDate, startTime: editTime })
    });
    const result = await response.json();

    if (!supabase) {
      const validationError = validateAppointmentInput({
        customerName: editingAppointment.customerName,
        phone: editingAppointment.phone,
        email: editingAppointment.email,
        service: editingAppointment.service,
        appointmentDate: editDate,
        startTime: editTime,
        note: editingAppointment.note
      });

      if (validationError) {
        setMessage(validationError);
        return;
      }

      const localResult = updateBrowserDemoAppointmentDateTime(editingAppointment.id, editDate, editTime);

      if (localResult.conflict) {
        setMessage("Dieser Termin ist leider nicht verfügbar. Bitte wählen Sie eine andere Uhrzeit.");
        return;
      }

      if (localResult.updated) {
        setEditingAppointment(null);
        await loadAppointments();
        return;
      }
    }

    if (!response.ok) {
      setMessage(result.error || "Termin konnte nicht geändert werden.");
      return;
    }

    setEditingAppointment(null);
    await loadAppointments();
  }

  async function deleteAppointment() {
    if (!deletingAppointment) {
      return;
    }

    setMessage("");

    const response = await fetch(`/api/appointments/${deletingAppointment.id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const result = await response.json();

    if (!supabase) {
      const deleted = deleteBrowserDemoAppointment(deletingAppointment.id);

      if (deleted) {
        setDeletingAppointment(null);
        await loadAppointments();
        return;
      }
    }

    if (!response.ok) {
      setMessage(result.error || "Termin konnte nicht gelöscht werden.");
      return;
    }

    setDeletingAppointment(null);
    await loadAppointments();
  }

  const visibleAppointments = appointments.filter((appointment) => {
    if (selectedTime && appointment.startTime !== selectedTime) {
      return false;
    }

    if (viewMode === "all") {
      return true;
    }

    if (viewMode === "day") {
      return appointment.appointmentDate === selectedDate;
    }

    const selected = new Date(`${selectedDate}T12:00:00`);
    const current = new Date(`${appointment.appointmentDate}T12:00:00`);
    const diff = current.getTime() - selected.getTime();
    return diff >= 0 && diff < 7 * 24 * 60 * 60 * 1000;
  });

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
        <form onSubmit={login} className="grid w-full max-w-md gap-4 rounded border border-gold/30 bg-white p-7 text-ink shadow-glow">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Inhaber-Panel</p>
            <h1 className="mt-2 font-display text-3xl">Login</h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Mit Supabase nutzen Sie die angelegte Inhaber-E-Mail. Ohne Supabase ist das Demo-Passwort
              <strong> legend-demo</strong>.
            </p>
          </div>
          {supabase ? (
            <label className="grid gap-2 text-sm font-medium">
              E-Mail
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded border border-neutral-300 bg-pearl px-3"
                type="email"
              />
            </label>
          ) : null}
          <label className="grid gap-2 text-sm font-medium">
            Passwort
            <input
              data-testid="admin-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded border border-neutral-300 bg-pearl px-3"
              type="password"
            />
          </label>
          {message ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{message}</p> : null}
          <button className="h-12 rounded bg-gold font-bold uppercase tracking-[0.16em] text-ink" disabled={isLoading}>
            {isLoading ? "Bitte warten..." : "Einloggen"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pearl px-4 py-8 text-ink md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-gold/30 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Legend Hair</p>
            <h1 className="mt-2 font-display text-4xl">Termine</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded border border-ink px-4 py-2 text-sm font-bold" onClick={loadAppointments}>
              Aktualisieren
            </button>
            <button className="rounded bg-ink px-4 py-2 text-sm font-bold text-white" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <section className="mt-6 flex flex-col gap-3 rounded border border-neutral-200 bg-white p-4 md:flex-row md:items-end">
          <label className="grid gap-2 text-sm font-medium">
            Datum
            <input
              data-testid="admin-date-filter"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-11 rounded border border-neutral-300 bg-pearl px-3"
              disabled={viewMode === "all"}
              type="date"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Uhrzeit
            <select
              data-testid="admin-time-filter"
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.target.value)}
              className="h-11 rounded border border-neutral-300 bg-pearl px-3"
            >
              <option value="">Alle Uhrzeiten</option>
              {TIME_SLOTS.map((slot) => (
                <option value={slot} key={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
          <div className="flex rounded border border-neutral-300 bg-pearl p-1">
            <button
              className={`rounded px-4 py-2 text-sm font-bold ${viewMode === "all" ? "bg-gold text-ink" : "text-neutral-600"}`}
              onClick={() => setViewMode("all")}
            >
              Alle
            </button>
            <button
              className={`rounded px-4 py-2 text-sm font-bold ${viewMode === "day" ? "bg-gold text-ink" : "text-neutral-600"}`}
              onClick={() => setViewMode("day")}
            >
              Tag
            </button>
            <button
              className={`rounded px-4 py-2 text-sm font-bold ${viewMode === "week" ? "bg-gold text-ink" : "text-neutral-600"}`}
              onClick={() => setViewMode("week")}
            >
              Woche
            </button>
          </div>
          <button className="rounded border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-700" onClick={() => {
            setViewMode("all");
            setSelectedTime("");
          }}>
            Filter zurücksetzen
          </button>
          <p className="text-sm text-neutral-600">{visibleAppointments.length} Termin(e) im aktuellen Filter</p>
        </section>

        {message ? <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{message}</p> : null}

        <section className="mt-6 overflow-hidden rounded border border-neutral-200 bg-white">
          <div className="hidden grid-cols-[0.7fr_0.75fr_1fr_1fr_1fr_0.85fr_1fr] gap-4 border-b border-neutral-200 bg-ink px-4 py-3 text-sm font-bold text-white md:grid">
            <span>Datum</span>
            <span>Zeit</span>
            <span>Kundin</span>
            <span>Kontakt</span>
            <span>Leistung</span>
            <span>Status</span>
            <span>Aktionen</span>
          </div>
          <div className="divide-y divide-neutral-100">
            {visibleAppointments.length ? (
              visibleAppointments.map((appointment) => (
                <article className="grid gap-3 px-4 py-4 text-sm md:grid-cols-[0.7fr_0.75fr_1fr_1fr_1fr_0.85fr_1fr]" key={appointment.id}>
                  <span>{appointment.appointmentDate}</span>
                  <span>
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                  <span>
                    <strong>{appointment.customerName}</strong>
                    {appointment.note ? <small className="mt-1 block text-neutral-500">{appointment.note}</small> : null}
                  </span>
                  <span>
                    {appointment.phone}
                    {appointment.email ? <small className="mt-1 block text-neutral-500">{appointment.email}</small> : null}
                  </span>
                  <span>{appointment.service}</span>
                  <label className="grid gap-1">
                    <span className="sr-only">Status</span>
                    <select
                      value={appointment.status}
                      onChange={(event) => updateStatus(appointment.id, event.target.value as AppointmentStatus)}
                      className="h-10 rounded border border-neutral-300 bg-pearl px-2"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="h-10 rounded border border-gold/60 px-3 text-sm font-bold text-ink transition hover:bg-gold/20"
                      onClick={() => openEditDialog(appointment)}
                    >
                      Ändern
                    </button>
                    <button
                      className="h-10 rounded border border-red-300 px-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                      onClick={() => {
                        setMessage("");
                        setDeletingAppointment(appointment);
                      }}
                    >
                      Löschen
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="px-4 py-10 text-center text-neutral-600">Keine Termine für diesen Zeitraum.</p>
            )}
          </div>
        </section>
      </div>

      {editingAppointment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4">
          <div className="w-full max-w-md rounded border border-gold/40 bg-white p-7 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Termin ändern</p>
            <h2 className="mt-3 font-display text-3xl text-ink">{editingAppointment.customerName}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {editingAppointment.phone} · {editingAppointment.service}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Neues Datum
                <input
                  value={editDate}
                  onChange={(event) => setEditDate(event.target.value)}
                  className="h-11 rounded border border-neutral-300 bg-pearl px-3"
                  type="date"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Neue Uhrzeit
                <select
                  value={editTime}
                  onChange={(event) => setEditTime(event.target.value)}
                  className="h-11 rounded border border-neutral-300 bg-pearl px-3"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option value={slot} key={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 rounded border border-ink px-5 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-pearl"
                onClick={() => setEditingAppointment(null)}
              >
                Abbrechen
              </button>
              <button
                className="h-11 rounded bg-gold px-5 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-gold-soft"
                onClick={updateAppointmentDateTime}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deletingAppointment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4">
          <div className="w-full max-w-md rounded border border-red-200 bg-white p-7 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-700">Termin löschen</p>
            <h2 className="mt-3 font-display text-3xl text-ink">{deletingAppointment.customerName}</h2>
            <p className="mt-3 leading-7 text-neutral-700">
              Möchten Sie diesen Termin wirklich löschen?
            </p>
            <div className="mt-4 rounded border border-neutral-200 bg-pearl p-4 text-sm leading-6 text-neutral-700">
              <p>{deletingAppointment.appointmentDate} · {deletingAppointment.startTime} Uhr</p>
              <p>{deletingAppointment.service}</p>
              <p>{deletingAppointment.phone}</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 rounded border border-ink px-5 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-pearl"
                onClick={() => setDeletingAppointment(null)}
              >
                Abbrechen
              </button>
              <button
                className="h-11 rounded bg-red-700 px-5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-red-800"
                onClick={deleteAppointment}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
