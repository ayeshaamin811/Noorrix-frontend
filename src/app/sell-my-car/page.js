import SellMyCar from "@/views/SellMyCar/SellMyCar";

export const metadata = {
  title: "Sell My Car | Noorrix Motors",
  description:
    "Sell your car to Noorrix Motors. Enter your registration for a free valuation, then book a time for us to inspect your car and confirm your offer.",
};

const BASE = process.env.NEXT_PUBLIC_API_URL?.trim();

async function fetchFAQs() {
  try {
    const res = await fetch(`${BASE}/api/faqs/`, { next: { revalidate: 60 } });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const faqs = await fetchFAQs();
  return <SellMyCar faqs={faqs} />;
}
