export default function Sobre() {
  const recursos = [
    {
      icone: '✓',
      titulo: 'Informações verificadas',
      descricao:
        'Cada recurso listado foi conferido presencialmente por uma dupla da equipe e a ficha do local mostra o mês da última verificação.',
    },
    {
      icone: '⌕',
      titulo: 'Busca por recurso',
      descricao:
        'Procure pelo nome do local, pelo bairro ou por um recurso específico, como rampa, piso tátil, elevador ou intérprete de Libras.',
    },
    {
      icone: '☰',
      titulo: 'Descrição em texto',
      descricao:
        'Nenhuma informação depende só de ícone ou de cor. Todo recurso aparece com rótulo escrito, legível por leitor de tela.',
    },
  ]

  const verificacao = [
    {
      numero: '1',
      titulo: 'Indicação',
      descricao:
        'O local entra na fila por indicação de quem usa o portal, de organizações parceiras ou da busca da própria equipe.',
    },
    {
      numero: '2',
      titulo: 'Visita',
      descricao:
        'Uma dupla percorre o trajeto completo: chegada, entrada, circulação interna, banheiro e balcão de atendimento.',
    },
    {
      numero: '3',
      titulo: 'Registro',
      descricao:
        'Cada recurso vira uma frase descritiva, não uma nota ou estrela. O que a dupla não conseguiu conferir fica de fora da ficha.',
    },
    {
      numero: '4',
      titulo: 'Data de verificação',
      descricao:
        'A ficha recebe o mês da visita e volta para a fila de revisão.',
    },
  ]

  const acessibilidade = [
    {
      titulo: 'Contraste medido',
      descricao:
        'Todos os pares de cor foram medidos. O menor valor em uso é 4,76:1.',
    },
    {
      titulo: 'Alvos de 48px',
      descricao:
        'Botões e campos têm 48px de altura, acima do mínimo da norma.',
    },
    {
      titulo: 'Teclado primeiro',
      descricao:
        'Skip link como primeiro item da tabulação e anel de foco duplo visível.',
    },
    {
      titulo: 'Cor nunca sozinha',
      descricao:
        'Erro, sucesso e recursos do card sempre trazem mensagem em texto.',
    },
    {
      titulo: 'Ícone com rótulo',
      descricao:
        'Nenhum ícone é o único portador de informação em qualquer tela.',
    },
    {
      titulo: 'Espaçamento de texto',
      descricao:
        'Entrelinha de 160% no corpo; o layout tolera aumento sem sobreposição.',
    },
  ]

  return (
    <main id="conteudo-principal" className="bg-fundo text-texto">
      <section className="bg-primaria-700 text-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-10 md:py-14">
          <nav
            aria-label="Navegação estrutural"
            className="mb-5 text-sm text-white/80"
          >
            <a href="/" className="underline">
              Início
            </a>
            <span aria-hidden="true"> / </span>
            <span>Sobre</span>
          </nav>

          <h1 className="font-display text-h1 font-bold">
            Sobre o Lugares Acessíveis
          </h1>

          <p className="mt-4 max-w-2xl font-corpo text-corpo-16 leading-relaxed">
            Um portal para saber, antes de sair de casa, o que um lugar oferece
            em entrada, circulação, banheiro e atendimento. Informação descrita
            em texto, recurso por recurso, com data de verificação.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 md:px-10 md:py-14">
        <section
          aria-labelledby="porque-titulo"
          className="grid gap-5 md:grid-cols-[1fr_2fr] md:gap-12"
        >
          <h2 id="porque-titulo" className="font-display text-h2 font-bold">
            Por que este portal existe
          </h2>

          <div className="space-y-4 font-corpo text-corpo-16 leading-relaxed">
            <p>
              Hoje, descobrir se um lugar tem rampa, elevador ou banheiro
              adaptado depende de sorte: uma foto antiga, um telefonema, um
              comentário solto em rede social. Quem usa cadeira de rodas,
              empurra carrinho de bebê, enxerga pouco ou se comunica em Libras
              precisa decidir antes de sair — e muitas vezes descobre o degrau
              só na porta.
            </p>

            <p className="text-secundaria">
              O Lugares Acessíveis reúne essa informação em um só lugar. A
              proposta não é carimbar um local como acessível ou não acessível,
              e sim descrever o que existe, em texto, para que cada pessoa
              decida o que atende à sua necessidade.
            </p>
          </div>
        </section>

        <section aria-labelledby="recursos-titulo" className="mt-14">
          <h2 id="recursos-titulo" className="font-display text-h2 font-bold">
            O que você encontra aqui
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {recursos.map((recurso) => (
              <article
                key={recurso.titulo}
                className="rounded-md border border-borda-decorativa p-6"
              >
                <span
                  aria-hidden="true"
                  className="text-xl font-bold text-primaria-600"
                >
                  {recurso.icone}
                </span>

                <h3 className="mt-4 font-display text-h3 font-bold">
                  {recurso.titulo}
                </h3>

                <p className="mt-3 font-corpo text-corpo-14 leading-relaxed text-secundaria">
                  {recurso.descricao}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="verificacao-titulo" className="mt-14">
          <h2
            id="verificacao-titulo"
            className="font-display text-h2 font-bold"
          >
            Como verificamos as informações
          </h2>

          <ol className="mt-6 grid gap-6 md:grid-cols-2 md:gap-x-16">
            {verificacao.map((etapa) => (
              <li key={etapa.numero} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primaria-600 font-bold text-white"
                >
                  {etapa.numero}
                </span>

                <div>
                  <h3 className="font-display text-h3 font-bold">
                    {etapa.titulo}
                  </h3>

                  <p className="mt-1 font-corpo text-corpo-14 leading-relaxed text-secundaria">
                    {etapa.descricao}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="acessibilidade-titulo"
          className="mt-14 rounded-lg bg-fundo-suave p-6 md:p-10"
        >
          <h2
            id="acessibilidade-titulo"
            className="font-display text-h2 font-bold"
          >
            Nosso compromisso com a acessibilidade
          </h2>

          <p className="mt-4 max-w-4xl font-corpo text-corpo-16 leading-relaxed">
            O portal segue a WCAG 2.2 no nível AA no modo padrão e busca o nível
            AAA no modo de alto contraste. Estes são os pontos verificados em
            todas as telas.
          </p>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {acessibilidade.map((item) => (
              <div key={item.titulo}>
                <h3 className="font-display text-corpo-16 font-bold">
                  {item.titulo}
                </h3>

                <p className="mt-1 font-corpo text-corpo-14 leading-relaxed text-secundaria">
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>

          <a
            href="https://www.w3.org/TR/WCAG22/"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-block font-corpo text-corpo-14 font-semibold text-primaria-700 underline"
          >
            Ver o documento de conformidade WCAG 2.2
          </a>
        </section>

        <section
          aria-labelledby="equipe-titulo"
          className="mt-14 grid gap-5 md:grid-cols-[1fr_2fr] md:gap-12"
        >
          <h2 id="equipe-titulo" className="font-display text-h2 font-bold">
            Quem faz
          </h2>

          <div>
            <p className="font-corpo text-corpo-16 leading-relaxed">
              O Lugares Acessíveis é um projeto acadêmico desenvolvido pela
              Squad 1-A como parte do Challenge da FIAP. Design, conteúdo e
              verificação em campo são feitos pela própria equipe.
            </p>

            <dl className="mt-5 grid gap-5 rounded-md border border-borda-decorativa p-5 sm:grid-cols-3">
              <div>
                <dt className="font-corpo text-legenda text-secundaria">
                  Squad
                </dt>
                <dd className="mt-1 font-corpo font-bold">Squad 1-A</dd>
              </div>

              <div>
                <dt className="font-corpo text-legenda text-secundaria">
                  Turma
                </dt>
                <dd className="mt-1 font-corpo font-bold">1TDSPH-26</dd>
              </div>

              <div>
                <dt className="font-corpo text-legenda text-secundaria">
                  Instituição
                </dt>
                <dd className="mt-1 font-corpo font-bold">FIAP</dd>
              </div>
            </dl>

            <p className="mt-4 font-corpo text-legenda text-secundaria">
              
            </p>
          </div>
        </section>

        <section
          aria-labelledby="contato-titulo"
          className="mt-14 rounded-lg bg-primaria-700 p-7 text-white md:flex md:items-center md:justify-between md:gap-10 md:p-10"
        >
          <div>
            <h2 id="contato-titulo" className="font-display text-h2 font-bold">
              Encontrou uma informação desatualizada?
            </h2>

            <p className="mt-3 max-w-2xl font-corpo text-corpo-14 leading-relaxed">
              Se um recurso mudou ou deixou de existir, avise a equipe. A
              correção entra na próxima rodada de verificação. 
            </p>
          </div>

          <a
            href="mailto:"
            className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-white px-6 font-corpo text-corpo-14 font-semibold text-primaria-700 md:mt-0"
          >
            Falar com a equipe
          </a>
        </section>
      </div>
    </main>
  )
}