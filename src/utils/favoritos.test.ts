import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  alternarFavorito,
  CHAVE_FAVORITOS,
  EVENTO_FAVORITOS,
  lerIdsFavoritos,
  observarFavoritos,
} from './favoritos'

const cancelamentos: Array<() => void> = []

afterEach(() => {
  cancelamentos.splice(0).forEach((cancelar) => cancelar())
  vi.restoreAllMocks()
})

describe('Persistência e notificação dos favoritos', () => {
  it.each([null, '', '{invalido', '{}', 'null', '42'])(
    'retorna uma lista vazia para armazenamento ausente ou inválido: %s',
    (valor) => {
      if (valor !== null) localStorage.setItem(CHAVE_FAVORITOS, valor)

      expect(lerIdsFavoritos()).toEqual([])
    },
  )

  it('preserva a regra de inteiros, inclusive repetidos e IDs fora do catálogo', () => {
    const valor = '[1,1,999,0,-1,"2",2.5,null,true,{}]'
    localStorage.setItem(CHAVE_FAVORITOS, valor)

    expect(lerIdsFavoritos()).toEqual([1, 1, 999, 0, -1])
    expect(localStorage.getItem(CHAVE_FAVORITOS)).toBe(valor)
  })

  it('trata falha de leitura sem lançar erro para os componentes', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Armazenamento indisponível')
    })

    expect(lerIdsFavoritos()).toEqual([])
  })

  it('grava uma vez por operação e notifica somente depois de salvar', () => {
    const gravar = vi.spyOn(Storage.prototype, 'setItem')
    const emitir = vi.spyOn(window, 'dispatchEvent')
    const leituras: number[][] = []
    cancelamentos.push(observarFavoritos(() => leituras.push(lerIdsFavoritos())))

    expect(alternarFavorito(1)).toBe(true)
    expect(gravar).toHaveBeenCalledTimes(1)
    expect(gravar).toHaveBeenLastCalledWith(CHAVE_FAVORITOS, '[1]')
    expect(leituras).toEqual([[1]])
    expect(emitir).toHaveBeenCalledWith(expect.any(CustomEvent))
    expect(emitir.mock.calls[0][0].type).toBe(EVENTO_FAVORITOS)

    expect(alternarFavorito(1)).toBe(true)
    expect(gravar).toHaveBeenCalledTimes(2)
    expect(emitir).toHaveBeenCalledTimes(2)
    expect(leituras).toEqual([[1], []])
  })

  it('relê o armazenamento antes de alterar e remove todas as ocorrências do ID', () => {
    localStorage.setItem(CHAVE_FAVORITOS, '[1,1,2]')

    alternarFavorito(1)
    expect(lerIdsFavoritos()).toEqual([2])

    localStorage.setItem(CHAVE_FAVORITOS, '[2,3]')
    alternarFavorito(4)
    expect(lerIdsFavoritos()).toEqual([2, 3, 4])
  })

  it('não notifica nem altera os dados quando a gravação falha', () => {
    localStorage.setItem(CHAVE_FAVORITOS, '[1]')
    const atualizar = vi.fn()
    cancelamentos.push(observarFavoritos(atualizar))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Gravação bloqueada')
    })

    expect(alternarFavorito(1)).toBe(false)
    expect(lerIdsFavoritos()).toEqual([1])
    expect(atualizar).not.toHaveBeenCalled()
  })

  it('observa eventos externos da chave e de limpeza, ignorando outros dados', () => {
    const atualizar = vi.fn()
    cancelamentos.push(observarFavoritos(atualizar))

    window.dispatchEvent(new StorageEvent('storage', {
      key: 'outra-chave', storageArea: localStorage,
    }))
    window.dispatchEvent(new StorageEvent('storage', {
      key: CHAVE_FAVORITOS, storageArea: sessionStorage,
    }))
    expect(atualizar).not.toHaveBeenCalled()

    window.dispatchEvent(new StorageEvent('storage', {
      key: CHAVE_FAVORITOS, storageArea: localStorage,
    }))
    window.dispatchEvent(new StorageEvent('storage', {
      key: null, storageArea: localStorage,
    }))
    expect(atualizar).toHaveBeenCalledTimes(2)
  })

  it('cancela ambos os listeners sem afetar outras assinaturas', () => {
    const primeiro = vi.fn()
    const segundo = vi.fn()
    const cancelarPrimeiro = observarFavoritos(primeiro)
    cancelamentos.push(cancelarPrimeiro, observarFavoritos(segundo))

    cancelarPrimeiro()
    window.dispatchEvent(new CustomEvent(EVENTO_FAVORITOS))
    window.dispatchEvent(new StorageEvent('storage', {
      key: CHAVE_FAVORITOS, storageArea: localStorage,
    }))

    expect(primeiro).not.toHaveBeenCalled()
    expect(segundo).toHaveBeenCalledTimes(2)
  })
})
