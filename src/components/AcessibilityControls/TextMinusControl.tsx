export function TextMinusControl() {
  const handleDecrease = () => {
    const html = document.documentElement;

    if (html.classList.contains("font-size-xlarge")) {
      html.classList.remove("font-size-xlarge");
      html.classList.add("font-size-large");
      return;
    }

    if (html.classList.contains("font-size-large")) {
      html.classList.remove("font-size-large");
    }
  };

  return (
    <button
      type="button"
      className="accessibility-button"
      aria-label="Reduzir tamanho do texto"
      title="Reduzir tamanho do texto"
      onClick={handleDecrease}
    >
      A-
    </button>
  );
}
