# Build the Sell My Car backend

You are working in the Noorrix Django backend (`noorrix_backend`). Build the API behind the `/sell-my-car` page.

The frontend is finished and already calls the endpoints below (`src/lib/sellMyCar.js` in the frontend repo). Match this contract exactly and do not change the frontend. If something here can't be done as written, stop and say so.

## What the customer does

1. Enters registration and mileage. We look the car up with the DVSA MOT History API.
2. Confirms the car, for example "Citroen C3 · 2009 · Silver · Diesel". This step is skipped if the lookup can't identify the car.
3. Fills in name, email, UK phone, address, an optional message and optional photos.
4. Picks a 30-minute inspection slot between 09:00 and 18:00 UK time, today or in the next 6 days.
5. Sees a confirmation screen.

There is no instant valuation. The owner reviews the details and photos, then replies by email with an offer.

## Follow the existing code

- Create a new app, `apps/sell_my_car`, registered as `apps.sell_my_car.apps.SellMyCarConfig` and included under `path('api/', ...)` in `config/urls.py`.
- Copy the patterns in `apps/part_exchange` (guest form, `{success, errors}` responses, Resend email in a background thread with `reply_to`, branded HTML template) and `apps/appointments` (availability endpoint, unique slot constraint, `IntegrityError` turned into a 409).
- Trust `config/settings.py` over this repo's `CLAUDE.md`, which is out of date. The real stack is Postgres, Resend and Railway, with uploads on a volume or Cloudflare R2.
- The default DRF permission is `IsAuthenticated`, so every view here needs `permission_classes = [AllowAny]`.
- `TIME_ZONE` is already `Europe/London`, so `timezone.localdate()` and `timezone.localtime()` give UK time.
- `requests` and `Pillow` are already installed. Add no new dependencies.

## Endpoints

### 1. `GET /api/sell-my-car/lookup/?reg=AB12CDE&mileage=10220`

`reg` arrives uppercased with spaces removed and must match `^[A-Z0-9]{2,7}$`. `mileage` must be a whole number from 1 to 9,999,999. It is validated but not used for the lookup.

Success response. Any field may be null or missing:

```json
{ "make": "CITROEN", "model": "C3", "year": 2009, "colour": "SILVER", "fuel_type": "DIESEL" }
```

| Response | What the frontend does |
|---|---|
| 200 with make or model | Shows the confirm screen |
| 200 with `{}` | Skips the confirm screen, customer carries on |
| 404 with JSON `{ "error": "..." }` | Stops on step 1 and shows that message |
| 400 with `{ "error": "..." }` | Stops on step 1 and shows that message |
| Anything else (5xx, 429) | Customer carries on without car details |

The 404 must be JSON with an `error` key. A bare 404 is treated as "service unavailable".

Rate-limit this endpoint per IP, for example 30 per hour.

### 2. `GET /api/sell-my-car/availability/?date=2026-11-03`

Same as `/api/appointments/availability/`. Return the booked slots for that date in `HH:MM`, leaving out cancelled enquiries:

```json
{ "date": "2026-11-03", "booked_times": ["10:00", "14:30"] }
```

Missing or malformed `date` returns 400 with `{ "error": "..." }`.

### 3. `POST /api/sell-my-car/` (multipart/form-data)

| Field | Example | Rules |
|---|---|---|
| `reg` | `AB12CDE` | Same as the lookup |
| `mileage` | `10220` | Same as the lookup |
| `name` | `Alex Smith` | Trimmed, 2 to 150 characters |
| `email` | `alex@example.com` | Valid email |
| `phone` | `+447701910159` | See the phone rule below |
| `address` | `1 High Street, Bedford MK40 1AA` | Trimmed, 5 to 300 characters |
| `message` | | Optional, up to 2000 characters |
| `appointment_date` | `2026-11-03` | From today to today + 6 days, UK time |
| `appointment_time` | `12:00` | 30-minute slot start from `09:00` to `17:30`, and not already started if the date is today |
| `images` | files, repeated key | Optional, up to 10, each up to 10MB |

**Phone rule:** the value must match `^\+44(?:7[1-57-9]\d{8}|7624\d{6}|1\d{8,9}|2[03489]\d{8})$`. On failure the message must be exactly `Please enter a valid UK phone number.` Numbers starting 03 or 08 are rejected on purpose, because Pakistani mobiles (0332…) have the same shape as UK 03 numbers.

**Images:** check the real format with Pillow and allow only PNG, JPEG, GIF and WEBP. Don't trust the browser's content type or file name.

**Order of work in the view:**

1. Validate the request.
2. Run the DVSA lookup for the make, model, year, colour and fuel. The frontend doesn't send these. If the lookup fails, save the enquiry with those fields blank, because a customer must never be blocked by DVSA.
3. In `transaction.atomic()`, create the enquiry first and the images after it, so a slot clash writes no files.
4. Send the emails in a background thread.

| Status | Body |
|---|---|
| 201 | `{ "success": true, "id": 12, "message": "..." }` |
| 400 | `{ "success": false, "errors": { "phone": ["..."] } }` |
| 409 | `{ "error": "This time slot has just been booked. Please pick another." }` |
| 429 | `{ "error": "Too many requests. Please try again later." }` |

Rate-limit this endpoint per IP, for example 10 per hour. Override DRF's default 429 body, because the frontend reads `error` and would otherwise show "Please fix the errors below".

The frontend uses the error keys to send the customer back to the right step. `reg` and `mileage` go to step 1, and `name`, `email`, `phone`, `address`, `message` and `images` go to the form. Anything else shows on the appointment step, so use these exact field names.

Every value in `errors` must be a flat list of strings. A DRF `ListField` returns nested errors such as `{ "images": { "0": ["..."] } }` for a bad file, which the frontend can't display, so return `{ "images": ["..."] }`.

## DVSA MOT History API

Taken from the official docs and OpenAPI spec at https://documentation.history.mot.api.gov.uk/. Put the client in `apps/sell_my_car/dvsa.py`.

**Settings.** Read these with `config(..., default='')` and add placeholders to `.env.example`. Never expose them to the frontend.

| Variable | Value |
|---|---|
| `DVSA_TOKEN_URL` | Full token URL from DVSA's email, includes the tenant ID |
| `DVSA_CLIENT_ID` | From DVSA's email |
| `DVSA_CLIENT_SECRET` | From DVSA's email |
| `DVSA_SCOPE` | Default `https://tapi.dvsa.gov.uk/.default` |
| `DVSA_API_KEY` | From DVSA's email |

The credentials may not have arrived when this is built. With any of them missing, the lookup must return 503 without calling DVSA. The rest of the flow must work normally.

**Token.** POST form-encoded `grant_type=client_credentials`, `client_id`, `client_secret` and `scope` to `DVSA_TOKEN_URL`. Cache the `access_token` until one minute before `expires_in` runs out. Read `expires_in` from the response, because the DVSA docs give conflicting lifetimes.

**Lookup.** `GET https://history.mot.api.gov.uk/v1/trade/vehicles/registration/{reg}` with the headers `Authorization: Bearer <token>` and `X-API-Key: <key>`. Use a timeout of about 8 seconds. Cache successful results per registration for 24 hours and don't cache failures.

**Field mapping.** DVSA returns one of two shapes, for a car with MOT tests or a newly registered car. Handle both.

| Our field | DVSA field |
|---|---|
| `make` | `make` |
| `model` | `model` |
| `year` (integer) | `manufactureYear`, otherwise the year from `manufactureDate`, then `registrationDate`, then `firstUsedDate` |
| `colour` | `primaryColour` |
| `fuel_type` | `fuelType` |

Return only these five fields, not the MOT history.

**Errors.** The body is `{ "errorCode": "...", "errorMessage": "...", "requestId": "..." }`. Decide using `errorCode`, because the docs don't give an HTTP status for every code.

| DVSA result | Our lookup response |
|---|---|
| 200 | 200 with the mapped fields |
| `MOTH-NF-01` (vehicle not found) | 200 with `{}` |
| `MOTH-IV-03` (invalid registration) | 404 with `{ "error": "We couldn't find a vehicle with that registration." }` |
| `MOTH-FB-02` (token expired) | Get a new token and retry once |
| Anything else, a timeout or a connection error | 503 with `{ "error": "..." }` |

Log `errorCode` and `requestId` on failure, and never log credentials or tokens.

## Data model

**`SellMyCarEnquiry`**

- `reg`, `mileage` (positive integer)
- `make`, `model`, `colour`, `fuel_type` (blank allowed), `year` (null allowed)
- `name`, `email`, `phone`, `address`, `message` (blank allowed)
- `appointment_date`, `appointment_time`
- `status`: new, in progress, completed, cancelled. Default new.
- `created_at`, ordered newest first

Add a `UniqueConstraint` on (`appointment_date`, `appointment_time`) with the condition that status is not cancelled, so cancelling frees the slot.

**`SellMyCarImage`**

- `enquiry` (foreign key, `related_name="images"`)
- `image` (`ImageField`), saved under `sell_my_car/` with a random UUID file name, because media URLs are public

Deleting an enquiry must also delete its photo files. Django doesn't do this by itself, and these are customer photos under UK GDPR.

## Emails

Use `resend.Emails.send` in a daemon thread, as `part_exchange` does. A failed email is logged and must not fail the request. Skip the owner email with a warning if `ADMIN_EMAIL` is empty.

Escape every customer value with `html.escape` before putting it in the HTML. The existing templates don't do this, so don't copy that part.

- **Owner, to `ADMIN_EMAIL`, with `reply_to` set to the customer:** all the car and contact details, the inspection slot, and photo thumbnails linking to the full images. Ten photos can reach 100MB, so link to them instead of attaching them. Build the links with `request.build_absolute_uri(image.url)` before starting the thread, which works for both local and R2 storage.
- **Customer:** an "Enquiry received" email with the registration, make and model if known, mileage and chosen inspection time in UK time. Say the team will review it and email an offer. Don't mention a price.

## Admin

Register the enquiry with list columns for reg, car, name, phone, inspection slot, status and created date. Add filters for status and date, search on reg, name, email and phone, and make status editable from the list. Customer fields are read-only. Show the photos as thumbnails on the detail page through an inline.

## Tests

Add `tests/sell_my_car/` using pytest. Mock DVSA and Resend so no test calls a real service. Cover:

- Lookup: both DVSA response shapes, each row of the DVSA error table, missing credentials, token caching and malformed input.
- Availability: booked times are returned and cancelled enquiries are left out.
- Submit: success with and without images, DVSA down still saves, a UK and a non-UK phone, 03 and 08 numbers rejected, each slot rule, a slot taken giving 409, a cancelled slot being bookable again, and flat `images` errors for a bad file and for 11 files.
- Rate limiting on both endpoints, including the `error` body on POST.

## Before going live

1. Set `NUM_PROXIES` in `REST_FRAMEWORK` to match Railway's proxy chain. Without it DRF uses the whole `X-Forwarded-For` header as the client ID, so a caller can dodge the rate limits by changing that header.
2. Check the gunicorn timeout on Railway, because a large photo upload on a slow connection can run past the 30-second default.
3. Test the lookup with a real registration once the DVSA credentials arrive.
4. Owner to confirm that DVSA allows this data to be shown to website visitors. The API docs don't say.
5. Owner to decide whether inspections and showroom appointments share a calendar. They are separate here, but `Appointment` notes that one staff member handles bookings, so both could land at the same time.
6. Note for the owner: the DVSA client secret expires every 2 years, and an API key unused for 90 days is revoked.
