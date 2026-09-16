import { useAccessibility } from "../../contexts/AccessibilityContext";

export function TextPlusControl() {
  const { fontScale, decreaseFontSize } = useAccessibility();

  const percentage = Math.round(fontScale * 100);

  return (
    <button
      type="button"
      onClick={decreaseFontSize}
      aria-label={`Tamanho atual: ${percentage}%`}
      title="Diminuir tamanho da fonte"
    >
      A-
    </button>
  );
}
