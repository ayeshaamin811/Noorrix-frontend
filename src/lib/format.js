// Display formatting helpers.
// The Cars API sends raw numbers (price, mileage, engine_cc, year) and ISO dates;
// format them for display here so every page renders consistently.

export const gbp   = (n) => (n == null ? "" : `£${Number(n).toLocaleString("en-GB")}`);        // 14495    -> "£14,495"
export const money = (n) => (n == null ? null : `£${Number(n).toFixed(2)}`);                     // "245.00" -> "£245.00"
export const miles = (n) => (n == null ? "" : `${Number(n).toLocaleString("en-GB")} Miles`);     // 42300    -> "42,300 Miles"
export const cc    = (n) => (n == null ? "" : `${Number(n).toLocaleString("en-GB")} CC`);         // 1995     -> "1,995 CC"

// Vehicle data sources send names in capitals. Title-case them, but keep acronyms
// and model codes as they are: "CITROEN" -> "Citroen", "RAV4" -> "RAV4", "GOLF GTI" -> "Golf GTI".
const VEHICLE_ACRONYMS = new Set([
  "BMW", "MG", "DS", "BYD", "LDV", "VW", "AMG", "GT", "GTI", "GTD", "GTE", "RS", "ST", "TT", "SUV", "MPV",
]);
export const vehicleTitle = (value) =>
  String(value ?? "")
    .trim()
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase();
      if (/\d/.test(word) || VEHICLE_ACRONYMS.has(upper)) return upper;
      return upper.split("-").map((part) => part.charAt(0) + part.slice(1).toLowerCase()).join("-");
    })
    .join(" ");

export const ukDate = (iso) =>                                                                   // "2026-06-01" -> "01/06/2026"
  iso ? new Date(iso).toLocaleDateString("en-GB") : null;

// Slugify a make for /used-cars/:brand links (matches the backend's slug format).
// "Land Rover" -> "land-rover", "Citroën" -> "citroen"
export const brandSlug = (make) =>
  make
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Car detail page URL — leads with the numeric id (so the route only ever needs
// to parse the leading digits) and appends a readable slug from the title.
// "14" -> "/cars/14-honda-city"
export const carUrl = (car) => {
  const slug = (car.title || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug ? `/cars/${car.id}-${slug}` : `/cars/${car.id}`;
};
