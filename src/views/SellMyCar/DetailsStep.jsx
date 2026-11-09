"use client";
import { FiArrowLeft, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { IoCarSportOutline, IoSpeedometerOutline } from "react-icons/io5";
import { BsFuelPump } from "react-icons/bs";
import { TbManualGearbox } from "react-icons/tb";
import { vehicleTitle } from "../../lib/format";
import { isValidUkPhone, UK_PHONE_ERROR } from "../../lib/ukPhone";
import ImageUpload from "./ImageUpload";
import StepProgress from "./StepProgress";
import UkPlate from "./UkPlate";
import { vehicleName, vehicleSpecs } from "./vehicle";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const FIELDS = ["name", "email", "phone", "address", "message"];

/** Client-side checks; returns { field: message } for every invalid field. */
export function validateDetails(d) {
  const errors = {};
  if (d.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!d.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(d.email.trim())) errors.email = "Please enter a valid email address.";
  if (!isValidUkPhone(d.phone)) errors.phone = UK_PHONE_ERROR;
  if (d.address.trim().length < 5) errors.address = "Please enter your address.";
  return errors;
}

function Field({ id, label, required, error, full, children }) {
  return (
    <div className={`smc-field${full ? " smc-field--full" : ""}`}>
      <label className="smc-label" htmlFor={id}>
        {label}
        {required && <span className="smc-req">*</span>}
      </label>
      {children}
      {error && (
        <p className="smc-field-error" id={`${id}-error`}>
          <FiAlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

/** Step 2 — vehicle summary chips + contact details + photos. */
export default function DetailsStep({
  reg, mileage, vehicle, details, onDetailsChange, errors, onErrorsChange,
  images, onAddImages, onRemoveImage, onBack, onChangeCar, onNext,
}) {
  const chips = [
    vehicle?.body_type && { icon: IoCarSportOutline, label: vehicleTitle(vehicle.body_type) },
    vehicle?.fuel_type && { icon: BsFuelPump, label: vehicleTitle(vehicle.fuel_type) },
    vehicle?.transmission && { icon: TbManualGearbox, label: vehicleTitle(vehicle.transmission) },
    { icon: IoSpeedometerOutline, label: `${Number(mileage).toLocaleString("en-GB")} miles` },
  ].filter(Boolean);

  const carName = vehicleName(vehicle);
  const carSpecs = vehicleSpecs(vehicle, ["year", "colour"]).join(" · ");

  const setFieldError = (name, message) => {
    if ((errors[name] || "") === (message || "")) return;
    const next = { ...errors };
    if (message) next[name] = message;
    else delete next[name];
    onErrorsChange(next);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...details, [name]: value };
    onDetailsChange(next);
    // Once a field is showing an error, re-check it live so it clears as soon as it's fixed.
    if (errors[name]) setFieldError(name, validateDetails(next)[name]);
  };

  // Validate when the customer leaves a field they've typed in.
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value.trim()) setFieldError(name, validateDetails(details)[name]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateDetails(details);
    onErrorsChange(found);
    const first = FIELDS.find((f) => found[f]);
    if (first) {
      document.getElementById(`smc-${first}`)?.focus();
      return;
    }
    onNext();
  };

  const inputProps = (name) => ({
    id: `smc-${name}`,
    name,
    value: details[name],
    onChange: handleChange,
    onBlur: handleBlur,
    className: `smc-input${errors[name] ? " is-invalid" : ""}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `smc-${name}-error` : undefined,
  });

  return (
    <div className="smc-card smc-details">
      <StepProgress current={1} />

      <div className="smc-car-head">
        <UkPlate reg={reg} />
        <h2 className="smc-car-name">{carName || "Tell us about you"}</h2>
        <p className="smc-car-meta">
          <span>
            {carName ? carSpecs : <>We&apos;ll use these details to send your offer and arrange the inspection.</>}
          </span>
          <button type="button" className="smc-change" onClick={onChangeCar}>
            Change car
          </button>
        </p>
      </div>

      <ul className="smc-chips">
        {chips.map(({ icon: Icon, label }) => (
          <li key={label} className="smc-chip">
            <Icon aria-hidden="true" /> {label}
          </li>
        ))}
      </ul>

      <form className="smc-form-grid" onSubmit={handleSubmit} noValidate>
        <Field id="smc-name" label="Name" required error={errors.name}>
          <input type="text" autoComplete="name" placeholder="Enter your name" {...inputProps("name")} />
        </Field>

        <Field id="smc-email" label="Email" required error={errors.email}>
          <input type="email" autoComplete="email" placeholder="Enter your email" {...inputProps("email")} />
        </Field>

        <Field id="smc-phone" label="Phone" required error={errors.phone} full>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. +44 7701 910159"
            {...inputProps("phone")}
          />
        </Field>

        <Field id="smc-address" label="Address" required error={errors.address} full>
          <input
            type="text"
            autoComplete="street-address"
            placeholder="Enter your address"
            {...inputProps("address")}
          />
        </Field>

        <Field id="smc-message" label="Message" error={errors.message} full>
          <textarea rows={3} placeholder="Write your message here" {...inputProps("message")} />
        </Field>

        <div className="smc-field smc-field--full">
          <span className="smc-label">Upload Images</span>
          <ImageUpload
            images={images}
            onAdd={onAddImages}
            onRemove={onRemoveImage}
            serverError={errors.images}
          />
        </div>

        <div className="smc-actions smc-field--full">
          <button type="button" className="smc-btn smc-btn--dark" onClick={onBack}>
            <FiArrowLeft size={18} /> Back
          </button>
          <button type="submit" className="smc-btn smc-btn--primary">
            Choose a time <FiArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
