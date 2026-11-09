# Backend request: "Sell My Car" flow

CONTEXT
-------
New page at `/sell-my-car` where a customer sells us their car in four steps:

1. Enter registration + mileage → "Value your car"
2. We show the car's details (body type, fuel, gearbox, mileage) and they fill in
   name, email, phone (UK only), address, optional message and optional photos
3. They pick a 30-minute inspection slot in the next 7 days (10:00–18:00)
4. Confirmation screen showing an **estimated value** and a summary of what they sent

The frontend is built (`src/views/SellMyCar/`, client in `src/lib/sellMyCar.js`).
None of these endpoints exist yet. No auth: guests can submit, same as part-exchange.

ENDPOINTS NEEDED
----------------

1. GET /api/sell-my-car/lookup/?reg=<REG>&mileage=<int>
   - No auth. `reg` arrives uppercased with spaces stripped ("AB12CDE").
   - Look the vehicle up (DVLA VES and/or a vehicle-data provider) and, if
     possible, return an instant valuation for that mileage.
   - 200:
     {
       "make": "Ford",
       "model": "Fiesta",
       "year": 2018,
       "body_type": "Hatchback",
       "fuel_type": "Petrol",
       "transmission": "Manual",
       "colour": "Blue",
       "estimated_value": 3457        // integer GBP, or null if no valuation available
     }
     Any field may be null/missing; the frontend only shows what it gets.
     Uppercase values ("PETROL") are fine, the frontend title-cases them.
   - 404 when the reg doesn't exist. **Must be JSON with an `error` key**, because
     the frontend treats a bare/HTML 404 as "lookup unavailable":
     { "error": "We couldn't find a vehicle with that registration." }
   - 400 for a malformed reg/mileage: { "error": "..." } or DRF { "errors": {...} }
   - If the lookup provider is down, return 5xx. The frontend lets the customer
     carry on without the vehicle details, and the team values the car manually.

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
       appointment_time  "12:00"           (30-min slot start, 10:00–17:30)
       images            0–10 files, repeated key, PNG/JPG/GIF/WEBP, ≤10MB each
   - Please re-validate server-side: UK phone, slot inside opening hours, slot not
     in the past, date within the next 7 days.
   - Re-run the lookup/valuation server-side; don't trust anything from the client.
   - 201: { "success": true, "id": 12, "estimated_value": 3457, "message": "..." }
     `estimated_value` here overrides the one from the lookup on the success screen.
   - 400: { "success": false, "errors": { "phone": ["..."], "images": ["..."] } }
     The frontend sends the customer back to the step that owns the rejected field
     (reg/mileage → step 1, name/email/phone/address/message/images → step 2,
     anything else is shown on the appointment step).
   - 409 if the slot was taken between loading and submitting:
     { "error": "This time slot has just been booked. Please pick another." }
     Use a unique constraint on (appointment_date, appointment_time), as appointments does.
   - Email the admin (like part-exchange) and send the customer a confirmation.

NOTES
-----
- snake_case fields, matching the rest of the API.
- Until these exist, the frontend can be clicked through locally with
  `NEXT_PUBLIC_SELL_MY_CAR_DEMO=true` in `.env.local`. It returns fake data and
  sends nothing, and it can't activate in a production build.
