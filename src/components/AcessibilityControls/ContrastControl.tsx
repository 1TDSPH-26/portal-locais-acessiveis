
import { useState } from 'react'

export function ContrastControl() {
  const [highContrast, setHighContrast] = useState(false)

  const handleToggleContrast = () => {
    const nextContrast = !highContrast

    setHighContrast(nextContrast)

    if (nextContrast) {
      document.documentElement.setAttribute('data-contrast', 'high')
    } else {
      document.documentElement.removeAttribute('data-contrast')
    }
  }

  return (
    <button
      type="button"
      className="accessibility-button"
      aria-pressed={highContrast}
      aria-label={
        highContrast
          ? 'Desativar alto contraste'
          : 'Ativar alto contraste'
      }
      title={
        highContrast
          ? 'Desativar alto contraste'
          : 'Ativar alto contraste'
      }
      onClick={handleToggleContrast}
    >
      C
    </button>
  )}