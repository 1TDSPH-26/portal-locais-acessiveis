
import { useState } from 'react'

export function ContrastControl() {
  const [highContrast, setHighContrast] = useState(false)

  const handleToggleContrast = () => {
    const nextContrast = !highContrast

    setHighContrast(nextContrast)

    document.documentElement.classList.toggle(
      'high-contrast',
      nextContrast,
    )
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
  )
}

