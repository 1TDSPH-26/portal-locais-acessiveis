import { useEffect, useState } from "react";

export function TextMinusControl() {
  const [isMinimum, setIsMinimum] = useState(false);

  const handleDecrease = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute("data-font-size") || "1";

    if (currentSize === "3") {
      html.setAttribute("data-font-size", "2");
    } else if (currentSize === "2") {
      html.setAttribute("data-font-size", "1");
    }

    if (currentSize === "2" || currentSize === "3") {
      setIsMinimum(
        currentSize === "2"
      );
    }
  };

  useEffect(() => {
    const html = document.documentElement;

    const checkSize = () => {
      const currentSize = html.getAttribute("data-font-size") || "1";

      setIsMinimum(currentSize === "1");
    };

    checkSize();
  }, []);

  return (
    <button
      type="button"
      className="accessibility-button"
      aria-label="Reduzir tamanho do texto"
      title="Reduzir tamanho do texto"
      onClick={handleDecrease}
      disabled={isMinimum}
    >
      A-
    </button>
  );
}