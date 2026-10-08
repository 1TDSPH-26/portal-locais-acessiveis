
import { useEffect, useState } from 'react'

export default function FontIncreaseButton() {
  const [isMaximum, setIsMaximum] = useState(() => {
    const currentSize =
      document.documentElement.getAttribute('data-font-size') || '1'

    return currentSize === '3'
  })

  const updateButtonState = () => {
    const currentSize =
      document.documentElement.getAttribute('data-font-size') || '1'

    setIsMaximum(currentSize === '3')
  }

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
    updateButtonState()
  }

  useEffect(() => {
    const html = document.documentElement

    if (!html.hasAttribute('data-font-size')) {
      html.setAttribute('data-font-size', '1')
    }

    const observer = new MutationObserver(() => {
      updateButtonState()
    })

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['data-font-size'],
    })

    return () => {
      observer.disconnect()
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

