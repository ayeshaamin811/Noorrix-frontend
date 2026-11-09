# Backend request: "Sell My Car" flow

CONTEXT
-------
New page at `/sell-my-car` where a customer offers us their car:

1. Enter registration + mileage → "Value your car"
2. Confirm the car: "Citroen C3 · 2009 · Silver · Diesel" with a "Not your car?" link.
   Skipped if the lookup can't identify the car.
3. Fill in name, email, phone (UK only), address, optional message and optional photos
4. Pick a 30-minute inspection slot in the next 7 days (09:00–18:00 UK time)
5. Confirmation screen with a summary of what they sent

There is no instant valuation. The owner reviews the details and photos, then
emails the customer an offer.

The frontend is built (`src/views/SellMyCar/`, client in `src/lib/sellMyCar.js`).
None of these endpoints exist yet. No auth: guests can submit, same as part-exchange.

ENDPOINTS NEEDED
----------------

1. GET /api/sell-my-car/lookup/?reg=<REG>&mileage=<int>
   - No auth. `reg` arrives uppercased with spaces stripped ("AB12CDE").
     `mileage` is sent as well but isn't needed for the lookup.
   - Look the vehicle up with the DVSA MOT History API. Register at
     https://documentation.history.mot.api.gov.uk/mot-history-api/register
     Keep the credentials on the server, never in a `NEXT_PUBLIC_` variable, and
     rate-limit this endpoint per IP.
   - The DVLA Vehicle Enquiry API was closed to new registrations when this was
     written (November 2026), so don't depend on it.
   - 200:
     {
       "make": "CITROEN",
       "model": "C3",
       "year": 2009,
       "colour": "Silver",
       "fuel_type": "Diesel"
     }
     Any field may be null/missing; the frontend only shows what it gets and
     formats capitals for display. Confirm the DVSA field names against a real
     response: the new API's docs don't list them. The older API used `make`,
     `model`, `manufactureDate`, `registrationDate`, `primaryColour`, `fuelType`.
   - No DVSA record: return 200 with `{}`. A car too new for its first MOT has no
     record, so a miss doesn't prove the registration is wrong, and the customer
     should be able to carry on to the form.
   - 404 only for a registration you know is invalid. **Must be JSON with an `error`
     key**; it stops the customer on step 1 and shows that message:
     { "error": "We couldn't find a vehicle with that registration." }
   - 400 for a malformed reg/mileage: { "error": "..." } or DRF { "errors": {...} }
   - If DVSA is down, return 5xx. The frontend lets the customer carry on without
     the vehicle details.
   - Optional, not used for now: `body_type`, `transmission` and `estimated_value`
     are displayed automatically if a paid data source is added later.

2. GET /api/sell-my-car/availability/?date=<YYYY-MM-DD>
   - No auth. Same shape as /api/appointments/availability/:
     { "date": "2026-11-03", "booked_times": ["10:00", "14:30"] }
   - Separate from showroom test-drive appointments (inspections are a different
     calendar). Tell us if they should share one calendar instead.

3. POST /api/sell-my-car/   (multipart/form-data)
   - No auth. Fields:
       reg               "AB12CDE"
       mileage           "10220"
       name              "Alex Smith"
       email             "alex@example.com"
       phone             "+447701910159"   (always E.164; frontend only accepts UK
                                            mobiles 07… and landlines 01…/02…, not 03/08)
       address           "1 High Street, Bedford MK40 1AA"
       message           optional
       appointment_date  "2026-11-03"
       appointment_time  "12:00"           (30-min slot start, 09:00–17:30, UK time)
       images            0–10 files, repeated key, PNG/JPG/GIF/WEBP, ≤10MB each
   - Please re-validate server-side: UK phone, slot inside opening hours, slot not
     in the past, date within the next 7 days. Dates and times are UK time, so use
     Europe/London for the "past" and "next 7 days" checks.
   - Re-run the lookup server-side; don't trust vehicle data from the client.
   - 201: { "success": true, "id": 12, "message": "..." }
   - 400: { "success": false, "errors": { "phone": ["..."], "images": ["..."] } }
     The frontend sends the customer back to the step that owns the rejected field
     (reg/mileage → step 1, name/email/phone/address/message/images → the form,
     anything else is shown on the appointment step).
   - 409 if the slot was taken between loading and submitting:
     { "error": "This time slot has just been booked. Please pick another." }
     Use a unique constraint on (appointment_date, appointment_time), as appointments does.

EMAILS AND ADMIN
----------------
- Owner: details and photos, with `reply_to` set to the customer's email so the
  owner can send the offer by pressing Reply (same pattern as part-exchange).
- Customer: automatic "Enquiry received" email with the registration, make, model
  and mileage, saying the team will review it and get back to them. No price.
- Django admin: list enquiries, with their photos visible on the detail page.

NOTES
-----
- snake_case fields, matching the rest of the API.
- Until these exist, the frontend can be clicked through locally with
  `NEXT_PUBLIC_SELL_MY_CAR_DEMO=true` in `.env.local`. It returns fake data and
  sends nothing, and it can't activate in a production build.
