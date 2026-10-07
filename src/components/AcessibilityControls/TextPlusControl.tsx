
import { useEffect, useState } from 'react'

export function TextPlusControl() {
  const [isMaximum, setIsMaximum] = useState(() => {
    const currentSize =
      document.documentElement.getAttribute('data-font-size') || '1'

    return currentSize === '3'
  })

  const handleIncrease = () => {
    const html = document.documentElement
    const currentSize = html.getAttribute('data-font-size') || '1'

    const nextSize =
      currentSize === '1'
        ? '2'
        : currentSize === '2'
          ? '3'
          : '3'

    html.setAttribute('data-font-size', nextSize)
    setIsMaximum(nextSize === '3')
  }

  useEffect(() => {
    const html = document.documentElement

    if (!html.hasAttribute('data-font-size')) {
      html.setAttribute('data-font-size', '1')
    }
  }, [])

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
  )
}

