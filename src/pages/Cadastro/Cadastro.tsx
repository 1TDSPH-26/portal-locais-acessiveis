import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Categoria, Local, RecursoAcessibilidade } from '../../types/local'
import { validarCep } from '../../utils/validacoes'

type DadosFormulario = Omit<Local, 'id' | 'categoria'> & {
  categoria: Categoria | ''
}

type ErrosFormulario = Partial<Record<keyof DadosFormulario, string>>

const categorias: ReadonlyArray<{ valor: Categoria; rotulo: string }> = [
  { valor: 'restaurante', rotulo: 'Restaurante' },
  { valor: 'saude', rotulo: 'Saúde' },
  { valor: 'educacao', rotulo: 'Educação' },
  { valor: 'lazer', rotulo: 'Lazer' },
  { valor: 'servico_publico', rotulo: 'Serviço público' },
]

const recursos: ReadonlyArray<{
  valor: RecursoAcessibilidade
  rotulo: string
}> = [
  { valor: 'rampa_acesso', rotulo: 'Rampa de acesso' },
  { valor: 'banheiro_adaptado', rotulo: 'Banheiro adaptado' },
  { valor: 'piso_tatil', rotulo: 'Piso tátil' },
  { valor: 'sinalizacao_visual', rotulo: 'Sinalização visual' },
  {
    valor: 'vagas_estacionamento',
    rotulo: 'Vagas de estacionamento acessíveis',
  },
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
  const [erros, setErros] = useState<ErrosFormulario>({})

  const nomeRef = useRef<HTMLInputElement>(null)
  const categoriaRef = useRef<HTMLSelectElement>(null)
  const enderecoRef = useRef<HTMLInputElement>(null)
  const cepRef = useRef<HTMLInputElement>(null)

  function atualizarTexto(campo: 'nome' | 'endereco' | 'cep') {
    return (evento: ChangeEvent<HTMLInputElement>) => {
      setDados((atual) => ({
        ...atual,
        [campo]: evento.target.value,
      }))
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

  function validarFormulario(): ErrosFormulario {
    const novosErros: ErrosFormulario = {}

    if (!dados.nome.trim()) {
      novosErros.nome = 'Informe o nome do local.'
    }

    if (!dados.categoria) {
      novosErros.categoria = 'Selecione uma categoria.'
    }

    if (!dados.endereco.trim()) {
      novosErros.endereco = 'Informe o endereço completo do local.'
    }

    if (!dados.cep.trim()) {
      novosErros.cep = 'Informe o CEP do local.'
    } else if (!validarCep(dados.cep)) {
      novosErros.cep = 'Informe um CEP válido com 8 dígitos.'
    }

    return novosErros
  }

  function focarCampo(campo: keyof DadosFormulario) {
    const campos = {
      nome: nomeRef,
      categoria: categoriaRef,
      endereco: enderecoRef,
      cep: cepRef,
    }

    if (campo !== 'recursosAcessibilidade') {
      campos[campo].current?.focus()
    }
  }

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const novosErros = validarFormulario()
    setErros(novosErros)

    const primeiroErro = Object.keys(novosErros)[0] as
      | keyof DadosFormulario
      | undefined

    if (primeiroErro) {
      focarCampo(primeiroErro)
      return
    }

    // O envio para API está fora do escopo da Issue #28.
  }

  const classeCampo =
    'mt-1 block w-full rounded-md border border-borda-funcional bg-fundo px-3 py-2 text-texto shadow-sm outline-offset-2 focus:outline-3 focus:outline-primaria-600'

  const camposComErro = Object.entries(erros) as [
    keyof DadosFormulario,
    string,
  ][]

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-h1 font-bold text-texto">
        Cadastro de local
      </h1>

      <p className="mt-2 font-corpo text-corpo-16 text-secundaria">
        Informe os dados conhecidos sobre o local e seus recursos de
        acessibilidade.
      </p>

      <p className="mt-2 font-corpo text-corpo-14 text-secundaria">
        Os campos identificados como <strong>obrigatório</strong> devem ser
        preenchidos.
      </p>

      <form onSubmit={enviarFormulario} className="mt-8 space-y-8" noValidate>
        {camposComErro.length > 0 && (
          <div
            role="alert"
            aria-labelledby="resumo-erros-titulo"
            className="rounded-md border border-erro p-4"
          >
            <h2
              id="resumo-erros-titulo"
              className="font-display text-h3 font-bold text-texto"
            >
              Corrija os seguintes campos:
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-5">
              {camposComErro.map(([campo, mensagem]) => (
                <li key={campo}>
                  <button
                    type="button"
                    onClick={() => focarCampo(campo)}
                    className="font-corpo text-corpo-16 font-semibold text-erro underline"
                  >
                    {mensagem}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="rounded-lg border border-borda-decorativa p-4 sm:p-6">
          <legend className="px-1 font-display text-h2 font-bold text-texto">
            Identificação do local
          </legend>

          <div className="mt-4">
            <label
              htmlFor="nome"
              className="font-corpo text-label font-semibold text-texto"
            >
              Nome do local — obrigatório
            </label>

            <input
              ref={nomeRef}
              id="nome"
              name="nome"
              type="text"
              value={dados.nome}
              onChange={atualizarTexto('nome')}
              className={classeCampo}
              aria-invalid={Boolean(erros.nome)}
              aria-describedby={erros.nome ? 'erro-nome' : undefined}
            />

            {erros.nome && (
              <p
                id="erro-nome"
                className="mt-2 font-corpo text-corpo-14 font-semibold text-erro"
              >
                Erro: {erros.nome}
              </p>
            )}
          </div>

          <div className="mt-5">
            <label
              htmlFor="categoria"
              className="font-corpo text-label font-semibold text-texto"
            >
              Categoria — obrigatório
            </label>

            <select
              ref={categoriaRef}
              id="categoria"
              name="categoria"
              value={dados.categoria}
              onChange={atualizarCategoria}
              className={classeCampo}
              aria-invalid={Boolean(erros.categoria)}
              aria-describedby={
                erros.categoria ? 'erro-categoria' : undefined
              }
            >
              <option value="">Selecione uma categoria</option>

              {categorias.map(({ valor, rotulo }) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>

            {erros.categoria && (
              <p
                id="erro-categoria"
                className="mt-2 font-corpo text-corpo-14 font-semibold text-erro"
              >
                Erro: {erros.categoria}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-borda-decorativa p-4 sm:p-6">
          <legend className="px-1 font-display text-h2 font-bold text-texto">
            Localização
          </legend>

          <div className="mt-4">
            <label
              htmlFor="endereco"
              className="font-corpo text-label font-semibold text-texto"
            >
              Endereço completo — obrigatório
            </label>

            <input
              ref={enderecoRef}
              id="endereco"
              name="endereco"
              type="text"
              value={dados.endereco}
              onChange={atualizarTexto('endereco')}
              className={classeCampo}
              aria-invalid={Boolean(erros.endereco)}
              aria-describedby={erros.endereco ? 'erro-endereco' : undefined}
            />

            {erros.endereco && (
              <p
                id="erro-endereco"
                className="mt-2 font-corpo text-corpo-14 font-semibold text-erro"
              >
                Erro: {erros.endereco}
              </p>
            )}
          </div>

          <div className="mt-5 max-w-xs">
            <label
              htmlFor="cep"
              className="font-corpo text-label font-semibold text-texto"
            >
              CEP — obrigatório
            </label>

            <input
              ref={cepRef}
              id="cep"
              name="cep"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={dados.cep}
              onChange={atualizarTexto('cep')}
              className={classeCampo}
              aria-invalid={Boolean(erros.cep)}
              aria-describedby={erros.cep ? 'erro-cep' : undefined}
            />

            {erros.cep && (
              <p
                id="erro-cep"
                className="mt-2 font-corpo text-corpo-14 font-semibold text-erro"
              >
                Erro: {erros.cep}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-borda-decorativa p-4 sm:p-6">
          <legend className="px-1 font-display text-h2 font-bold text-texto">
            Recursos de acessibilidade
          </legend>

          <p className="mt-2 text-corpo-16 text-secundaria">
            Marque os recursos disponíveis no local.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recursos.map(({ valor, rotulo }) => (
              <div key={valor} className="flex items-start gap-3">
                <input
                  id={valor}
                  name="recursosAcessibilidade"
                  type="checkbox"
                  value={valor}
                  checked={dados.recursosAcessibilidade.includes(valor)}
                  onChange={alternarRecurso}
                  className="mt-1 size-4 accent-primaria-600"
                />

                <label
                  htmlFor={valor}
                  className="font-corpo text-corpo-16 text-texto"
                >
                  {rotulo}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-md bg-primaria-600 px-5 py-3 font-corpo text-botao font-bold text-white hover:bg-primaria-700 focus:outline-3 focus:outline-offset-2 focus:outline-primaria-600 sm:w-auto"
        >
          Cadastrar local
        </button>
      </form>
    </section>
  )
}