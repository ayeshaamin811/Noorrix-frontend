"use client";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { LuSunrise, LuUtensils, LuSun, LuMoon } from "react-icons/lu";
import { getSellAvailability } from "../../lib/sellMyCar";
import StepProgress from "./StepProgress";
import {
  ALL_SLOTS, DAYS_AHEAD, SLOT_GROUPS, dayCard, isPastSlot, longDate, nextDays, slotLabel,
} from "./slots";

const GROUP_ICONS = { morning: LuSunrise, lunch: LuUtensils, afternoon: LuSun, evening: LuMoon };

/** Step 3 — pick a day + 30-minute inspection slot, then submit everything. */
export default function AppointmentStep({
  appointment, onAppointmentChange, takenSlots, onBack, onSubmit, submitting, error,
}) {
  // Re-read the clock every minute so slots that start while the page is open lock out.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => nextDays(DAYS_AHEAD, now), [now]);
  const hasOpenSlot = (iso) => ALL_SLOTS.some((t) => !isPastSlot(iso, t, now));

  // Late in the evening today has nothing left — default to the first day that does.
  const date =
    appointment.date && days.includes(appointment.date)
      ? appointment.date
      : days.find(hasOpenSlot) || days[0];

  // Booked slots for the visible date. Loading is derived (result's date !== date)
  // so the effect only ever sets state from the async callback.
  const [availability, setAvailability] = useState({ date: null, times: [] });
  useEffect(() => {
    let active = true;
    getSellAvailability(date).then((times) => {
      if (active) setAvailability({ date, times });
    });
    return () => {
      active = false;
    };
  }, [date]);
  const loadingSlots = availability.date !== date;

  const isUnavailable = (time) =>
    loadingSlots ||
    isPastSlot(date, time, now) ||
    availability.times.includes(time) ||
    takenSlots.includes(`${date}T${time}`);

  const selectedTime =
    appointment.date === date && appointment.time && !isUnavailable(appointment.time) ? appointment.time : "";

  return (
    <div className="smc-card">
      <StepProgress current={2} />

      <div className="smc-card-head smc-card-head--center">
        <div>
          <h2 className="smc-card-title">Book your inspection</h2>
          <p className="smc-card-sub">
            Choose a time that suits you. We&apos;ll inspect your car and confirm your offer.
          </p>
        </div>
      </div>

      <div className="smc-days" role="group" aria-label="Choose a day">
        {days.map((iso) => {
          const { day, date: dm } = dayCard(iso);
          const open = hasOpenSlot(iso);
          return (
            <button
              key={iso}
              type="button"
              className={`smc-day${iso === date ? " is-selected" : ""}`}
              aria-pressed={iso === date}
              aria-label={longDate(iso)}
              disabled={!open}
              onClick={() => onAppointmentChange({ date: iso, time: "" })}
            >
              <span className="smc-day-name">{day}</span>
              <span className="smc-day-date">{dm}</span>
            </button>
          );
        })}
      </div>

      <h3 className="smc-date-heading">{longDate(date)}</h3>

      <div className="smc-slot-groups">
        {SLOT_GROUPS.map(({ key, label, times }) => {
          const Icon = GROUP_ICONS[key];
          return (
            <div key={key} className="smc-slot-group">
              <h4>
                <Icon aria-hidden="true" /> {label}
              </h4>
              <ul className="smc-slot-list">
                {times.map((time) => (
                  <li key={time}>
                    <button
                      type="button"
                      className={`smc-slot${time === selectedTime ? " is-selected" : ""}`}
                      aria-pressed={time === selectedTime}
                      disabled={isUnavailable(time)}
                      onClick={() => onAppointmentChange({ date, time })}
                    >
                      {slotLabel(time)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {loadingSlots && <p className="smc-slots-note">Checking availability…</p>}

      {error && (
        <p className="smc-submit-error" role="alert">
          <FiAlertCircle size={16} /> {error}
        </p>
      )}

      <div className="smc-actions">
        <button type="button" className="smc-btn smc-btn--dark" onClick={onBack} disabled={submitting}>
          <FiArrowLeft size={18} /> Back
        </button>
        <button
          type="button"
          className="smc-btn smc-btn--primary"
          onClick={onSubmit}
          disabled={!selectedTime || submitting}
        >
          {submitting ? (
            <>
              <span className="smc-spinner" aria-hidden="true" /> Submitting…
            </>
          ) : (
            "Submit details"
          )}
        </button>
      </div>
    </div>
  );
}
