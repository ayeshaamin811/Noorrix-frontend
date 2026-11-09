import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import StepProgress from "./StepProgress";
import UkPlate from "./UkPlate";
import { vehicleName, vehicleSpecs } from "./vehicle";

/** "Is this your car?" — shows what the registration lookup found before the form. */
export default function ConfirmStep({ reg, vehicle, onBack, onNext }) {
  return (
    <div className="smc-card smc-confirm">
      <StepProgress current={0} />

      <div className="smc-car-head">
        <UkPlate reg={reg} />
        <h2 className="smc-car-name">{vehicleName(vehicle)}</h2>
        <p className="smc-car-meta">
          <span>{vehicleSpecs(vehicle).join(" · ")}</span>
          <button type="button" className="smc-change" onClick={onBack}>
            Not your car?
          </button>
        </p>
      </div>

      <div className="smc-actions">
        <button type="button" className="smc-btn smc-btn--dark" onClick={onBack}>
          <FiArrowLeft size={18} /> Back
        </button>
        <button type="button" className="smc-btn smc-btn--primary" onClick={onNext}>
          Next <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
