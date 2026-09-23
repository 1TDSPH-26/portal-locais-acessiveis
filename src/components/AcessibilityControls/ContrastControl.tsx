import { useEffect, useState } from "react";

export function ContrastControl() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "high-contrast",
      highContrast,
    );

    return () => {
      document.documentElement.classList.remove("high-contrast");
    };
  }, [highContrast]);

  return (
    <button
      type="button"
      className="accessibility-button"
      aria-pressed={highContrast}
      aria-label={
        highContrast
          ? "Desativar alto contraste"
          : "Ativar alto contraste"
      }
      onClick={() => setHighContrast((current) => !current)}
    >
      C
    </button>
  );
}

