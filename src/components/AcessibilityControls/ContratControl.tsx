import { useAccessibility } from "../../contexts/AccessibilityContext";

export function ContrastControl() {
  const { contrast, toggleContrast } = useAccessibility();

  const isHighContrast = contrast === "high";

  return (
    <button
      type="button"
      onClick={toggleContrast}
      aria-pressed={isHighContrast}
      aria-label={
        isHighContrast
          ? "Contraste aumentado."
          : "Contraste reduzido."
      }
      title={
        isHighContrast
          ? "Reduzir contraste"
          : "Aumentar contraste"
      }
    >
      Contraste: {isHighContrast ? "Alto" : "Normal"}
    </button>
  );
}
