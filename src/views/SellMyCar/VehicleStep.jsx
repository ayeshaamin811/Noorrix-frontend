"use client";
import { useState } from "react";
import { FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { isValidReg } from "../../lib/sellMyCar";
import { PlateBand } from "./UkPlate";

const MAX_MILEAGE_DIGITS = 7;

/** Step 1 — registration + mileage, then "Value your car". */
export default function VehicleStep({
  reg, mileage, onRegChange, onMileageChange, onSubmit, loading, error, reviews,
}) {
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    if (!isValidReg(reg)) return setFieldError("Please enter a valid UK registration number.");
    if (!mileage) return setFieldError("Please enter your car's mileage.");
    setFieldError("");
    onSubmit();
  };

  const shownError = fieldError || error;

  return (
    <div className="smc-hero">
      <span className="smc-tag">Free Car Valuation</span>
      <h1 className="smc-title">
        Sell My <span>Car</span>
      </h1>
      <p className="smc-subtitle">
        <strong>Get a free valuation</strong>, the best offer from <strong>NOORRIX MOTORS</strong>, and a
        quick, hassle-free sale.
      </p>

      <form className="smc-lookup" onSubmit={handleSubmit} noValidate>
        <label className="smc-plate">
          <PlateBand />
          <span className="sr-only">Registration number</span>
          <input
            type="text"
            value={reg}
            onChange={(e) => {
              onRegChange(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8));
              if (fieldError) setFieldError("");
            }}
            placeholder="REG NO"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            disabled={loading}
          />
        </label>

        <label className="smc-mileage">
          <IoSpeedometerOutline className="smc-mileage-icon" aria-hidden="true" />
          <span className="sr-only">Mileage</span>
          <input
            type="text"
            inputMode="numeric"
            value={mileage ? Number(mileage).toLocaleString("en-GB") : ""}
            onChange={(e) => {
              onMileageChange(e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_MILEAGE_DIGITS));
              if (fieldError) setFieldError("");
            }}
            placeholder="Mileage"
            autoComplete="off"
            disabled={loading}
          />
          <span className="smc-mileage-unit" aria-hidden="true">miles</span>
        </label>

        <button type="submit" className="smc-btn-value" disabled={loading}>
          {loading ? (
            <>
              <span className="smc-spinner" aria-hidden="true" /> Valuing…
            </>
          ) : (
            <>
              Value your car <FiArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      {shownError && (
        <p className="smc-lookup-error" role="alert">
          <FiAlertCircle size={16} /> {shownError}
        </p>
      )}

      <div className="smc-trust">
        <img src="/autoTraderLogo.svg" alt="AutoTrader" className="smc-trust-logo" />
        {reviews.count > 0 ? (
          <>
            <span className="smc-trust-divider" aria-hidden="true" />
            <span className="smc-trust-stars" aria-label={`Rated ${reviews.average} out of 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar key={i} className={i < Math.round(reviews.average) ? "is-on" : ""} />
              ))}
            </span>
            <span className="smc-trust-text">{reviews.count}+ customer reviews</span>
          </>
        ) : (
          <span className="smc-trust-text">Find our stock on AutoTrader</span>
        )}
      </div>
    </div>
  );
}
