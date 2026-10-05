import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Categoria, Local, RecursoAcessibilidade } from '../../types/local'

type DadosFormulario = Omit<Local, 'id' | 'categoria'> & {
  categoria: Categoria | ''
}

type CampoValidavel = 'nome' | 'categoria' | 'endereco' | 'cep'
type ErrosFormulario = Partial<Record<CampoValidavel, string>>

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
  const [erros, setErros] = useState<ErrosFormulario>({})
  const [sucesso, setSucesso] = useState(false)
  const [ultimoLocalCadastrado, setUltimoLocalCadastrado] = useState('')

  const nomeRef = useRef<HTMLInputElement>(null)
  const categoriaRef = useRef<HTMLSelectElement>(null)
  const enderecoRef = useRef<HTMLInputElement>(null)
  const cepRef = useRef<HTMLInputElement>(null)
  const resumoErrosRef = useRef<HTMLDivElement>(null)
  const sucessoRef = useRef<HTMLDivElement>(null)

  const camposRefs: Record<CampoValidavel, React.RefObject<HTMLInputElement | HTMLSelectElement | null>> = {
    nome: nomeRef,
    categoria: categoriaRef,
    endereco: enderecoRef,
    cep: cepRef,
  }

  function focarCampo(campo: CampoValidavel) {
    camposRefs[campo].current?.focus()
  }

  function atualizarTexto(campo: 'nome' | 'endereco' | 'cep') {
    return (evento: ChangeEvent<HTMLInputElement>) => {
      const valor = evento.target.value
      setDados((atual) => ({ ...atual, [campo]: valor }))
      if (erros[campo]) {
        setErros((atual) => {
          const proximos = { ...atual }
          delete proximos[campo]
          return proximos
        })
      }
    }
  }

  function atualizarCategoria(evento: ChangeEvent<HTMLSelectElement>) {
    const valor = evento.target.value as Categoria | ''
    setDados((atual) => ({ ...atual, categoria: valor }))
    if (erros.categoria) {
      setErros((atual) => {
        const proximos = { ...atual }
        delete proximos.categoria
        return proximos
      })
    }
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

  function validarCampos(): ErrosFormulario {
    const novosErros: ErrosFormulario = {}

    if (!dados.nome.trim()) {
      novosErros.nome = 'O nome do local é obrigatório.'
    } else if (dados.nome.trim().length < 3) {
      novosErros.nome = 'O nome deve conter pelo menos 3 caracteres.'
    }

    if (!dados.categoria) {
      novosErros.categoria = 'Selecione uma categoria para o local.'
    }

    if (!dados.endereco.trim()) {
      novosErros.endereco = 'O endereço completo é obrigatório.'
    } else if (dados.endereco.trim().length < 5) {
      novosErros.endereco = 'O endereço deve conter pelo menos 5 caracteres.'
    }

    const cepLimpo = dados.cep.replace(/\D/g, '')
    if (!dados.cep.trim()) {
      novosErros.cep = 'O CEP é obrigatório.'
    } else if (cepLimpo.length !== 8) {
      novosErros.cep = 'Informe um CEP válido com 8 dígitos (ex: 01310-100).'
    }

    return novosErros
  }

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setSucesso(false)

    const novosErros = validarCampos()
    setErros(novosErros)

    const camposComErro = Object.keys(novosErros) as CampoValidavel[]

    if (camposComErro.length > 0) {
      setTimeout(() => {
        if (resumoErrosRef.current) {
          resumoErrosRef.current.focus()
        } else {
          focarCampo(camposComErro[0])
        }
      }, 50)
      return
    }

    setUltimoLocalCadastrado(dados.nome.trim())
    setSucesso(true)
    setDados(dadosIniciais)

    setTimeout(() => {
      sucessoRef.current?.focus()
    }, 50)
  }

  function reiniciarFormulario() {
    setDados(dadosIniciais)
    setErros({})
    setSucesso(false)
    setTimeout(() => {
      nomeRef.current?.focus()
    }, 50)
  }

  const classeCampoBase =
    'mt-1 block w-full rounded-md bg-fundo px-3.5 py-2.5 font-corpo text-corpo-16 text-texto shadow-xs outline-offset-2 transition-colors placeholder:text-secundaria/60 focus:outline-3 min-h-[44px]'

  function classeCampo(comErro: boolean) {
    return `${classeCampoBase} border ${
      comErro
        ? 'border-erro focus:outline-erro ring-1 ring-erro/30'
        : 'border-borda-funcional focus:outline-primaria-600'
    }`
  }

  const listaErros = Object.entries(erros) as [CampoValidavel, string][]

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10 md:py-12">
      <header className="space-y-2">
        <h1 className="font-display text-2xl sm:text-h1 font-bold text-texto tracking-tight break-words">
          Cadastro de local
        </h1>
        <p className="font-corpo text-corpo-14 sm:text-corpo-16 text-secundaria break-words">
          Informe os dados conhecidos sobre o local e seus recursos de acessibilidade.
        </p>
        <p className="font-corpo text-corpo-14 text-secundaria break-words">
          Campos identificados com <span className="font-semibold text-texto">(obrigatório)</span> devem ser preenchidos.
        </p>
      </header>

      {sucesso && (
        <div
          ref={sucessoRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-6 rounded-lg border-2 border-sucesso bg-green-50/80 p-4 sm:p-5 text-texto outline-none focus:ring-2 focus:ring-sucesso focus:ring-offset-2"
        >
          <div className="flex items-start gap-3">
            <svg
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-sucesso"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-corpo-16 sm:text-corpo-18 font-bold text-sucesso break-words">
                Local cadastrado com sucesso!
              </h2>
              <p className="mt-1 font-corpo text-corpo-14 text-secundaria break-words">
                {ultimoLocalCadastrado
                  ? `O estabelecimento "${ultimoLocalCadastrado}" foi registrado com sucesso.`
                  : 'As informações do local foram registradas.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={reiniciarFormulario}
                  className="inline-flex items-center justify-center rounded-md bg-sucesso px-4 py-2 font-corpo text-corpo-14 font-semibold text-white shadow-xs hover:bg-green-700 focus:outline-2 focus:outline-offset-2 focus:outline-sucesso min-h-[40px] cursor-pointer"
                >
                  Cadastrar outro local
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {listaErros.length > 0 && (
        <div
          ref={resumoErrosRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="resumo-erros-titulo"
          className="mt-6 rounded-lg border-2 border-erro bg-red-50/80 p-4 sm:p-5 text-texto outline-none focus:ring-2 focus:ring-erro focus:ring-offset-2"
        >
          <div className="flex items-start gap-3">
            <svg
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-erro"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <h2
                id="resumo-erros-titulo"
                className="font-display text-corpo-16 sm:text-corpo-18 font-bold text-erro break-words"
              >
                Corrija os erros encontrados no formulário:
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 font-corpo text-corpo-14">
                {listaErros.map(([campo, mensagem]) => (
                  <li key={campo} className="break-words">
                    <button
                      type="button"
                      onClick={() => focarCampo(campo)}
                      className="text-left font-medium text-erro underline hover:text-red-800 focus:outline-2 focus:outline-erro cursor-pointer"
                    >
                      {mensagem}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={enviarFormulario} noValidate className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        <fieldset className="w-full min-w-0 rounded-lg border border-borda-decorativa p-4 sm:p-6 shadow-xs">
          <legend className="px-1.5 font-display text-xl sm:text-h2 font-bold text-texto leading-tight max-w-full">
            Identificação do local
          </legend>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="md:col-span-2">
              <label htmlFor="nome" className="block font-corpo text-label font-semibold text-texto leading-normal break-words">
                Nome do local <span className="font-normal text-corpo-14 text-secundaria ml-1" aria-hidden="true">(obrigatório)</span>
              </label>
              <input
                ref={nomeRef}
                id="nome"
                name="nome"
                type="text"
                value={dados.nome}
                onChange={atualizarTexto('nome')}
                aria-invalid={Boolean(erros.nome)}
                aria-describedby={erros.nome ? 'erro-nome' : undefined}
                className={classeCampo(Boolean(erros.nome))}
              />
              {erros.nome && (
                <p id="erro-nome" className="mt-1.5 flex items-start gap-1.5 font-corpo text-corpo-14 font-medium text-erro break-words" role="alert">
                  <span aria-hidden="true" className="shrink-0 font-bold">•</span>
                  <span>{erros.nome}</span>
                </p>
              )}
            </div>

            <div className="md:col-span-1">
              <label htmlFor="categoria" className="block font-corpo text-label font-semibold text-texto leading-normal break-words">
                Categoria <span className="font-normal text-corpo-14 text-secundaria ml-1" aria-hidden="true">(obrigatório)</span>
              </label>
              <select
                ref={categoriaRef}
                id="categoria"
                name="categoria"
                value={dados.categoria}
                onChange={atualizarCategoria}
                aria-invalid={Boolean(erros.categoria)}
                aria-describedby={erros.categoria ? 'erro-categoria' : undefined}
                className={classeCampo(Boolean(erros.categoria))}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(({ valor, rotulo }) => (
                  <option key={valor} value={valor}>
                    {rotulo}
                  </option>
                ))}
              </select>
              {erros.categoria && (
                <p id="erro-categoria" className="mt-1.5 flex items-start gap-1.5 font-corpo text-corpo-14 font-medium text-erro break-words" role="alert">
                  <span aria-hidden="true" className="shrink-0 font-bold">•</span>
                  <span>{erros.categoria}</span>
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="w-full min-w-0 rounded-lg border border-borda-decorativa p-4 sm:p-6 shadow-xs">
          <legend className="px-1.5 font-display text-xl sm:text-h2 font-bold text-texto leading-tight max-w-full">
            Localização
          </legend>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="endereco" className="block font-corpo text-label font-semibold text-texto leading-normal break-words">
                Endereço completo <span className="font-normal text-corpo-14 text-secundaria ml-1" aria-hidden="true">(obrigatório)</span>
              </label>
              <input
                ref={enderecoRef}
                id="endereco"
                name="endereco"
                type="text"
                value={dados.endereco}
                onChange={atualizarTexto('endereco')}
                aria-invalid={Boolean(erros.endereco)}
                aria-describedby={erros.endereco ? 'erro-endereco' : undefined}
                className={classeCampo(Boolean(erros.endereco))}
              />
              {erros.endereco && (
                <p id="erro-endereco" className="mt-1.5 flex items-start gap-1.5 font-corpo text-corpo-14 font-medium text-erro break-words" role="alert">
                  <span aria-hidden="true" className="shrink-0 font-bold">•</span>
                  <span>{erros.endereco}</span>
                </p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="cep" className="block font-corpo text-label font-semibold text-texto leading-normal break-words">
                CEP <span className="font-normal text-corpo-14 text-secundaria ml-1" aria-hidden="true">(obrigatório)</span>
              </label>
              <input
                ref={cepRef}
                id="cep"
                name="cep"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={dados.cep}
                onChange={atualizarTexto('cep')}
                aria-invalid={Boolean(erros.cep)}
                aria-describedby={[erros.cep ? 'erro-cep' : null, 'ajuda-cep'].filter(Boolean).join(' ') || undefined}
                className={classeCampo(Boolean(erros.cep))}
              />
              <p id="ajuda-cep" className="mt-1 text-legenda sm:text-corpo-14 text-secundaria break-words">
                Ex: 01310-100 ou 8 dígitos
              </p>
              {erros.cep && (
                <p id="erro-cep" className="mt-1.5 flex items-start gap-1.5 font-corpo text-corpo-14 font-medium text-erro break-words" role="alert">
                  <span aria-hidden="true" className="shrink-0 font-bold">•</span>
                  <span>{erros.cep}</span>
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="w-full min-w-0 rounded-lg border border-borda-decorativa p-4 sm:p-6 shadow-xs">
          <legend className="px-1.5 font-display text-xl sm:text-h2 font-bold text-texto leading-tight max-w-full">
            Recursos de acessibilidade
          </legend>
          <p id="ajuda-recursos" className="mt-2 font-corpo text-corpo-14 sm:text-corpo-16 text-secundaria break-words">
            Marque os recursos disponíveis no local para orientar os visitantes.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-describedby="ajuda-recursos">
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
