import { Appointment, AppointmentStatus, getEndTime } from "@/lib/booking";

const storageKey = "legend-hair-demo-appointments";

function sortAppointments(appointments: Appointment[]) {
  return [...appointments].sort((a, b) => `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`));
}

export function listBrowserDemoAppointments() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    const appointments = raw ? (JSON.parse(raw) as Appointment[]) : [];
    return sortAppointments(appointments);
  } catch {
    return [];
  }
}

function saveBrowserDemoAppointments(appointments: Appointment[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(sortAppointments(appointments)));
}

export function hasBrowserDemoAppointmentConflict(appointmentDate: string, startTime: string, currentId?: string) {
  return listBrowserDemoAppointments().some(
    (appointment) =>
      appointment.id !== currentId &&
      appointment.appointmentDate === appointmentDate &&
      appointment.startTime === startTime &&
      appointment.status !== "cancelled"
  );
}

export function upsertBrowserDemoAppointment(appointment: Appointment) {
  const appointments = listBrowserDemoAppointments();
  const index = appointments.findIndex((item) => item.id === appointment.id);

  if (index === -1) {
    appointments.push(appointment);
  } else {
    appointments[index] = appointment;
  }

  saveBrowserDemoAppointments(appointments);
}

export function updateBrowserDemoAppointmentStatus(id: string, status: AppointmentStatus) {
  const appointments = listBrowserDemoAppointments();
  const appointment = appointments.find((item) => item.id === id);

  if (!appointment) {
    return false;
  }

  appointment.status = status;
  saveBrowserDemoAppointments(appointments);
  return true;
}

export function updateBrowserDemoAppointmentDateTime(id: string, appointmentDate: string, startTime: string) {
  if (hasBrowserDemoAppointmentConflict(appointmentDate, startTime, id)) {
    return { updated: false, conflict: true };
  }

  const appointments = listBrowserDemoAppointments();
  const appointment = appointments.find((item) => item.id === id);

  if (!appointment) {
    return { updated: false, conflict: false };
  }

  appointment.appointmentDate = appointmentDate;
  appointment.startTime = startTime;
  appointment.endTime = getEndTime(startTime);
  saveBrowserDemoAppointments(appointments);
  return { updated: true, conflict: false };
}

export function deleteBrowserDemoAppointment(id: string) {
  const appointments = listBrowserDemoAppointments();
  const nextAppointments = appointments.filter((appointment) => appointment.id !== id);

  if (nextAppointments.length === appointments.length) {
    return false;
  }

  saveBrowserDemoAppointments(nextAppointments);
  return true;
}

export function mergeDemoAppointments(serverAppointments: Appointment[], browserAppointments: Appointment[]) {
  const appointments = new Map<string, Appointment>();

  [...serverAppointments, ...browserAppointments].forEach((appointment) => {
    appointments.set(appointment.id, appointment);
  });

  return sortAppointments([...appointments.values()]);
}
