import { useCallback, useEffect, useState } from 'react'
import { obterMensagemUsuario } from '../services/falha-servico'

type EstadoConsulta<T> =
  | { status: 'carregando' }
  | { status: 'sucesso'; dados: T }
  | { status: 'erro'; mensagem: string }

/**
 * Executa uma consulta da camada de serviço e expõe o estado da tela
 * (carregando, sucesso ou erro) e uma função para tentar novamente.
 * A consulta deve ser estável (useCallback) para não repetir a cada render.
 */
export function useConsulta<T>(consulta: () => Promise<T>) {
  const [estado, setEstado] = useState<EstadoConsulta<T>>({
    status: 'carregando',
  })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    consulta()
      .then((dados) => {
        if (ativo) setEstado({ status: 'sucesso', dados })
      })
      .catch((erro: unknown) => {
        if (ativo) {
          setEstado({ status: 'erro', mensagem: obterMensagemUsuario(erro) })
        }
      })

    return () => {
      ativo = false
    }
  }, [consulta, tentativa])

  const tentarNovamente = useCallback(() => {
    setEstado({ status: 'carregando' })
    setTentativa((valor) => valor + 1)
  }, [])

  return { estado, tentarNovamente }
}
