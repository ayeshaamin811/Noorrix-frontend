"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaCarSide, FaCamera, FaCalendarAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import NoorrixFooter from "../../components/Footer/Footer";
import { lookupVehicle, submitSellMyCar } from "../../lib/sellMyCar";
import { getTestimonials } from "../../lib/testimonials";
import { toE164UkPhone } from "../../lib/ukPhone";
import VehicleStep from "./VehicleStep";
import DetailsStep, { FIELDS } from "./DetailsStep";
import AppointmentStep from "./AppointmentStep";
import SuccessStep from "./SuccessStep";
import "./SellMyCar.css";

const INITIAL_DETAILS = { name: "", email: "", phone: "", address: "", message: "" };

const HOW_IT_WORKS = [
  {
    icon: FaCarSide,
    title: "Enter your reg",
    desc: "Tell us your registration and mileage and we'll look up your car's details.",
  },
  {
    icon: FaCamera,
    title: "Add your details",
    desc: "Share your contact details and a few photos so we can prepare the best offer.",
  },
  {
    icon: FaCalendarAlt,
    title: "Book an inspection",
    desc: "Pick a time that suits you. We'll inspect your car and confirm your offer.",
  },
];

// DRF sends { field: ["message", ...] } — keep the first message per field.
const firstMessages = (errors = {}) =>
  Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)]));

/**
 * Sell My Car — four steps on one page:
 *   vehicle (reg + mileage) → details (contact + photos) → appointment (inspection slot) → done
 * All state lives here so going Back never loses what the customer typed.
 */
export default function SellMyCar() {
  const [step, setStep] = useState("vehicle");

  const [reg, setReg] = useState("");
  const [mileage, setMileage] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [detailErrors, setDetailErrors] = useState({});
  const [images, setImages] = useState([]);

  const [appointment, setAppointment] = useState({ date: "", time: "" });
  const [takenSlots, setTakenSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);

  const [reviews, setReviews] = useState({ count: 0, average: 0 });

  const flowRef = useRef(null);
  const nextImageId = useRef(0);
  const imagesRef = useRef(images);

  // Free the photo preview URLs when the customer leaves the page.
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url)), []);

  // Real customer reviews for the trust strip under the reg lookup.
  useEffect(() => {
    let active = true;
    getTestimonials().then((list) => {
      if (!active || !list.length) return;
      const ratings = list.map((t) => Number(t.rating)).filter((r) => r >= 1 && r <= 5);
      const average = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      setReviews({ count: list.length, average: Math.round(average * 10) / 10 });
    });
    return () => {
      active = false;
    };
  }, []);

  const goTo = (next) => {
    setStep(next);
    // Bring the top of the flow back into view if the customer had scrolled past it.
    const el = flowRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Step 1: lookup ──
  const handleLookup = async () => {
    setLookupLoading(true);
    setLookupError("");
    try {
      setVehicle(await lookupVehicle({ reg, mileage: Number(mileage) }));
      goTo("details");
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  // ── Step 2: photos ──
  const addImages = (files) => {
    const added = files.map((file) => ({
      id: nextImageId.current++,
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...added]);
    if (detailErrors.images) setDetailErrors(({ images: _drop, ...rest }) => rest);
  };

  const removeImage = (id) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.url);
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Step 3: submit ──
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const data = await submitSellMyCar({
        reg,
        mileage: Number(mileage),
        name: details.name.trim(),
        email: details.email.trim(),
        phone: toE164UkPhone(details.phone),
        address: details.address.trim(),
        message: details.message.trim(),
        date: appointment.date,
        time: appointment.time,
        images: images.map((i) => i.file),
      });
      setResult(data);
      goTo("done");
    } catch (err) {
      if (err.code === "SLOT_TAKEN") {
        setTakenSlots((prev) => [...prev, `${appointment.date}T${appointment.time}`]);
        setAppointment((a) => ({ ...a, time: "" }));
        setSubmitError(err.message);
        return;
      }

      // Send the customer back to whichever step has the field the backend rejected.
      const fieldErrors = firstMessages(err.fieldErrors);
      if (fieldErrors.reg || fieldErrors.mileage) {
        setLookupError(fieldErrors.reg || fieldErrors.mileage);
        goTo("vehicle");
      } else if ([...FIELDS, "images"].some((f) => fieldErrors[f])) {
        setDetailErrors(fieldErrors);
        goTo("details");
      } else {
        setSubmitError(
          fieldErrors.appointment_date ||
            fieldErrors.appointment_time ||
            fieldErrors.non_field_errors ||
            Object.values(fieldErrors)[0] ||
            err.message
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedValue = result?.estimated_value ?? vehicle?.estimated_value ?? null;

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm">
          <Link href="/" className="breadcrumb text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">›</span>
          <span className="text-gray-900 font-medium">Sell My Car</span>
        </div>
      </div>

      <section className={`smc-flow smc-flow--${step}`} ref={flowRef}>
        <div className="smc-flow-bg" />
        <div className="smc-flow-overlay" />
        <div className="smc-flow-inner">
          {step === "vehicle" && (
            <VehicleStep
              reg={reg}
              mileage={mileage}
              onRegChange={(v) => {
                setReg(v);
                setLookupError("");
              }}
              onMileageChange={(v) => {
                setMileage(v);
                setLookupError("");
              }}
              onSubmit={handleLookup}
              loading={lookupLoading}
              error={lookupError}
              reviews={reviews}
            />
          )}

          {step === "details" && (
            <DetailsStep
              reg={reg}
              mileage={mileage}
              vehicle={vehicle}
              details={details}
              onDetailsChange={setDetails}
              errors={detailErrors}
              onErrorsChange={setDetailErrors}
              images={images}
              onAddImages={addImages}
              onRemoveImage={removeImage}
              onBack={() => goTo("vehicle")}
              onNext={() => goTo("appointment")}
            />
          )}

          {step === "appointment" && (
            <AppointmentStep
              appointment={appointment}
              onAppointmentChange={(a) => {
                setAppointment(a);
                setSubmitError("");
              }}
              takenSlots={takenSlots}
              onBack={() => {
                setSubmitError("");
                goTo("details");
              }}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={submitError}
            />
          )}

          {step === "done" && (
            <SuccessStep
              reg={reg}
              mileage={mileage}
              details={details}
              appointment={appointment}
              estimatedValue={estimatedValue}
            />
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="smc-how">
        <div className="smc-how-inner">
          <span className="smc-section-tag">Simple Process</span>
          <h2 className="smc-section-title">
            How Selling <span>Works</span>
          </h2>
          <p className="smc-section-subtitle">Three quick steps from valuation to sale — no obligation.</p>
          <div className="smc-how-grid">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="smc-how-card">
                <span className="smc-how-num">0{i + 1}</span>
                <span className="smc-how-icon">
                  <Icon size={20} />
                </span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NoorrixFooter />
    </>
  );
}
