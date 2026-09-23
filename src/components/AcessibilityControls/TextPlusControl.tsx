import { useEffect, useState } from "react";

export function TextPlusControl() {
  const [isMaximum, setIsMaximum] = useState(false);

  const handleIncrease = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute("data-font-size") || "1";

    if (currentSize === "1") {
      html.setAttribute("data-font-size", "2");
    } else if (currentSize === "2") {
      html.setAttribute("data-font-size", "3");
    }

    checkSize();
  };

  const checkSize = () => {
    const html = document.documentElement;
    const currentSize = html.getAttribute("data-font-size") || "1";

    setIsMaximum(currentSize === "3");
  };

  useEffect(() => {
    checkSize();
  }, []);


  return (
    <button
      type="button"
      className="accessibility-button"
      aria-label="Aumentar tamanho do texto"
      title="Aumentar tamanho do texto"
      onClick={handleIncrease}
      disabled={isMaximum}
    >
      A+
    </button>
  );
}
