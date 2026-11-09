import { FiCheck } from "react-icons/fi";

const STEPS = ["Your car", "Your details", "Book inspection"];

/** Segmented progress bar shown at the top of the details + appointment cards. */
export default function StepProgress({ current }) {
  return (
    <ol className="smc-progress" aria-label="Progress">
      {STEPS.map((label, i) => {
        const state = i < current ? "is-done" : i === current ? "is-current" : "";
        return (
          <li key={label} className={`smc-progress-step ${state}`} aria-current={i === current ? "step" : undefined}>
            <span className="smc-progress-bar" />
            <span className="smc-progress-meta">
              <span className="smc-progress-dot">{i < current ? <FiCheck size={12} /> : i + 1}</span>
              <span className="smc-progress-label">{label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
