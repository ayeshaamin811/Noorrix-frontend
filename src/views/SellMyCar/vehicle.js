import { vehicleTitle } from "../../lib/format";

/** "Citroen C3", or "" when the lookup didn't identify the car. */
export const vehicleName = (v) => [v?.make, v?.model].filter(Boolean).map(vehicleTitle).join(" ");

/** ["2009", "Silver", "Diesel"] — only the fields the lookup actually returned. */
export const vehicleSpecs = (v, fields = ["year", "colour", "body_type", "fuel_type"]) =>
  fields.map((field) => v?.[field]).filter(Boolean).map(vehicleTitle);
