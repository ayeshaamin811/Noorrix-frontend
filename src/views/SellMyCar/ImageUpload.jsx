"use client";
import { useRef, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

export const MAX_IMAGES = 10;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/gif", "image/webp"];

/**
 * Drag-and-drop / browse photo picker. The parent owns the list
 * (`{ id, file, url }[]`) so photos survive going back and forth between steps.
 */
export default function ImageUpload({ images, onAdd, onRemove, serverError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const room = MAX_IMAGES - images.length;
    const accepted = [];
    let problem = "";
    for (const file of files) {
      if (!ACCEPTED.includes(file.type)) {
        problem = "Only PNG, JPG, GIF or WEBP images can be uploaded.";
      } else if (file.size > MAX_BYTES) {
        problem = `"${file.name}" is larger than 10MB.`;
      } else if (accepted.length >= room) {
        problem = `You can upload up to ${MAX_IMAGES} photos.`;
        break;
      } else {
        accepted.push(file);
      }
    }
    setError(problem);
    if (accepted.length) onAdd(accepted);
  };

  const openPicker = () => inputRef.current?.click();
  const shownError = error || serverError;

  return (
    <div>
      <div
        className={`smc-drop${dragging ? " is-dragging" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload images: drag and drop, or press Enter to browse"
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <span className="smc-drop-icon">
          <FiUploadCloud />
        </span>
        <p className="smc-drop-text">
          Drag and drop images here, or <span className="smc-drop-browse">browse</span>
        </p>
        <p className="smc-drop-hint">PNG, JPG, GIF up to 10MB · up to {MAX_IMAGES} photos</p>
      </div>

      {/* Kept outside the drop zone so its own click doesn't bubble back into openPicker. */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = ""; // allow re-picking the same file after removing it
        }}
      />

      {shownError && <p className="smc-field-error">{shownError}</p>}

      {images.length > 0 && (
        <ul className="smc-thumbs">
          {images.map((img) => (
            <li key={img.id} className="smc-thumb">
              <img src={img.url} alt={img.file.name} />
              <button type="button" onClick={() => onRemove(img.id)} aria-label={`Remove ${img.file.name}`}>
                <FiX size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
