import { Appointment, AppointmentInput, AppointmentStatus, getEndTime } from "@/lib/booking";

const globalStore = globalThis as typeof globalThis & {
  legendHairAppointments?: Appointment[];
};

function getStore() {
  if (!globalStore.legendHairAppointments) {
    globalStore.legendHairAppointments = [];
  }

  return globalStore.legendHairAppointments;
}

export function listDemoAppointments() {
  return getStore().sort((a, b) => `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`));
}

export function createDemoAppointment(input: AppointmentInput) {
  const store = getStore();
  const duplicate = store.find(
    (appointment) =>
      appointment.appointmentDate === input.appointmentDate &&
      appointment.startTime === input.startTime &&
      appointment.status !== "cancelled"
  );

  if (duplicate) {
    return null;
  }

  const appointment: Appointment = {
    ...input,
    id: crypto.randomUUID(),
    endTime: getEndTime(input.startTime),
    status: "pending",
    createdAt: new Date().toISOString()
  };

  store.push(appointment);
  return appointment;
}

export function updateDemoAppointmentStatus(id: string, status: AppointmentStatus) {
  const appointment = getStore().find((item) => item.id === id);

  if (!appointment) {
    return null;
  }

  appointment.status = status;
  return appointment;
}

export function updateDemoAppointmentDateTime(id: string, appointmentDate: string, startTime: string) {
  const store = getStore();
  const appointment = store.find((item) => item.id === id);

  if (!appointment) {
    return { appointment: null, conflict: false };
  }

  const duplicate = store.find(
    (item) =>
      item.id !== id &&
      item.appointmentDate === appointmentDate &&
      item.startTime === startTime &&
      item.status !== "cancelled"
  );

  if (duplicate) {
    return { appointment: null, conflict: true };
  }

  appointment.appointmentDate = appointmentDate;
  appointment.startTime = startTime;
  appointment.endTime = getEndTime(startTime);
  return { appointment, conflict: false };
}

export function deleteDemoAppointment(id: string) {
  const store = getStore();
  const index = store.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  store.splice(index, 1);
  return true;
}
