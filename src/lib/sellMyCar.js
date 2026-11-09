// "Sell my car" flow API client.
// See docs/BACKEND_SELL_MY_CAR_REQUEST.md for the contract these calls expect.
// Unauthenticated — same conventions as lib/appointments.js and lib/partExchange.js
// (direct fetch, DRF field-error shape on 400, 409 for a slot taken in a race).

const BASE = process.env.NEXT_PUBLIC_API_URL;

// Local-only demo mode so the full flow can be clicked through before the backend
// endpoints exist. Opt in with NEXT_PUBLIC_SELL_MY_CAR_DEMO=true in .env.local;
// it can never switch on in a production build.
const DEMO =
  process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SELL_MY_CAR_DEMO === "true";

/** "ab12 cde" -> "AB12CDE" */
export const normaliseReg = (reg) => String(reg ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");

/** UK registrations are 2–7 letters/digits once spaces are removed. */
export const isValidReg = (reg) => /^[A-Z0-9]{2,7}$/.test(normaliseReg(reg));

/** "AB12CDE" -> "AB12 CDE" (current-style plates); older formats are left as typed. */
export const displayReg = (reg) => {
  const r = normaliseReg(reg);
  return /^[A-Z]{2}\d{2}[A-Z]{3}$/.test(r) ? `${r.slice(0, 4)} ${r.slice(4)}` : r;
};

async function readJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Look up a vehicle by registration and get an instant estimate.
 *
 * Resolves to `{ make, model, year, colour, fuel_type }`, or `null` if the lookup
 * service is unavailable — the flow carries on without the details and the team
 * values the car manually. `body_type`, `transmission` and `estimated_value` are
 * shown automatically if a data source that provides them is ever added.
 * Throws an Error with code "REG_NOT_FOUND" when the registration doesn't exist,
 * or "INVALID" when the backend rejects the reg/mileage.
 */
export async function lookupVehicle({ reg, mileage }) {
  if (DEMO) return demoLookup();

  let res;
  try {
    const qs = new URLSearchParams({ reg: normaliseReg(reg), mileage: String(mileage) });
    res = await fetch(`${BASE}/api/sell-my-car/lookup/?${qs}`);
  } catch {
    return null;
  }

  const data = await readJson(res);

  // Only a JSON 404 with an `error` is "no such vehicle" — a bare 404 means the
  // endpoint itself isn't there, which we treat as "service unavailable".
  if (res.status === 404 && data?.error) {
    const err = new Error(data.error);
    err.code = "REG_NOT_FOUND";
    throw err;
  }
  if (res.status === 400 && data) {
    const err = new Error(
      data.error ||
        (data.errors && Object.values(data.errors).flat().join(" ")) ||
        "Please check your registration and mileage."
    );
    err.code = "INVALID";
    throw err;
  }
  if (!res.ok || !data) return null;
  return data;
}

/** Already-booked inspection slots for a date ("HH:MM" strings). Never throws. */
export async function getSellAvailability(date) {
  if (DEMO) return [];
  try {
    const res = await fetch(`${BASE}/api/sell-my-car/availability/?date=${date}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.booked_times) ? data.booked_times : [];
  } catch {
    return [];
  }
}

/**
 * Submit the customer's car, contact details, photos and chosen inspection slot.
 *
 * @param {object} args
 * @param {string} args.reg
 * @param {number} args.mileage
 * @param {string} args.name
 * @param {string} args.email
 * @param {string} args.phone      E.164, e.g. "+447700900123"
 * @param {string} args.address
 * @param {string} [args.message]
 * @param {string} args.date       "YYYY-MM-DD"
 * @param {string} args.time       "HH:MM"
 * @param {File[]} [args.images]
 * @returns {Promise<{ id?: number, estimated_value?: number|null, message?: string }>}
 */
export async function submitSellMyCar({
  reg, mileage, name, email, phone, address, message, date, time, images = [],
}) {
  if (DEMO) return demoSubmit();

  const fd = new FormData();
  fd.append("reg", normaliseReg(reg));
  fd.append("mileage", String(mileage));
  fd.append("name", name);
  fd.append("email", email);
  fd.append("phone", phone);
  fd.append("address", address);
  if (message) fd.append("message", message);
  fd.append("appointment_date", date);
  fd.append("appointment_time", time);
  images.forEach((file) => fd.append("images", file));

  let res;
  try {
    res = await fetch(`${BASE}/api/sell-my-car/`, { method: "POST", body: fd });
  } catch {
    throw new Error("We couldn't reach our server. Please check your connection and try again.");
  }

  const data = await readJson(res);
  if (!data) throw new Error("Something went wrong. Please try again.");

  // Someone else took this exact slot between the page loading and submitting.
  if (res.status === 409) {
    const err = new Error(data.error || "This time slot has just been booked. Please pick another.");
    err.code = "SLOT_TAKEN";
    throw err;
  }

  if (!res.ok || data.success === false) {
    const err = new Error(data.error || "Please fix the errors below and try again.");
    err.fieldErrors = data.errors || {};
    throw err;
  }

  return data;
}

// ── Demo-mode fakes (development only, see DEMO above) ───────────────────────
// Same fields the free DVSA lookup gives, so demo mode shows what customers will see.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function demoLookup() {
  await wait(700);
  return { make: "CITROEN", model: "C3", year: 2009, colour: "SILVER", fuel_type: "DIESEL" };
}

async function demoSubmit() {
  await wait(1200);
  return { id: 0, message: "Demo submission — nothing was sent." };
}
