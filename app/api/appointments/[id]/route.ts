import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/admin-auth";
import { getEndTime, isClosedDate, isPastDate, TIME_SLOTS } from "@/lib/booking";
import { deleteDemoAppointment, updateDemoAppointmentDateTime } from "@/lib/demo-store";
import { createServerSupabaseClient } from "@/lib/supabase";

const unavailableMessage = "Dieser Termin ist leider nicht verfügbar. Bitte wählen Sie eine andere Uhrzeit.";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const isAdmin = await authorizeAdmin(request);

  if (!isAdmin) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { appointmentDate, startTime } = (await request.json()) as {
    appointmentDate?: string;
    startTime?: string;
  };

  if (!appointmentDate || !startTime) {
    return NextResponse.json({ error: "Bitte Datum und Uhrzeit auswählen." }, { status: 400 });
  }

  if (isPastDate(appointmentDate)) {
    return NextResponse.json({ error: "Bitte wählen Sie ein zukünftiges Datum." }, { status: 400 });
  }

  if (isClosedDate(appointmentDate)) {
    return NextResponse.json({ error: "Sonntag und Montag sind keine buchbaren Tage." }, { status: 400 });
  }

  if (!TIME_SLOTS.includes(startTime as (typeof TIME_SLOTS)[number])) {
    return NextResponse.json({ error: "Bitte wählen Sie eine Uhrzeit zwischen 09:00 und 17:00." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    const result = updateDemoAppointmentDateTime(params.id, appointmentDate, startTime);

    if (result.conflict) {
      return NextResponse.json({ error: unavailableMessage }, { status: 409 });
    }

    if (!result.appointment) {
      return NextResponse.json({ error: "Termin wurde nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ appointment: result.appointment, demo: true });
  }

  const { error } = await supabase
    .from("appointments")
    .update({
      appointment_date: appointmentDate,
      start_time: startTime,
      end_time: getEndTime(startTime)
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: unavailableMessage }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const isAdmin = await authorizeAdmin(request);

  if (!isAdmin) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    const deleted = deleteDemoAppointment(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Termin wurde nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await supabase.from("appointments").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Termin konnte nicht gelöscht werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
