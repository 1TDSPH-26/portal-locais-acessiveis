/** Classes Tailwind reutilizadas sem alterar os estilos originais das páginas. */
export const focoVisivelPrimario =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600'

export const focoVisivelInverso =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-texto-inverso'

// Algumas telas exigem afastamento maior do contorno (4px no Tailwind).
export const focoVisivelPrimarioOffset4 =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primaria-600'

export const focoVisivelInversoOffset4 =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-texto-inverso'

export const anelFocoPrimario =
  'focus:outline-none focus:ring-2 focus:ring-primaria-600'

export const anelFocoPrimarioComOffset =
  `${anelFocoPrimario} focus:ring-offset-2`

export const cartaoDestaque =
  'bg-fundo p-6 rounded-xl border border-borda-decorativa flex flex-col justify-between gap-4'

export const tituloCartaoDestaque =
  'font-display text-h3 font-bold text-texto'

export const botaoLinkDestaque =
  'inline-flex justify-center items-center py-2.5 px-4'

export const rotuloCampoCadastro =
  'block font-corpo text-label font-semibold text-texto leading-normal break-words'

export const campoObrigatorioCadastro =
  'font-normal text-corpo-14 text-secundaria ml-1'

export const grupoCamposCadastro =
  'w-full min-w-0 rounded-lg border border-borda-decorativa p-4 sm:p-6 shadow-xs'

export const tituloGrupoCadastro =
  'px-1.5 font-display text-xl sm:text-h2 font-bold text-texto leading-tight max-w-full'

export const mensagemErroCadastro =
  'mt-1.5 flex items-start gap-1.5 font-corpo text-corpo-14 font-medium text-erro break-words'

export const filtroAplicado =
  'rounded-full bg-fundo-suave px-3 py-1.5 text-sm font-semibold text-primaria-700'

export const botaoPaginacao =
  'min-h-11 rounded-md border border-borda-funcional px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-50'
