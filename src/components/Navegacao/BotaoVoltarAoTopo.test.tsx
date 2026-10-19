import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import BotaoVoltarAoTopo from './BotaoVoltarAoTopo'

describe('BotaoVoltarAoTopo', () => {
  it('é um botão com rótulo acessível explícito', () => {
    const html = renderToStaticMarkup(<BotaoVoltarAoTopo />)

    expect(html).toContain('<button')
    expect(html).toContain('type="button"')
    expect(html).toContain('aria-label="Voltar ao topo da página"')
  })

  it('começa oculto, fora da navegação por teclado, enquanto a página está no topo', () => {
    const html = renderToStaticMarkup(<BotaoVoltarAoTopo />)

    expect(html).toContain('invisible')
    expect(html).toContain('opacity-0')
    expect(html).not.toContain('opacity-100')
  })

  it('não expõe o ícone para leitores de tela', () => {
    const html = renderToStaticMarkup(<BotaoVoltarAoTopo />)

    expect(html).toContain('<svg')
    expect(html).toContain('aria-hidden="true"')
  })
})
