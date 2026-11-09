// UK phone number validation + formatting for customer-facing forms.
//
// Accepts the ways people actually type UK numbers:
//   07700 900123 · 07700-900-123 · +44 7700 900123 · +44 (0)7700 900123
//   0044 7700 900123 · 447700900123 · (020) 7946 0958 · 01632 960001
//
// Only personal numbers are accepted: UK mobiles and geographic landlines.
// Non-geographic 03/08 numbers (0300 helplines, 0800 freephone) are company
// numbers, and their 11-digit "03…" shape is identical to Pakistani mobiles
// (0332 4165927), so allowing them let foreign numbers through.

export const UK_PHONE_ERROR = "Please enter a valid UK phone number.";

// National significant number (no leading 0 / country code):
//   mobiles     71–75, 77–79 + 8 digits, and 7624 (Isle of Man) + 6 digits.
//               070 (personal numbering) and 076 (pagers) aren't mobiles.
//   landlines   01 + 8–9 digits; 02 only in its allocated 020/023/024/028/029 areas.
const NSN_PATTERN = /^(?:7[1-57-9]\d{8}|7624\d{6}|1\d{8,9}|2[03489]\d{8})$/;

/** "+44 (0)7700-900 123" -> "7700900123", or null if it can't be a UK number. */
function nationalNumber(input) {
  const s = String(input ?? "").replace(/[\s\-().]/g, "");
  let rest;
  if (s.startsWith("+44")) rest = s.slice(3);
  else if (s.startsWith("0044")) rest = s.slice(4);
  else if (s.startsWith("44") && s.length >= 11) rest = s.slice(2);
  else if (s.startsWith("0")) rest = s.slice(1);
  else return null;

  if (rest.startsWith("0")) rest = rest.slice(1); // the "(0)" in "+44 (0)7700 …"
  return /^\d+$/.test(rest) ? rest : null;
}

export function isValidUkPhone(input) {
  const nsn = nationalNumber(input);
  return nsn !== null && NSN_PATTERN.test(nsn);
}

/** E.164 for the API: "07700 900123" -> "+447700900123". Null if invalid. */
export function toE164UkPhone(input) {
  return isValidUkPhone(input) ? `+44${nationalNumber(input)}` : null;
}

/**
 * Display format:
 *   "07701910159" -> "+44 7701 910159"   "02079460958" -> "+44 20 7946 0958"
 *   "01614960000" -> "+44 161 496 0000"  "01632960001" -> "+44 1632 960001"
 */
export function formatUkPhone(input) {
  if (!isValidUkPhone(input)) return String(input ?? "");
  const n = nationalNumber(input);
  if (n.startsWith("2")) return `+44 ${n.slice(0, 2)} ${n.slice(2, 6)} ${n.slice(6)}`;
  // Big-city 011x / 01x1 codes (0113, 0121, 0161 …) are 3 digits after the 0.
  if (/^1(1\d|\d1)\d{7}$/.test(n)) return `+44 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  return `+44 ${n.slice(0, 4)} ${n.slice(4)}`;
}
