import { useAccessibility } from "../../contexts/AccessibilityContext";

export function TextMinusControl() {
  const { fontScale, increaseFontSize } = useAccessibility();

  const percentage = Math.round(fontScale * 100);

  return (
    <button
      type="button"
      onClick={increaseFontSize}
      aria-label={`Tamanho atual: ${percentage}%`}
      title="Aumentar tamanho da fonte"
    >
      A+
    </button>
  );
}
