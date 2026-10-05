import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Categoria, Local, RecursoAcessibilidade } from '../../types/local'

type DadosFormulario = Omit<Local, 'id' | 'categoria'> & {
  categoria: Categoria | ''
}

const categorias: ReadonlyArray<{ valor: Categoria; rotulo: string }> = [
  { valor: 'restaurante', rotulo: 'Restaurante' },
  { valor: 'saude', rotulo: 'Saúde' },
  { valor: 'educacao', rotulo: 'Educação' },
  { valor: 'lazer', rotulo: 'Lazer' },
  { valor: 'servico_publico', rotulo: 'Serviço público' },
]

const recursos: ReadonlyArray<{ valor: RecursoAcessibilidade; rotulo: string }> = [
  { valor: 'rampa_acesso', rotulo: 'Rampa de acesso' },
  { valor: 'banheiro_adaptado', rotulo: 'Banheiro adaptado' },
  { valor: 'piso_tatil', rotulo: 'Piso tátil' },
  { valor: 'sinalizacao_visual', rotulo: 'Sinalização visual' },
  { valor: 'vagas_estacionamento', rotulo: 'Vagas de estacionamento acessíveis' },
  { valor: 'braile', rotulo: 'Informações em braile' },
  { valor: 'libras', rotulo: 'Atendimento em Libras' },
  { valor: 'elevador', rotulo: 'Elevador acessível' },
  { valor: 'balcao_acessivel', rotulo: 'Balcão acessível' },
  { valor: 'assentos_prioritarios', rotulo: 'Assentos prioritários' },
  { valor: 'espaco_tranquilo', rotulo: 'Espaço tranquilo' },
  { valor: 'cao_guia', rotulo: 'Entrada permitida para cão-guia' },
]

const dadosIniciais: DadosFormulario = {
  nome: '',
  endereco: '',
  cep: '',
  categoria: '',
  recursosAcessibilidade: [],
}

export default function Cadastro() {
  const [dados, setDados] = useState<DadosFormulario>(dadosIniciais)

  function atualizarTexto(campo: 'nome' | 'endereco' | 'cep') {
    return (evento: ChangeEvent<HTMLInputElement>) => {
      setDados((atual) => ({ ...atual, [campo]: evento.target.value }))
    }
  }

  function atualizarCategoria(evento: ChangeEvent<HTMLSelectElement>) {
    setDados((atual) => ({
      ...atual,
      categoria: evento.target.value as Categoria | '',
    }))
  }

  function alternarRecurso(evento: ChangeEvent<HTMLInputElement>) {
    const recurso = evento.target.value as RecursoAcessibilidade

    setDados((atual) => ({
      ...atual,
      recursosAcessibilidade: evento.target.checked
        ? [...atual.recursosAcessibilidade, recurso]
        : atual.recursosAcessibilidade.filter((item) => item !== recurso),
    }))
  }

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
  }

  const classeCampo =
    'mt-1 block w-full rounded-md border border-borda-funcional bg-fundo px-3.5 py-2.5 font-corpo text-corpo-16 text-texto shadow-xs outline-offset-2 transition-colors placeholder:text-secundaria/60 focus:outline-3 focus:outline-primaria-600 min-h-[44px]'

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10 md:py-12">
      <header className="space-y-2">
        <h1 className="font-display text-2xl sm:text-h1 font-bold text-texto tracking-tight break-words">
          Cadastro de local
        </h1>
        <p className="font-corpo text-corpo-14 sm:text-corpo-16 text-secundaria break-words">
          Informe os dados conhecidos sobre o local e seus recursos de acessibilidade.
        </p>
      </header>

      <form onSubmit={enviarFormulario} className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        <fieldset className="w-full min-w-0 rounded-lg border border-borda-decorativa p-4 sm:p-6 shadow-xs">
          <legend className="px-1.5 font-display text-xl sm:text-h2 font-bold text-texto leading-tight max-w-full">
            Identificação do local
          </legend>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="md:col-span-2">
              <label htmlFor="nome" className="block font-corpo text-label font-semibold text-texto leading-normal">
                Nome do local
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={dados.nome}
                onChange={atualizarTexto('nome')}
                className={classeCampo}
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="categoria" className="block font-corpo text-label font-semibold text-texto leading-normal">
                Categoria
              </label>
              <select
                id="categoria"
                name="categoria"
                value={dados.categoria}
                onChange={atualizarCategoria}
                className={classeCampo}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(({ valor, rotulo }) => (
                  <option key={valor} value={valor}>
                    {rotulo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="w-full min-w-0 rounded-lg border border-borda-decorativa p-4 sm:p-6 shadow-xs">
          <legend className="px-1.5 font-display text-xl sm:text-h2 font-bold text-texto leading-tight max-w-full">
            Localização
          </legend>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="endereco" className="block font-corpo text-label font-semibold text-texto leading-normal">
                Endereço completo
              </label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                value={dados.endereco}
                onChange={atualizarTexto('endereco')}
                className={classeCampo}
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="cep" className="block font-corpo text-label font-semibold text-texto leading-normal">
                CEP
              </label>
              <input
                id="cep"
                name="cep"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={dados.cep}
                onChange={atualizarTexto('cep')}
                className={classeCampo}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="w-full min-w-0 rounded-lg border border-borda-decorativa p-4 sm:p-6 shadow-xs">
          <legend className="px-1.5 font-display text-xl sm:text-h2 font-bold text-texto leading-tight max-w-full">
            Recursos de acessibilidade
          </legend>
          <p className="mt-2 font-corpo text-corpo-14 sm:text-corpo-16 text-secundaria break-words">
            Marque os recursos disponíveis no local.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recursos.map(({ valor, rotulo }) => (
              <div
                key={valor}
                className="group relative flex items-start gap-3 rounded-md border border-borda-decorativa/80 p-3 transition-colors hover:border-borda-funcional hover:bg-fundo-suave/40 focus-within:ring-2 focus-within:ring-primaria-600 focus-within:ring-offset-1 cursor-pointer"
              >
                <input
                  id={valor}
                  name="recursosAcessibilidade"
                  type="checkbox"
                  value={valor}
                  checked={dados.recursosAcessibilidade.includes(valor)}
                  onChange={alternarRecurso}
                  className="mt-0.5 size-5 shrink-0 rounded border-borda-funcional text-primaria-600 accent-primaria-600 cursor-pointer"
                />
                <label
                  htmlFor={valor}
                  className="flex-1 font-corpo text-corpo-14 sm:text-corpo-16 text-texto select-none cursor-pointer leading-normal break-words"
                >
                  {rotulo}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primaria-600 px-6 py-3.5 font-corpo text-botao font-bold text-white shadow-xs hover:bg-primaria-700 active:bg-primaria-800 focus:outline-3 focus:outline-offset-2 focus:outline-primaria-600 min-h-[48px] transition-colors cursor-pointer"
          >
            Cadastrar local
          </button>
        </div>
      </form>
    </section>
  )
}
