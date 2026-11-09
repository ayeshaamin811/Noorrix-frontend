import Link from "next/link";
import { LuCalendarCheck } from "react-icons/lu";
import { FaCarSide } from "react-icons/fa";
import { gbp } from "../../lib/format";
import { formatUkPhone } from "../../lib/ukPhone";
import { longDate, slotLabel } from "./slots";
import UkPlate from "./UkPlate";

/** Step 4 — confirmation, estimated value and a summary of what was sent. */
export default function SuccessStep({ reg, mileage, details, appointment, estimatedValue }) {
  const rows = [
    { label: "Name", value: details.name },
    { label: "Phone Number", value: formatUkPhone(details.phone) },
    { label: "Email", value: details.email },
    { label: "Address", value: details.address },
    details.message.trim() && { label: "Message", value: details.message },
  ].filter(Boolean);

  return (
    <div className="smc-done">
      <div className="smc-done-main">
        <span className="smc-done-icon">
          <LuCalendarCheck aria-hidden="true" />
        </span>
        <h2 className="smc-done-title">Car details submitted successfully. Well done.</h2>
        <p className="smc-done-text">One of our representatives will contact you shortly.</p>
        <div className="smc-done-actions">
          <Link href="/stock" className="smc-btn smc-btn--primary">
            <FaCarSide size={16} /> Browse our stock
          </Link>
          <Link href="/" className="smc-btn smc-btn--ghost">
            Back to home
          </Link>
        </div>
      </div>

      <div className="smc-done-side">
        {estimatedValue != null ? (
          <div className="smc-estimate">
            <span className="smc-estimate-label">Estimated Value:</span>
            <span className="smc-estimate-value">{gbp(estimatedValue)}</span>
            <span className="smc-estimate-note">Final offer confirmed after inspection.</span>
          </div>
        ) : (
          <div className="smc-estimate">
            <span className="smc-estimate-label">Your valuation is on its way</span>
            <span className="smc-estimate-note">We&apos;ll confirm your offer when we contact you.</span>
          </div>
        )}

        <div className="smc-summary">
          <h3>Your Details</h3>
          <div className="smc-summary-vehicle">
            <UkPlate reg={reg} />
            <span>{Number(mileage).toLocaleString("en-GB")} miles</span>
          </div>
          <dl>
            {rows.map(({ label, value }) => (
              <div key={label} className="smc-summary-row">
                <dt>{label}:</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div className="smc-summary-row is-stacked">
              <dt>Appointment Detail:</dt>
              <dd>
                {longDate(appointment.date)} at {slotLabel(appointment.time)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
