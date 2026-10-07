import { useEffect, useState } from 'react'

export function TextMinusControl() {
  const [isMinimum, setIsMinimum] = useState(() => {
    const currentSize =
      document.documentElement.getAttribute('data-font-size') || '1'

    return currentSize === '1'
  })

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
    setIsMinimum(nextSize === '1')
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
      aria-label="Reduzir tamanho do texto"
      title="Reduzir tamanho do texto"
      onClick={handleDecrease}
      disabled={isMinimum}
    >
      A-
    </button>
  )
}

