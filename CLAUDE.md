@AGENTS.md

## Sell My Car (`/sell-my-car`)

The frontend is complete and the backend is not built. Don't start the backend until asked.

- **Flow:** reg + mileage → confirm car ("Not your car?", skipped when the lookup can't identify the car) → contact details + photos → inspection time slot → done.
- **Code:** `src/views/SellMyCar/`, `src/lib/sellMyCar.js`, `src/lib/ukPhone.js`. CSS classes use the `smc-` prefix.
- **Backend contract:** `docs/BACKEND_SELL_MY_CAR_REQUEST.md`.
- **Car data is free-only, by decision:** make, model, year, colour and fuel from the UK Government DVSA MOT History API. No paid provider, so no body type, gearbox or instant valuation. The owner reviews the photos and emails the offer. The UI shows those extra fields automatically if a source ever provides them.
- **API access:** the DVSA key has to be registered for; the DVLA Vehicle Enquiry API was closed to new registrations as of November 2026. Credentials belong on the backend, never in a `NEXT_PUBLIC_` variable.
- **Local demo:** `NEXT_PUBLIC_SELL_MY_CAR_DEMO=true` in `.env.local` runs the whole flow on fake data. It can't activate in a production build.
- **UK phone rule:** only 07 mobiles and 01/02 landlines pass. 03/08 are rejected on purpose, because Pakistani mobiles (0332…) have the same shape as UK 03 numbers.
- **Mobile:** keep `.smc-input` at 16px. Anything smaller makes iPhones zoom in on focus.
