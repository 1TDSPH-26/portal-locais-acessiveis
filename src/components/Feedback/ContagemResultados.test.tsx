import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ContagemResultados from './ContagemResultados'

describe('ContagemResultados', () => {
  it.each([
    [0, 'Nenhum local encontrado.'],
    [1, '1 local encontrado.'],
    [8, '8 locais encontrados.'],
  ])('apresenta o total %i com texto compreensível', (total, mensagem) => {
    const html = renderToStaticMarkup(
      <ContagemResultados total={total} />,
    )

    expect(html).toContain(`>${mensagem}</p>`)
  })

  it('mantém uma região de anúncio vazia enquanto não há resultado confirmado', () => {
    const html = renderToStaticMarkup(
      <ContagemResultados total={null} />,
    )

    expect(html).toContain('role="status"')
    expect(html).toMatch(/><\/p>$/)
    expect(html).not.toContain('Nenhum local encontrado')
  })

  it('configura o anúncio completo sem interromper a leitura', () => {
    const html = renderToStaticMarkup(
      <ContagemResultados total={3} />,
    )

    expect(html).toContain('role="status"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('aria-atomic="true"')
    expect(html).not.toContain('tabindex')
  })
})