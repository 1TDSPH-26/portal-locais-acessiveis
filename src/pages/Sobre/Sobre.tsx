import { Link } from 'react-router'

const recursos = [
  { titulo: 'Informações verificadas', icone: 'verificacao', descricao: 'Cada recurso listado foi conferido presencialmente por uma dupla da equipe e a ficha do local mostra o mês da última verificação.' },
  { titulo: 'Busca por recurso', icone: 'busca', descricao: 'Procure pelo nome do local, pelo bairro ou por um recurso específico, como rampa, piso tátil, elevador ou intérprete de Libras.' },
  { titulo: 'Descrição em texto', icone: 'texto', descricao: 'Nenhuma informação depende só de ícone ou de cor. Todo recurso aparece com rótulo escrito, legível por leitores de tela.' },
]

const etapas = [
  { titulo: 'Indicação', descricao: 'O local entra na fila por indicação de quem usa o portal, de organizações parceiras ou de buscas da própria equipe.' },
  { titulo: 'Visita', descricao: 'Uma dupla percorre o trajeto completo: chegada, entrada, circulação interna, banheiro e balcão de atendimento.' },
  { titulo: 'Registro', descricao: 'Cada recurso vira uma frase descritiva, não uma nota ou estrela. O que a dupla não conseguiu conferir fica de fora da ficha.' },
  { titulo: 'Data de verificação', descricao: 'A ficha recebe o mês da visita para que você saiba quando as informações foram verificadas pela equipe.' },
]

const compromissos = [
  { titulo: 'Contraste medido', descricao: 'Texto e fundo devem ter contraste suficiente para uma leitura confortável.' },
  { titulo: 'Alvos de 48px', descricao: 'Botões e campos devem ter uma área de interação de pelo menos 48px de altura.' },
  { titulo: 'Teclado primeiro', descricao: 'A navegação deve funcionar pelo teclado, com ordem lógica e foco visível.' },
  { titulo: 'Cor nunca sozinha', descricao: 'Erros, sucesso e recursos do local devem sempre trazer uma mensagem em texto.' },
  { titulo: 'Ícone com rótulo', descricao: 'Nenhum ícone é o único portador de informação em qualquer tela.' },
  { titulo: 'Espaçamento de texto', descricao: 'O texto deve permitir ajustes de espaçamento e ampliação sem sobreposição.' },
]

function IconeRecurso({ tipo }: { tipo: string }) {
  return (
    <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primaria-600">
      {tipo === 'verificacao' && <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>}
      {tipo === 'busca' && <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></>}
      {tipo === 'texto' && <path d="M5 6h14M5 10h14M5 14h10M5 18h7" />}
    </svg>
  )
}

const tituloSecao = 'font-display text-h3 font-bold leading-snug'

export default function Sobre() {
  return (
    <article className="bg-fundo font-corpo text-corpo-16 leading-relaxed text-texto" aria-labelledby="sobre-titulo">
      <header className="bg-primaria-600 text-fundo">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-12">
          <nav aria-label="Caminho de navegação" className="mb-6 text-corpo-14">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="inline-flex min-h-12 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fundo">Início</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Sobre</li>
            </ol>
          </nav>
          <h1 id="sobre-titulo" className="font-display text-h1 font-bold leading-tight sm:text-display">Sobre o Lugares Acessíveis</h1>
          <p className="mt-4 max-w-2xl">
            Um portal para saber, antes de sair de casa, o que um lugar oferece em
            entrada, circulação, banheiro e atendimento. Informação descrita em
            texto, recurso por recurso, com data de verificação.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-6 py-12 sm:space-y-14 sm:px-10">
        <section aria-labelledby="sobre-proposito" className="grid gap-5 md:grid-cols-3 md:gap-10">
          <h2 id="sobre-proposito" className={tituloSecao}>Por que este portal existe</h2>
          <div className="space-y-4 text-secundaria md:col-span-2">
            <p>
              Hoje, descobrir se um lugar tem rampa, elevador ou banheiro adaptado
              depende de sorte: uma foto antiga, um telefonema, um comentário solto
              em rede social. Quem usa cadeira de rodas, empurra carrinho de bebê,
              enxerga pouco ou se comunica em Libras precisa decidir antes de sair
              — e muitas vezes descobre o degrau só na porta.
            </p>
            <p>
              O Lugares Acessíveis reúne essa informação em um só lugar. A proposta
              não é carimbar um local como acessível ou não acessível, e sim
              descrever o que existe, em texto, para que cada pessoa decida o que
              atende às suas necessidades.
            </p>
          </div>
        </section>

        <section aria-labelledby="sobre-recursos">
          <h2 id="sobre-recursos" className={tituloSecao}>O que você encontra aqui</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {recursos.map((recurso) => (
              <li key={recurso.titulo} className="rounded-md border border-borda-decorativa p-6">
                <IconeRecurso tipo={recurso.icone} />
                <h3 className="mt-4 font-display text-corpo-18 font-bold">{recurso.titulo}</h3>
                <p className="mt-3 text-corpo-14 text-secundaria">{recurso.descricao}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sobre-verificacao">
          <h2 id="sobre-verificacao" className={tituloSecao}>Como verificamos as informações</h2>
          <ol className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {etapas.map((etapa, indice) => (
              <li key={etapa.titulo} className="flex items-start gap-4">
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primaria-600 text-corpo-14 font-bold text-fundo">{indice + 1}</span>
                <div>
                  <h3 className="font-display text-corpo-18 font-bold">{etapa.titulo}</h3>
                  <p className="mt-2 text-corpo-14 text-secundaria">{etapa.descricao}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="sobre-acessibilidade" className="rounded-md border border-borda-decorativa bg-fundo-suave p-6 sm:p-8">
          <h2 id="sobre-acessibilidade" className={tituloSecao}>Nosso compromisso com a acessibilidade</h2>
          <p className="mt-4 text-corpo-14 text-secundaria">
            A acessibilidade orienta o desenvolvimento do portal. Estes são os
            compromissos que guiam a construção e a revisão das telas:
          </p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {compromissos.map((compromisso) => (
              <li key={compromisso.titulo}>
                <h3 className="font-display text-corpo-16 font-bold">{compromisso.titulo}</h3>
                <p className="mt-2 text-corpo-14 text-secundaria">{compromisso.descricao}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sobre-equipe" className="grid gap-5 md:grid-cols-3 md:gap-10">
          <h2 id="sobre-equipe" className={tituloSecao}>Quem faz</h2>
          <div className="space-y-5 md:col-span-2">
            <p>
              O Lugares Acessíveis é um projeto acadêmico desenvolvido como parte
              do Challenge da FIAP. Design, conteúdo e verificação em campo são
              feitos pela própria equipe.
            </p>
            <dl className="grid gap-5 rounded-md border border-borda-decorativa p-5 sm:grid-cols-2">
              <div>
                <dt className="text-legenda text-secundaria">Turma</dt>
                <dd className="mt-1 font-bold">1TDSPH-26</dd>
              </div>
              <div>
                <dt className="text-legenda text-secundaria">Instituição</dt>
                <dd className="mt-1 font-bold">FIAP</dd>
              </div>
            </dl>
          </div>
        </section>

        <section aria-labelledby="sobre-contato" className="flex flex-col items-start gap-6 rounded-md bg-primaria-600 p-6 text-fundo sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 id="sobre-contato" className={tituloSecao}>Encontrou uma informação desatualizada?</h2>
            <p className="mt-3 text-corpo-14">
              Se um recurso mudou ou deixou de existir, avise a equipe pelo
              repositório do projeto. Sua contribuição ajuda a manter as
              informações atualizadas.
            </p>
          </div>
          <a href="" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-sm border border-fundo bg-fundo px-5 py-3 text-center text-corpo-14 font-bold text-primaria-700 hover:bg-fundo-suave focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fundo">
            Falar com a equipe
          </a>
        </section>
      </div>
    </article>
  )
}
