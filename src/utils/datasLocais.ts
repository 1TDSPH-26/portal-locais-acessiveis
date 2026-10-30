/** Exige instante ISO com fuso explícito, sem depender do navegador do visitante. */
export function formatarAtualizacao(valor?: string | null): string | null {
  if (!valor || valor.startsWith('0000') ||
    !/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-]([01]\d|2[0-3]):[0-5]\d)$/.test(valor)) return null

  const data = new Date(valor)
  const calendario = new Date(`${valor.slice(0, 10)}T00:00:00Z`)
  if (!Number.isFinite(data.getTime()) || !Number.isFinite(calendario.getTime()) ||
    calendario.toISOString().slice(0, 10) !== valor.slice(0, 10)) return null

  const partes = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(data)
  const obter = (tipo: string) => partes.find((parte) => parte.type === tipo)?.value
  return `${obter('day')}/${obter('month')}/${obter('year')} às ${obter('hour')}:${obter('minute')}`
}

/** Um mês civil não é um instante e não deve sofrer conversão de fuso. */
export function formatarConferencia(valor?: string | null): string | null {
  if (!valor || !/^\d{4}-(0[1-9]|1[0-2])$/.test(valor) || valor.startsWith('0000')) return null
  return `${valor.slice(5, 7)}/${valor.slice(0, 4)}`
}
