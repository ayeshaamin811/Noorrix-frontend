# Noorrix Motors — Project Documentation

> **Noorrix Motors** is a UK-based used car dealership website built with Next.js 16 (App Router) and React 19, backed by a Django REST Framework (DRF) API. This document covers the architecture, routing, tech stack, data flow, and key patterns used throughout the project.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Routing System](#routing-system)
4. [Architecture Pattern](#architecture-pattern)
5. [Data Flow](#data-flow)
6. [Key Features](#key-features)
7. [State Management](#state-management)
8. [API Layer](#api-layer)
9. [Authentication](#authentication)
10. [Payments](#payments)
11. [Styling](#styling)
12. [Environment Variables](#environment-variables)
13. [Available Scripts](#available-scripts)
14. [Backend API Contracts](#backend-api-contracts)
15. [Dynamic Blogs](#dynamic-blogs)

---

## Tech Stack

| Layer     | Technology                                               |
|-----------|----------------------------------------------------------|
| Framework | **Next.js** `16.2.6` (App Router)                        |
| UI        | **React** `19.2.4`                                       |
| Styling   | **Tailwind CSS** `3.4.19` + custom CSS files             |
| Sliders   | **Swiper** `12.2.0`                                      |
| Icons     | **React Icons** `5.6.0`                                  |
| Linting   | **ESLint** `9` (flat config with `eslint-config-next`)   |
| Backend   | **Django REST Framework** (DRF)                          |
| Payments  | **Stripe** (hosted Checkout Sessions)                    |
| Build     | **Turbopack** (Next.js built-in bundler)                 |

**Key versions:** Next.js 16.2.6, React 19.2.4 (the project uses the latest major releases with some API differences from earlier versions).

---

## Project Structure

```
noorrix-motors/
│
├── public/                              # Static assets (served at /)
│   ├── autoTraderLogo.svg
│   ├── favicon.jpg
│   ├── file.svg / globe.svg / next.svg / vercel.svg / window.svg
│   └── assets/                          # Images, logos, banners
│
├── src/
│   ├── app/                             # ROUTING — App Router pages & layouts
│   │   ├── layout.js                    # Root layout (Navbar, Footer, Auth wrap)
│   │   ├── page.js                      # Homepage (server-fetched FAQs → Home view)
│   │   ├── globals.css                  # Global CSS (Tailwind directives + custom)
│   │   ├── not-found.js                 # 404 page
│   │   ├── robots.js                    # SEO /robots.txt
│   │   │
│   │   ├── about/page.js
│   │   ├── appointment/page.js
│   │   ├── blogs/page.js                # Blog listing (server-fetched from DRF)
│   │   ├── blogs/[slug]/page.js         # Single blog post
│   │   ├── blogs/category/page.js       # Blog category filter
│   │   ├── cars/[id]/page.js            # Car detail (dynamic route)
│   │   ├── used-cars/[brand]/page.js    # Used cars by brand (dynamic route)
│   │   ├── checkout/page.js
│   │   ├── contact/page.js
│   │   ├── cookie-policy/page.js
│   │   ├── delivery/page.js
│   │   ├── dents-paints/page.js
│   │   ├── favourites/page.js
│   │   ├── finance/page.js
│   │   ├── forgot-password/page.js
│   │   ├── forgot-password/otp/page.js
│   │   ├── forgot-password/new-password/page.js
│   │   ├── login/page.js
│   │   ├── part-exchange/page.js
│   │   ├── sell-my-car/page.js
│   │   ├── payment/cancel/page.js
│   │   ├── payment/complete/page.js
│   │   ├── privacy-policy/page.js
│   │   ├── reset-password/page.js
│   │   ├── servicing/page.js
│   │   ├── sitemap/page.js
│   │   ├── stock/page.js
│   │   ├── terms-of-use/page.js
│   │   ├── vehicle-sourcing/page.js
│   │   ├── warranty/page.js
│   │   │
│   │   └── api/                        # Next.js API routes (proxy layer)
│   │       └── contact/route.js
│   │
│   ├── components/                      # Reusable UI components
│   │   ├── AboutSection/
│   │   ├── AuthGuard/
│   │   ├── AutoTraderBadge/
│   │   ├── BeforeAfter/
│   │   ├── BookingModal/
│   │   ├── Browsebybudget/
│   │   ├── CTA/
│   │   ├── DealerContactCard/
│   │   ├── DentsPaintsServices/
│   │   ├── EstimateForm/
│   │   ├── Faqs/
│   │   ├── FeatureCards/
│   │   ├── FinalCTA/
│   │   ├── Footer/
│   │   ├── HeartButton/
│   │   ├── Hero/
│   │   ├── HeroFilter/
│   │   ├── LocationContact/
│   │   ├── Navbar/
│   │   ├── PoppularSearched/
│   │   ├── RepairProcess/
│   │   ├── ScrollToHash.jsx
│   │   ├── ServicesSlider/
│   │   ├── StatsCounter/
│   │   ├── StockSubscribe/
│   │   ├── Testimonials/
│   │   ├── TrustSection/
│   │   ├── TrustStrip/
│   │   ├── VehicleSidebar/
│   │   ├── WhatsApp/
│   │   ├── WhatWeDo/
│   │   └── WhyChooseUs/
│   │
│   ├── views/                           # Full page UI (one per route)
│   │   ├── Home.jsx
│   │   ├── About.jsx / About.css
│   │   ├── Appointment/                 # Folder with Appointment.jsx + Appointment.css
│   │   ├── BlogCategory.jsx
│   │   ├── BlogDetail.jsx / BlogDetail.css
│   │   ├── Blogs.jsx / Blogs.css
│   │   ├── CarDetails/                  # Folder
│   │   ├── Checkout/                    # Folder
│   │   ├── Contact.jsx / Contact.css
│   │   ├── CookiePolicy.jsx / CookiePolicy.css
│   │   ├── Delivery.jsx / Delivery.css
│   │   ├── DentsPaintsPage.jsx / DentsPaintsPage.css
│   │   ├── Favourites/                  # Folder
│   │   ├── Finance.jsx
│   │   ├── ForgotPassword/              # Folder
│   │   ├── LoginSignup/                 # Folder
│   │   ├── OurStock.jsx / OurStock.css
│   │   ├── PartExchange.jsx / PartExchange.css
│   │   ├── PaymentCancel/               # Folder
│   │   ├── PaymentComplete/             # Folder
│   │   ├── PrivacyPolicy.jsx / PrivacyPolicy.css
│   │   ├── SellMyCar/                   # Folder — sell flow (reg → confirm car → details → inspection → done)
│   │   ├── ResetPassword/               # Folder
│   │   ├── Servicing.jsx / Servicing.css
│   │   ├── Sitemap.jsx / Sitemap.css
│   │   ├── TermsOfUse.jsx / TermsOfUse.css
│   │   ├── UsedCarsByBrand/             # Folder
│   │   ├── UsedVans.jsx
│   │   ├── VehicleSourcing.jsx / VehicleSourcing.css
│   │   └── Warranty.jsx / Warranty.css
│   │
│   ├── context/                         # React Context providers
│   │   ├── AuthContext.jsx              # JWT auth (login, logout, token refresh)
│   │   └── FavouritesContext.jsx        # Favourites with guest→auth migration
│   │
│   ├── lib/                             # API clients & utilities
│   │   ├── api.js                       # Authenticated fetch wrapper (apiFetch)
│   │   ├── appointments.js
│   │   ├── cars.js                      # Cars API client (public endpoints)
│   │   ├── delivery.js
│   │   ├── favourites.js
│   │   ├── format.js                    # Formatting helpers (brandSlug, etc.)
│   │   ├── newsletter.js
│   │   ├── partExchange.js
│   │   ├── sellMyCar.js                 # Reg lookup, inspection availability, submit
│   │   ├── ukPhone.js                   # UK phone validation + formatting
│   │   ├── testimonials.js
│   │   └── vehicleSourcing.js
│   │
│   ├── services/                        # Service layer
│   │   └── paymentsService.js           # Stripe Checkout Session API
│   │
│   └── styles/
│       └── global.css                   # Extra global styles
│
├── docs/                                # Technical documentation
│   ├── BACKEND_APPOINTMENTS_REQUEST.md
│   ├── BACKEND_FAVOURITES_REQUEST.md
│   ├── backend-stripe-hosted-checkout.md
│   ├── FILTER_BACKEND_SCENARIO.md
│   ├── FOLDER_STRUCTURE_GUIDE.md        # Folder structure guide (Urdu/English)
│   └── BLOGS_DYNAMIC_SPEC.md            # Dynamic blogs specification
│
├── AGENTS.md                            # AI agent instructions
├── CLAUDE.md                            # Claude-specific instructions
├── PROJECT.md                           # ← This file
├── README.md
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── jsconfig.json                        # Path alias: @/ → src/
├── postcss.config.js
├── eslint.config.mjs                    # Flat ESLint config
└── .gitignore
```

---

## Routing System

The project uses **Next.js App Router** (file-system based routing). Every folder inside `src/app/` maps to a URL path.

### Static Routes

| URL                              | Source File                                    |
|----------------------------------|-----------------------------------------------|
| `/`                              | `src/app/page.js`                             |
| `/about`                         | `src/app/about/page.js`                       |
| `/stock`                         | `src/app/stock/page.js`                       |
| `/contact`                       | `src/app/contact/page.js`                     |
| `/finance`                       | `src/app/finance/page.js`                     |
| `/servicing`                     | `src/app/servicing/page.js`                   |
| `/warranty`                      | `src/app/warranty/page.js`                    |
| `/delivery`                      | `src/app/delivery/page.js`                    |
| `/dents-paints`                  | `src/app/dents-paints/page.js`                |
| `/part-exchange`                 | `src/app/part-exchange/page.js`               |
| `/sell-my-car`                   | `src/app/sell-my-car/page.js`                 |
| `/vehicle-sourcing`              | `src/app/vehicle-sourcing/page.js`            |
| `/login`                         | `src/app/login/page.js`                       |
| `/reset-password`                | `src/app/reset-password/page.js`              |
| `/appointment`                   | `src/app/appointment/page.js`                 |
| `/checkout`                      | `src/app/checkout/page.js`                    |
| `/favourites`                    | `src/app/favourites/page.js`                  |
| `/blogs`                         | `src/app/blogs/page.js`                       |
| `/privacy-policy`                | `src/app/privacy-policy/page.js`              |
| `/cookie-policy`                 | `src/app/cookie-policy/page.js`               |
| `/terms-of-use`                  | `src/app/terms-of-use/page.js`                |
| `/sitemap`                       | `src/app/sitemap/page.js`                     |

### Dynamic Routes

| URL Pattern                      | Source File                                       | Params             |
|----------------------------------|---------------------------------------------------|--------------------|
| `/cars/[id]`                     | `src/app/cars/[id]/page.js`                       | `params.id`        |
| `/used-cars/[brand]`             | `src/app/used-cars/[brand]/page.js`               | `params.brand`     |
| `/blogs/[slug]`                  | `src/app/blogs/[slug]/page.js`                    | `params.slug`      |

### Nested / Multi-step Routes

| URL Pattern                      | Source File                                       |
|----------------------------------|---------------------------------------------------|
| `/forgot-password`               | `src/app/forgot-password/page.js`                 |
| `/forgot-password/otp`           | `src/app/forgot-password/otp/page.js`             |
| `/forgot-password/new-password`  | `src/app/forgot-password/new-password/page.js`    |
| `/payment/cancel`                | `src/app/payment/cancel/page.js`                  |
| `/payment/complete`              | `src/app/payment/complete/page.js`                |

### Special Files

| File                             | Purpose                                           |
|----------------------------------|---------------------------------------------------|
| `layout.js`                      | Root layout wrapping all pages (Auth, Favourites, WhatsApp button, fonts) |
| `not-found.js`                   | 404 page shown for invalid URLs                   |
| `robots.js`                      | SEO robots.txt configuration                      |
| `globals.css`                    | Global styles (Tailwind + custom)                 |

---

## Architecture Pattern

The project follows a **separation of concerns** pattern:

```
src/app/[route]/page.js        ← Thin wrapper: metadata + import view
       ↓
src/views/[PageName].jsx       ← Full page UI (state, effects, layout)
       ↓
src/components/                ← Reusable UI pieces imported by views
```

**Rules:**
- `src/app/` → routing only (metadata exports + minimum logic)
- `src/views/` → full page UI for each route
- `src/components/` → reusable pieces used across multiple views/pages
- `src/lib/` → API client functions and utility helpers
- `src/services/` → service-level abstractions (e.g. Stripe payments)
- `src/context/` → global state providers

---

## Data Flow

```
USER BROWSER
    │
    ├── Static pages (about, contact, etc.): Server-rendered instantly
    │
    ├── Stock / Car detail pages:
    │     src/lib/cars.js  →  DRF API (/api/cars/, /api/cars/{id}/)
    │     Data fetched on the server with `next: { revalidate: 60 }`
    │
    ├── Homepage:
    │     src/app/page.js  →  fetches FAQs from DRF at build/runtime
    │     Passes `faqs` prop to Home view
    │
    ├── Blogs:
    │     src/app/blogs/page.js  →  fetches posts from DRF (/api/blogs/)
    │     Server Component with ISR (revalidate: 60)
    │
    ├── Favourites:
    │     Guests: localStorage
    │     Users:  DRF API via src/lib/favourites.js
    │     Migration: guest favs → account on login (FavouritesContext)
    │
    ├── Payments:
    │     src/services/paymentsService.js  →  DRF → Stripe Checkout Session
    │     Redirects user to Stripe hosted page, then back to /payment/complete
    │
    └── Auth (login/register):
          src/context/AuthContext.jsx  →  DRF JWT endpoints
          Access token in memory, refresh token in localStorage
```

---

## Key Features

### 1. Car Inventory & Filtering
- Browse all cars at `/stock`
- View car details at `/cars/[id]` (with similar cars slider)
- Filter by brand at `/used-cars/[brand]`
- Dynamic filter options (makes, models, price ranges) from `/api/filters/`
- Brand slug matching via prefix (handles "Mercedes-Benz C Class" → "mercedes-benz")

### 2. Favourites ("Saved Cars")
- **Guest mode:** Favourite IDs stored in `localStorage`
- **Logged-in mode:** Favourites persisted via DRF API
- **Migration:** When a guest logs in, their local favourites are synced to their account
- Optimistic UI updates with rollback on failure

### 3. Booking Appointments
- Book test drives or visits at `/appointment`
- Modal-based booking form (BookingModal component)
- Backend contract documented in `docs/BACKEND_APPOINTMENTS_REQUEST.md`

### 4. Stripe Payments (Deposits)
- Hosted Stripe Checkout for car deposits
- Flow: Checkout page → createCheckoutSession() → redirect to Stripe → return to `/payment/complete`
- Race condition handling: 409 "CAR_UNAVAILABLE" if car was just reserved by someone else
- Backend contract documented in `docs/backend-stripe-hosted-checkout.md`

### 5. Dynamic Blogs
- Blog posts managed through Django Admin
- DRF API endpoints at `/api/blogs/` and `/api/blogs/{slug}/`
- Featured post support via `?featured=true` query param
- Category filtering via `?category=Car Tips`
- ISR (Incremental Static Regeneration) with 60s revalidation
- Full specification in `docs/BLOGS_DYNAMIC_SPEC.md`

### 6. Services Pages
- Finance, Servicing, Warranty, Delivery, Dents & Paints, Part Exchange, Vehicle Sourcing
- Each has its own route and view with tailored content

### 7. Auth System
- JWT-based authentication (access + refresh tokens)
- Access token stored in memory (lost on page reload)
- Refresh token stored in `localStorage` (persists across sessions)
- Auto-refresh on 401 responses via `apiFetch` wrapper
- Cross-tab synchronisation via `storage` event listener
- Login gate helper: `loginGate(user, destination)` redirects to `/login?returnTo=...`

### 8. Part Exchange & Vehicle Sourcing
- Forms that submit data to DRF endpoints
- Client functions in `src/lib/partExchange.js` and `src/lib/vehicleSourcing.js`

### 9. Newsletter Signup
- Subscribe form → DRF newsletter endpoint
- Client function in `src/lib/newsletter.js`

### 10. Contact Form
- Submits via Next.js API proxy route (`src/app/api/contact/route.js`) → DRF

---

## State Management

The project uses **React Context** for global state (no external state library).

### AuthContext (`src/context/AuthContext.jsx`)
- **Provides:** `user`, `hydrated`, `login()`, `logout()`
- **Module-level exports:** `getAccessToken()`, `attemptRefresh()`
- **Hydration:** On mount, tries to exchange stored refresh token for a new access token
- **Token flow:**
  1. Login → stores access (memory) + refresh (localStorage)
  2. On 401 → `attemptRefresh()` exchanges refresh for new access
  3. On refresh failure → clears state, logs out

### FavouritesContext (`src/context/FavouritesContext.jsx`)
- **Provides:** `isFavourite(id)`, `toggleFavourite(car)`, `count`
- **Guest mode:** Uses `src/lib/favourites.js` localStorage helpers
- **Auth mode:** Fetches from DRF, updates optimistically
- **Migration:** On login, guest favourites are POSTed to backend, then localStorage is cleared

---

## API Layer

### Public Endpoints (via `src/lib/cars.js`)

| Function              | Endpoint                        | Revalidation | Fallback |
|-----------------------|---------------------------------|--------------|----------|
| `getCars()`           | `GET /api/cars/`                | 60s          | `[]`     |
| `getCarsByBrand(slug)`| Filters `getCars()` by brand    | 60s          | `[]`     |
| `getCar(id)`          | `GET /api/cars/{id}/`           | 60s          | `null`   |
| `getSimilar(id, n)`   | `GET /api/cars/{id}/similar/?limit=n` | 60s    | `[]`     |
| `getFilters()`        | `GET /api/filters/`             | 300s         | `null`   |

### Authenticated Endpoints (via `src/lib/api.js` — `apiFetch` wrapper)

| Module                    | Description                          |
|---------------------------|--------------------------------------|
| `src/lib/favourites.js`   | Favourites CRUD (GET, POST, DELETE)  |
| `src/lib/appointments.js` | Appointment booking                  |
| `src/lib/partExchange.js` | Part exchange submissions            |
| `src/lib/vehicleSourcing.js` | Vehicle sourcing requests        |
| `src/lib/delivery.js`     | Delivery enquiries                   |
| `src/lib/newsletter.js`   | Newsletter subscriptions             |
| `src/lib/testimonials.js` | Testimonials                         |

### Payments Service (`src/services/paymentsService.js`)

| Function                       | Endpoint                                          | Description                  |
|--------------------------------|---------------------------------------------------|------------------------------|
| `createCheckoutSession(args)`  | `POST /api/v1/payments/create-checkout-session/`  | Create Stripe Checkout       |
| `getPaymentStatus(reference)`  | `GET /api/v1/payments/{reference}/`               | Check payment status         |

**Note:** `apiFetch` is the authenticated fetch wrapper. It automatically attaches the Bearer token and handles 401 → token refresh → retry.

---

## Authentication

### Flow
1. **Login:** User submits credentials → DRF returns `{ access, refresh, user }`
2. **Storage:** Access token → in-memory variable (`_accessToken`). Refresh token → `localStorage`
3. **Page Reload:** `AuthProvider` calls `attemptRefresh()` → exchanges refresh token for new access token
4. **API Calls:** `apiFetch()` attaches `Authorization: Bearer <access>` header
5. **Token Expiry:** On 401 response, `apiFetch` calls `attemptRefresh()` and retries once
6. **Logout:** Clears tokens, clears user state

### Login Gate
```js
import { loginGate } from "@/context/AuthContext";
const href = loginGate(user, "/favourites");
// → "/favourites" if logged in, "/login?returnTo=/favourites" if not
```

### Display Name
```js
import { getDisplayName } from "@/context/AuthContext";
getDisplayName(user)  // → "John" (first name), or "john@..." (email prefix), or ""
```

---

## Payments

The project uses **Stripe Hosted Checkout** for car deposit payments.

### Flow
1. User clicks "Reserve" on a car → goes to `/checkout`
2. Checkout page calls `createCheckoutSession({ car: id, successUrl, cancelUrl })`
3. Backend creates a Stripe Checkout Session, returns `{ url, reference }`
4. Frontend redirects browser to `url` (Stripe's hosted page)
5. After payment: user returns to `/payment/complete?reference=...`
6. Frontend calls `getPaymentStatus(reference)` to verify

### Error Handling
- **409 CAR_UNAVAILABLE:** Car was just reserved/sold by another user
- **400/502:** Backend validation errors or service unavailable

---

## Styling

The project uses a **dual CSS approach**:

1. **Tailwind CSS** (`tailwind.config.js`) — utility-first, used for most layout and spacing
2. **Custom CSS files** — per-view CSS files for complex styling (e.g. `About.css`, `Blogs.css`, etc.)

### Global Styles
- `src/app/globals.css` — Tailwind directives (`@tailwind base/components/utilities`) + custom properties
- `src/styles/global.css` — extra global styles (loaded after globals.css in layout.js)

### Theme
- Primary theme color: `var(--theme-color, #ac1c7a)` (purple/magenta)
- Background: `var(--background-color, #fffdf5)` (warm off-white)
- Fonts: Barlow Condensed (headings), Great Vibes (accents), Lato, Montserrat

---

## Environment Variables

| Variable                    | Required | Description                          |
|-----------------------------|----------|--------------------------------------|
| `NEXT_PUBLIC_API_URL`       | Yes      | Django REST API base URL             |

**Example `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**Note:** `.env*` files are gitignored (see `.gitignore`). Create a `.env.local` file locally to run the project.

---

## Available Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Backend API Contracts

The following documents in `docs/` specify the expected backend API contracts:

| Document                                         | Description                        |
|--------------------------------------------------|------------------------------------|
| `docs/BACKEND_APPOINTMENTS_REQUEST.md`           | Appointment booking endpoint       |
| `docs/BACKEND_FAVOURITES_REQUEST.md`             | Favourites CRUD endpoints          |
| `docs/backend-stripe-hosted-checkout.md`         | Stripe Checkout Session endpoints  |
| `docs/FILTER_BACKEND_SCENARIO.md`                | Dynamic filter API specification   |
| `docs/BLOGS_DYNAMIC_SPEC.md`                     | Dynamic blogs API specification    |
| `docs/BACKEND_SELL_MY_CAR_REQUEST.md`            | Sell My Car lookup + submission    |

The backend (Django REST Framework) is expected to be running at the URL specified by `NEXT_PUBLIC_API_URL`.

---

## Dynamic Blogs

Blog posts are managed via Django Admin and served through DRF. The frontend fetches and displays them dynamically.

### API Endpoints

| Method | Endpoint                        | Description                   |
|--------|---------------------------------|-------------------------------|
| GET    | `/api/blogs/`                   | All published posts           |
| GET    | `/api/blogs/?featured=true`     | Featured/editor's pick post   |
| GET    | `/api/blogs/?category=Car Tips` | Filtered by category          |
| GET    | `/api/blogs/:slug/`             | Single post with full body    |

### Frontend Implementation
- **Server Component:** `src/app/blogs/page.js` fetches posts on the server with ISR (60s revalidation)
- **View:** `src/views/Blogs.jsx` receives `posts` and `featuredPost` as props
- **Detail:** `src/app/blogs/[slug]/page.js` for individual blog posts
- **Category filter:** `src/app/blogs/category/page.js`

Full specification: `docs/BLOGS_DYNAMIC_SPEC.md`

---

## Path Aliases

The project uses `@/` as a shortcut for `src/` (configured in `jsconfig.json`):

```js
// Instead of
import Navbar from "../../components/Navbar/Navbar";

// Use
import Navbar from "@/components/Navbar/Navbar";
```

---

## Development Notes

### Next.js 16 / React 19
This project uses Next.js 16.2.6 and React 19.2.4. Be aware of potential breaking changes compared to earlier versions. Relevant documentation can be found in `node_modules/next/dist/docs/`.

### Turbopack
The project configures Turbopack in `next.config.mjs` with a pinned root to avoid workspace conflicts with the parent CRA repository.

### ESLint
Uses the new flat config format (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals`.

---

## Key Dependencies

```json
{
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "tailwindcss": "^3.4.19",
  "swiper": "^12.2.0",
  "react-icons": "^5.6.0",
  "autoprefixer": "^10.5.0",
  "postcss": "^8.5.15"
}
```

Dev dependencies: `eslint`, `eslint-config-next`, `sharp` (image optimization).

---

*Project documentation generated for Noorrix Motors — July 2026*