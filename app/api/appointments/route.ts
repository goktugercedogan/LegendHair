import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/admin-auth";
import { createDemoAppointment, listDemoAppointments } from "@/lib/demo-store";
import { AppointmentInput, getEndTime, normalizeAppointment, validateAppointmentInput } from "@/lib/booking";
import { createServerSupabaseClient } from "@/lib/supabase";

const unavailableMessage = "Dieser Termin ist leider nicht verfügbar. Bitte wählen Sie eine andere Uhrzeit.";

export async function GET(request: Request) {
  const isAdmin = await authorizeAdmin(request);

  if (!isAdmin) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ appointments: listDemoAppointments(), demo: true });
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Termine konnten nicht geladen werden." }, { status: 500 });
  }

  return NextResponse.json({
    appointments: data.map((appointment) => ({
      id: appointment.id,
      customerName: appointment.customer_name,
      phone: appointment.phone,
      email: appointment.email ?? "",
      service: appointment.service,
      appointmentDate: appointment.appointment_date,
      startTime: appointment.start_time.slice(0, 5),
      endTime: appointment.end_time.slice(0, 5),
      note: appointment.note ?? "",
      status: appointment.status,
      createdAt: appointment.created_at
    }))
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as AppointmentInput;
  const input = normalizeAppointment(body);
  const validationError = validateAppointmentInput(input);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    const appointment = createDemoAppointment(input);

    if (!appointment) {
      return NextResponse.json({ error: unavailableMessage }, { status: 409 });
    }

    return NextResponse.json({ appointment, demo: true }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      customer_name: input.customerName,
      phone: input.phone,
      email: input.email || null,
      service: input.service,
      appointment_date: input.appointmentDate,
      start_time: input.startTime,
      end_time: getEndTime(input.startTime),
      note: input.note || null,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: unavailableMessage }, { status: 409 });
  }

  return NextResponse.json({ appointment: data }, { status: 201 });
}
