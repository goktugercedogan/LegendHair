export const SERVICES = [
  "Damenhaarschnitt",
  "Waschen/Schneiden/Föhnen",
  "Föhnen/Styling",
  "Ansatzfarbe",
  "Komplettfarbe",
  "Tönung",
  "Strähnen",
  "Balayage",
  "Glossing",
  "Haarpflege/Kur",
  "Keratinbehandlung",
  "Hochsteckfrisur",
  "Brautfrisur Beratung",
  "Augenbrauen zupfen/färben",
  "Wimpern färben"
] as const;

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
] as const;

export const CLOSED_WEEKDAYS = [0, 1];

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type AppointmentInput = {
  customerName: string;
  phone: string;
  email?: string;
  service: string;
  appointmentDate: string;
  startTime: string;
  note?: string;
};

export type Appointment = AppointmentInput & {
  id: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
};

export function getEndTime(startTime: string) {
  const hour = Number(startTime.slice(0, 2)) + 1;
  return `${String(hour).padStart(2, "0")}:00`;
}

export function isClosedDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return CLOSED_WEEKDAYS.includes(parsed.getDay());
}

export function isPastDate(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsed = new Date(`${date}T00:00:00`);
  return parsed < today;
}

export function validateAppointmentInput(input: AppointmentInput) {
  if (!input.customerName.trim() || !input.phone.trim() || !input.service || !input.appointmentDate || !input.startTime) {
    return "Bitte füllen Sie alle Pflichtfelder aus.";
  }

  if (!SERVICES.includes(input.service as (typeof SERVICES)[number])) {
    return "Bitte wählen Sie eine gültige Dienstleistung.";
  }

  if (isPastDate(input.appointmentDate)) {
    return "Bitte wählen Sie ein zukünftiges Datum.";
  }

  if (isClosedDate(input.appointmentDate)) {
    return "Sonntag und Montag sind keine buchbaren Tage.";
  }

  if (!TIME_SLOTS.includes(input.startTime as (typeof TIME_SLOTS)[number])) {
    return "Bitte wählen Sie eine Uhrzeit zwischen 09:00 und 17:00.";
  }

  return null;
}

export function normalizeAppointment(input: AppointmentInput): AppointmentInput {
  return {
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || "",
    service: input.service,
    appointmentDate: input.appointmentDate,
    startTime: input.startTime,
    note: input.note?.trim() || ""
  };
}
