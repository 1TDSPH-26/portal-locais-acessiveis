import { Link } from 'react-router'

const criterios = [
  {
    criterio: '1.1.1',
    nome: 'Conteúdo não textual',
    atendimento:
      'Ícones sempre acompanhados de texto. Não há imagem informativa no portal.',
  },
  {
    criterio: '1.4.1',
    nome: 'Uso de cor',
    atendimento:
      'Erro e sucesso do campo trazem mensagem em texto. Recursos do card usam ícone mais rótulo.',
  },
  {
    criterio: '1.4.3',
    nome: 'Contraste mínimo',
    atendimento:
      'Todos os pares medidos, inclusive sobre a faixa escura. Menor valor em uso: 4,76:1.',
  },
  {
    criterio: '1.4.11',
    nome: 'Contraste não textual',
    atendimento:
      'Borda funcional em #64748B (4,76:1). Bordas decorativas nunca são o único identificador.',
  },
  {
    criterio: '1.4.12',
    nome: 'Espaçamento de texto',
    atendimento:
      'Entrelinha de 160% no corpo. Layout em auto-layout, tolera aumento sem sobreposição.',
  },
  {
    criterio: '2.4.1',
    nome: 'Blocos reutilizáveis',
    atendimento:
      'Skip link como primeiro item da tabulação, apontando para o conteúdo principal.',
  },
  {
    criterio: '2.4.11',
    nome: 'Aparência do foco',
    atendimento:
      'Anel duplo, faixa clara interna e escura externa. Garante 3:1 contra o componente e contra o fundo.',
  },
  {
    criterio: '2.5.8',
    nome: 'Tamanho do alvo',
    atendimento:
      'Botões 48px, links do menu 44px, botão de ícone 48x48px. Mínimo da norma: 24px.',
  },
  {
    criterio: '3.3.1',
    nome: 'Identificação de erro',
    atendimento:
      'O campo de busca no estado Erro descreve o problema em texto, abaixo do campo.',
  },
  {
    criterio: '3.3.2',
    nome: 'Rótulos e instruções',
    atendimento:
      'O campo de busca tem rótulo visível permanente, não apenas placeholder.',
  },
]

const limitacoes = [
  {
    titulo: 'Token Aviso com margem estreita',
    descricao:
      'O amarelo #A16207 tem 4,92:1. Passa no AA por pouco e reprova no AAA. Evitar em texto pequeno.',
  },
  {
    titulo: 'Ordem de tabulação não testada',
    descricao:
      'A ordem está definida no protótipo, mas só pode ser verificada na implementação.',
  },
  {
    titulo: 'Leitores de tela',
    descricao:
      'Nomes, papéis e regiões dependem do HTML final. Ainda não houve teste com NVDA ou VoiceOver.',
  },
  {
    titulo: 'Preferência de contraste',
    descricao:
      'A escolha do modo ainda não persiste entre telas. No código, precisa ser guardada no cliente.',
  },
  {
    titulo: 'Botão de ícone sem texto',
    descricao:
      'O botão do menu mobile não tem texto visível e depende de aria-label para cumprir o 4.1.2.',
  },
  {
    titulo: 'Fotos dos locais',
    descricao:
      'A área de foto foi adiada até haver registro real das entradas. Quando existir, exigirá texto alternativo descritivo.',
  },
]

export default function Acessibilidade() {
  return (
    <div className="bg-fundo font-corpo text-texto">
      <section className="bg-primaria-700 text-fundo">
        <div className="mx-auto max-w-7xl px-6 py-9 md:py-10">
          <nav aria-label="Breadcrumb" className="mb-3 text-legenda">
            <Link
              to="/"
              className="underline underline-offset-2 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-fundo"
            >
              Início
            </Link>

            <span aria-hidden="true" className="mx-2">
              /
            </span>

            <span aria-current="page">Acessibilidade</span>
          </nav>

          <h1 className="font-display text-h1 font-bold leading-tight">
            Declaração de acessibilidade
          </h1>

          <p className="mt-3 max-w-3xl text-corpo-14 leading-[1.6]">
            O que fizemos para que este portal possa ser usado por qualquer
            pessoa, o que ainda não está resolvido e como falar com a gente
            quando algo não funcionar.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <section
          aria-labelledby="situacao-conformidade"
          className="grid gap-5 md:grid-cols-[300px_minmax(0,1fr)] md:gap-10"
        >
          <h2
            id="situacao-conformidade"
            className="font-display text-h3 font-bold"
          >
            Situação de conformidade
          </h2>

          <div className="space-y-4 text-corpo-14 leading-[1.6] text-secundaria">
            <p className="text-texto">
              O Lugares Acessíveis é{' '}
              <strong>parcialmente conforme</strong> com a WCAG 2.2 no nível
              AA. Parcialmente conforme quer dizer que a maior parte do
              conteúdo atende ao nível AA, com as exceções descritas em
              Limitações conhecidas.
            </p>

            <p>
              No modo de alto contraste, o portal busca o nível AAA. Todos os
              pares de cor foram medidos pela fórmula de luminância relativa da
              WCAG. O menor valor em uso no modo padrão é 4,76:1.
            </p>
          </div>
        </section>

        <section aria-labelledby="recursos-acessibilidade" className="mt-12">
          <h2
            id="recursos-acessibilidade"
            className="font-display text-h3 font-bold"
          >
            Recursos de acessibilidade do portal
          </h2>

          <div className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-3">
            <div>
              <h3 className="text-corpo-14 font-bold">
                Dois modos de contraste
              </h3>

              <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                Alternância disponível em todas as telas, no topo no desktop e
                no rodapé no mobile.
              </p>
            </div>

            <div>
              <h3 className="text-corpo-14 font-bold">Skip link</h3>

              <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                Primeiro item da ordem de tabulação, leva direto ao conteúdo
                principal.
              </p>
            </div>

            <div>
              <h3 className="text-corpo-14 font-bold">
                Navegação por teclado
              </h3>

              <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                Use Tab para avançar entre os elementos interativos e Shift + Tab
                para voltar. Use Enter para acessar links e ativar ações
                disponíveis.
              </p>
            </div>

            <div>
              <h3 className="text-corpo-14 font-bold">Alvos de 48px</h3>

              <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                Botões e campos com 48px de altura; links do menu com 44px.
              </p>
            </div>

            <div>
              <h3 className="text-corpo-14 font-bold">
                Informação sempre em texto
              </h3>

              <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                Nenhum ícone e nenhuma cor carregam informação sozinhos.
              </p>
            </div>

            <div>
              <h3 className="text-corpo-14 font-bold">
                Espaçamento tolerante
              </h3>

              <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                Entrelinha de 160% e layout que suporta aumento de espaçamento
                sem sobrepor. Para ampliar a página, use Ctrl + + no Windows ou
                Linux e Command + + no macOS. O layout suporta zoom de até 200%.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="criterios-verificados" className="mt-12">
          <h2
            id="criterios-verificados"
            className="font-display text-h3 font-bold"
          >
            Critérios verificados
          </h2>

          <p className="mt-3 text-corpo-14 leading-[1.6] text-secundaria">
            Dez critérios da WCAG 2.2 foram verificados componente por
            componente. A tabela mostra como cada um foi atendido.
          </p>

          <div className="mt-5 hidden overflow-hidden rounded-lg border border-borda-decorativa md:block">
            <table className="w-full border-collapse text-left text-corpo-14">
              <thead className="bg-fundo-suave text-texto">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Critério
                  </th>

                  <th scope="col" className="px-5 py-3 font-semibold">
                    Nome
                  </th>

                  <th scope="col" className="px-5 py-3 font-semibold">
                    Como foi atendido
                  </th>
                </tr>
              </thead>

              <tbody>
                {criterios.map((item) => (
                  <tr
                    key={item.criterio}
                    className="border-t border-borda-decorativa"
                  >
                    <th
                      scope="row"
                      className="w-28 px-5 py-3 align-top font-semibold text-texto"
                    >
                      {item.criterio}
                    </th>

                    <td className="w-64 px-5 py-3 align-top text-texto">
                      {item.nome}
                    </td>

                    <td className="px-5 py-3 align-top leading-[1.6] text-secundaria">
                      {item.atendimento}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-borda-decorativa md:hidden">
            {criterios.map((item, index) => (
              <article
                key={item.criterio}
                className={
                  index === 0
                    ? 'p-4'
                    : 'border-t border-borda-decorativa p-4'
                }
              >
                <h3 className="text-corpo-14 font-bold">
                  {item.criterio} · {item.nome}
                </h3>

                <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                  {item.atendimento}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="limitacoes-conhecidas"
          className="mt-12 rounded-lg border border-borda-decorativa bg-fundo-suave p-6 md:p-8"
        >
          <h2
            id="limitacoes-conhecidas"
            className="font-display text-h3 font-bold"
          >
            Limitações conhecidas
          </h2>

          <p className="mt-3 text-corpo-14 leading-[1.6] text-texto">
            Apesar do cuidado, sabemos que estes pontos ainda não estão
            resolvidos. Cada um está na fila de correção.
          </p>

          <div className="mt-5 grid gap-x-12 gap-y-5 md:grid-cols-2">
            {limitacoes.map((item) => (
              <div key={item.titulo}>
                <h3 className="text-corpo-14 font-bold">{item.titulo}</h3>

                <p className="mt-1 text-corpo-14 leading-[1.6] text-secundaria">
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <section aria-labelledby="como-avaliamos">
            <h2
              id="como-avaliamos"
              className="font-display text-h3 font-bold"
            >
              Como avaliamos
            </h2>

            <p className="mt-3 text-corpo-14 leading-[1.6] text-secundaria">
              Autoavaliação feita pela Squad 1-A, componente por componente, a
              partir do Guia de Estilos. Os valores de contraste foram
              calculados pela fórmula de luminância relativa da WCAG.
              Ferramentas utilizadas: [FERRAMENTAS USADAS].
            </p>
          </section>

          <section aria-labelledby="tecnologias">
            <h2
              id="tecnologias"
              className="font-display text-h3 font-bold"
            >
              Tecnologias
            </h2>

            <p className="mt-3 text-corpo-14 leading-[1.6] text-secundaria">
              A acessibilidade do portal depende de HTML, CSS, JavaScript e
              React. Sem essas tecnologias habilitadas no navegador, parte do
              conteúdo pode não funcionar como descrito aqui.
            </p>
          </section>
        </div>

        <section
          aria-labelledby="encontrou-barreira"
          className="mt-12 rounded-lg bg-primaria-700 p-6 text-fundo md:flex md:items-center md:justify-between md:gap-10 md:p-8"
        >
          <div>
            <h2
              id="encontrou-barreira"
              className="font-display text-h3 font-bold"
            >
              Encontrou uma barreira?
            </h2>

            <p className="mt-3 max-w-3xl text-corpo-14 leading-[1.6]">
              Conte o que aconteceu, em que tela e com que equipamento. Escreva
              para [E-MAIL DA SQUAD]. Respondemos em até [PRAZO DE RESPOSTA].
            </p>
          </div>

          <button
            type="button"
            className="mt-5 min-h-12 shrink-0 rounded-md bg-fundo px-5 py-3 text-corpo-14 font-semibold text-primaria-700 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-fundo md:mt-0"
          >
            Relatar uma barreira
          </button>
        </section>

        <p className="mt-10 text-legenda leading-[1.6] text-secundaria">
          Esta declaração foi criada em 17/09/2026 e revisada pela
          última vez em [DATA DE REVISÃO]. Documento de conformidade v2.1 ·
          Squad 1-A · Turma 1TDSPH-26 · FIAP.
        </p>
      </div>
    </div>
  )
}