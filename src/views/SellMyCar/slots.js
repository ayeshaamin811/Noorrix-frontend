// Inspection slot + date helpers for the Sell My Car flow.
// Dates are "YYYY-MM-DD" strings and times "HH:MM" (24h), always in UK time,
// matching the shape lib/appointments.js already sends to the backend.

export const SLOT_MINUTES = 30;
export const DAYS_AHEAD = 7;

const pad = (n) => String(n).padStart(2, "0");
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const fromMinutes = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

function slotsBetween(from, to) {
  const out = [];
  for (let t = toMinutes(from); t < toMinutes(to); t += SLOT_MINUTES) out.push(fromMinutes(t));
  return out;
}

// Opening hours for inspections, grouped the way they're shown to the customer.
export const SLOT_GROUPS = [
  { key: "morning", label: "Morning", times: slotsBetween("09:00", "12:00") },
  { key: "lunch", label: "Lunch time", times: slotsBetween("12:00", "14:00") },
  { key: "afternoon", label: "Afternoon", times: slotsBetween("14:00", "17:00") },
  { key: "evening", label: "Evening", times: slotsBetween("17:00", "18:00") },
];
export const ALL_SLOTS = SLOT_GROUPS.flatMap((g) => g.times);

/** "14:00" -> "02:00 PM" */
export function to12h(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}

/** "12:00" -> "12:00 PM - 12:30 PM" */
export const slotLabel = (start) =>
  `${to12h(start)} - ${to12h(fromMinutes(toMinutes(start) + SLOT_MINUTES))}`;

/**
 * The current time in the UK, whatever timezone the visitor is in. The returned Date's
 * local fields (getHours, getDate…) read as London time, GMT or BST as appropriate.
 */
export function ukNow(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return new Date(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
}

/** Local-time ISO date (toISOString() would shift to UTC and can land on the wrong day). */
export const localISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parseISO = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-11-03" -> "Tuesday, 03 November 2026" */
export function longDate(iso) {
  const d = parseISO(iso);
  return `${WEEKDAYS[d.getDay()]}, ${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2026-11-03" -> { day: "Tue", date: "03/11" } */
export function dayCard(iso) {
  const d = parseISO(iso);
  return { day: WEEKDAYS[d.getDay()].slice(0, 3), date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}` };
}

/** Today plus the following days, as ISO dates. */
export function nextDays(count, from) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    return localISO(d);
  });
}

/** Slots that have already started today can't be booked. */
export const isPastSlot = (iso, hhmm, now) =>
  iso === localISO(now) && toMinutes(hhmm) <= now.getHours() * 60 + now.getMinutes();
