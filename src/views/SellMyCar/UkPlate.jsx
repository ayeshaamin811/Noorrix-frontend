import { displayReg } from "../../lib/sellMyCar";

/** Simplified Union flag — accurate enough at number-plate size, no clip paths needed. */
export function UnionFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" focusable="false">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/** The blue "UK" identifier strip on the left edge of a number plate. */
export function PlateBand() {
  return (
    <span className="smc-plate-band" aria-hidden="true">
      <UnionFlag />
      <span>UK</span>
    </span>
  );
}

/** Read-only number plate showing a registration. */
export default function UkPlate({ reg }) {
  return (
    <span className="smc-plate-badge" aria-label={`Registration ${displayReg(reg)}`}>
      <PlateBand />
      <span className="smc-plate-badge-reg">{displayReg(reg)}</span>
    </span>
  );
}
