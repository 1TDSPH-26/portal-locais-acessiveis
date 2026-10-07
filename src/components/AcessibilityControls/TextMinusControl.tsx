
import { useEffect, useState } from 'react'

export function TextMinusControl() {
  const [isMinimum, setIsMinimum] = useState(() => {
    const currentSize =
      document.documentElement.getAttribute('data-font-size') || '1'

    return currentSize === '1'
  })

  const updateButtonState = () => {
    const currentSize =
      document.documentElement.getAttribute('data-font-size') || '1'

    setIsMinimum(currentSize === '1')
  }

  const handleDecrease = () => {
    const html = document.documentElement
    const currentSize = html.getAttribute('data-font-size') || '1'

    const nextSize =
      currentSize === '3'
        ? '2'
        : currentSize === '2'
          ? '1'
          : '1'

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
      aria-label="Reduzir tamanho do texto"
      title="Reduzir tamanho do texto"
      onClick={handleDecrease}
      disabled={isMinimum}
    >
      A-
    </button>
  )
}

