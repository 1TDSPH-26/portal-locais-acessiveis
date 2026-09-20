export function TextPlusControl() {
  const handleIncrease = () => {
    const html = document.documentElement;

    if (html.classList.contains("font-size-large")) {
      html.classList.remove("font-size-large");
      html.classList.add("font-size-xlarge");
      return;
    }

    if (!html.classList.contains("font-size-xlarge")) {
      html.classList.add("font-size-large");
    }
  };

  return (
    <button
      type="button"
      className="accessibility-button"
      aria-label="Aumentar tamanho do texto"
      title="Aumentar tamanho do texto"
      onClick={handleIncrease}
    >
      A+
    </button>
  );
}
