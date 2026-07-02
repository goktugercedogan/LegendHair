import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/admin-auth";
import { AppointmentStatus } from "@/lib/booking";
import { updateDemoAppointmentStatus } from "@/lib/demo-store";
import { createServerSupabaseClient } from "@/lib/supabase";

const STATUSES: AppointmentStatus[] = ["pending", "confirmed", "cancelled", "completed"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const isAdmin = await authorizeAdmin(request);

  if (!isAdmin) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { status } = (await request.json()) as { status: AppointmentStatus };

  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Ungültiger Status." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    const appointment = updateDemoAppointmentStatus(params.id, status);

    if (!appointment) {
      return NextResponse.json({ error: "Termin wurde nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ appointment, demo: true });
  }

  const { error } = await supabase.from("appointments").update({ status }).eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Status konnte nicht aktualisiert werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
