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

  const classeCampo = 'mt-1 block w-full rounded-md border border-borda-funcional bg-fundo px-3 py-2 text-texto shadow-sm outline-offset-2 focus:outline-3 focus:outline-primaria-600'

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-h1 font-bold text-texto">Cadastro de local</h1>
      <p className="mt-2 font-corpo text-corpo-16 text-secundaria">
        Informe os dados conhecidos sobre o local e seus recursos de acessibilidade.
      </p>

      <form onSubmit={enviarFormulario} className="mt-8 space-y-8">
        <fieldset className="rounded-lg border border-borda-decorativa p-4 sm:p-6">
          <legend className="px-1 font-display text-h2 font-bold text-texto">Identificação do local</legend>

          <div className="mt-4">
            <label htmlFor="nome" className="font-corpo text-label font-semibold text-texto">Nome do local</label>
            <input id="nome" name="nome" type="text" value={dados.nome} onChange={atualizarTexto('nome')} className={classeCampo} />
          </div>

          <div className="mt-5">
            <label htmlFor="categoria" className="font-corpo text-label font-semibold text-texto">Categoria</label>
            <select id="categoria" name="categoria" value={dados.categoria} onChange={atualizarCategoria} className={classeCampo}>
              <option value="">Selecione uma categoria</option>
              {categorias.map(({ valor, rotulo }) => <option key={valor} value={valor}>{rotulo}</option>)}
            </select>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-borda-decorativa p-4 sm:p-6">
          <legend className="px-1 font-display text-h2 font-bold text-texto">Localização</legend>

          <div className="mt-4">
            <label htmlFor="endereco" className="font-corpo text-label font-semibold text-texto">Endereço completo</label>
            <input id="endereco" name="endereco" type="text" value={dados.endereco} onChange={atualizarTexto('endereco')} className={classeCampo} />
          </div>

          <div className="mt-5 max-w-xs">
            <label htmlFor="cep" className="font-corpo text-label font-semibold text-texto">CEP</label>
            <input id="cep" name="cep" type="text" inputMode="numeric" autoComplete="postal-code" value={dados.cep} onChange={atualizarTexto('cep')} className={classeCampo} />
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-borda-decorativa p-4 sm:p-6">
          <legend className="px-1 font-display text-h2 font-bold text-texto">Recursos de acessibilidade</legend>
          <p className="mt-2 text-corpo-16 text-secundaria">Marque os recursos disponíveis no local.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recursos.map(({ valor, rotulo }) => (
              <div key={valor} className="flex items-start gap-3">
                <input id={valor} name="recursosAcessibilidade" type="checkbox" value={valor} checked={dados.recursosAcessibilidade.includes(valor)} onChange={alternarRecurso} className="mt-1 size-4 accent-primaria-600" />
                <label htmlFor={valor} className="font-corpo text-corpo-16 text-texto">{rotulo}</label>
              </div>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="w-full rounded-md bg-primaria-600 px-5 py-3 font-corpo text-botao font-bold text-white hover:bg-primaria-700 focus:outline-3 focus:outline-offset-2 focus:outline-primaria-600 sm:w-auto">
          Cadastrar local
        </button>
      </form>
    </section>
  )
}
