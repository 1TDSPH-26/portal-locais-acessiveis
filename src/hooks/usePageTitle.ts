import { useEffect } from 'react'

const NOME_PORTAL = 'Portal de Locais Acessíveis'

export default function usePageTitle(titulo: string) {
  useEffect(() => {
    document.title = `${titulo} | ${NOME_PORTAL}`
  }, [titulo])
}
