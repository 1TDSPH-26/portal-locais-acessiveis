# Portal de Locais e Serviços Acessíveis — CP1

O Portal de Locais e Serviços Acessíveis é uma aplicação web que tem como objetivo facilitar a descoberta de estabelecimentos e serviços com recursos de acessibilidade. A proposta é permitir a consulta e o cadastro de locais, organizados por categoria e por recursos como rampas, banheiros adaptados, piso tátil e atendimento em Libras.

Este documento reúne as instruções de execução e as informações disponíveis para a entrega do CP1. Foi preparado na branch `feature/issue-48-README`, referente à issue 48, sem alterações no código da aplicação.

> **Situação da entrega:** integrantes, papéis, squads, Figma e GitHub Projects registrados conforme informações da equipe. Na versão inspecionada, as páginas de listagem e cadastro contêm apenas títulos; essas funcionalidades ainda não podem ser consideradas demonstráveis. Este arquivo não substitui a evidência de validação do QA.

## Recursos oficiais

| Recurso | Endereço ou situação |
| --- | --- |
| Repositório | [1TDSPH-26/portal-locais-acessiveis](https://github.com/1TDSPH-26/portal-locais-acessiveis) |
| Board do GitHub Projects | [Project 2 — 1TDSPH-26](https://github.com/orgs/1TDSPH-26/projects/2) |
| Figma | [Lugares Acessíveis — Guia de Estilos](https://www.figma.com/design/wFjJ9JQOaaqRK2gH9ql329/Lugares-Acess%C3%ADveis-%E2%80%94-Guia-de-Estilos-%7C-Squad-1-A--Copy-?node-id=0-1) |


## Stack tecnológica

| Tecnologia | Utilização |
| --- | --- |
| React | Construção da interface com componentes. |
| Vite | Servidor de desenvolvimento e geração do build. |
| TypeScript | Tipagem do código e dos modelos de dados. |
| Tailwind CSS | Estilização; integração com Vite via `@tailwindcss/vite`. |
| React Router | Navegação no navegador e definição das rotas. |
| Oxlint | Verificação estática executada pelo comando de lint. |

**React Router DOM:** embora o escopo da issue use essa denominação, esta versão instala `react-router` e importa desse pacote `BrowserRouter`, `Routes`, `Route`, `NavLink` e `Link`. O pacote `react-router-dom` não consta no `package.json`. Esta documentação descreve a implementação existente, sem adicionar ou alterar dependências.

As dependências declaradas ficam em `package.json`; as versões resolvidas para instalação reproduzível ficam em `package-lock.json`.

## Instalação e execução local

### 1. Pré-requisitos

- Git instalado e acesso de leitura ao repositório.
- Node.js 22.12 ou superior da linha 22, com npm. A integração contínua utiliza Node.js 22.
- Terminal, navegador e conexão com a internet para baixar o projeto e as dependências.

Confira as ferramentas:

```bash
git --version
node --version
npm --version
```

### 2. Clonar e entrar na pasta

```bash
git clone https://github.com/1TDSPH-26/portal-locais-acessiveis.git
cd portal-locais-acessiveis
git switch develop
```

`develop` é a branch padrão registrada no clone inspecionado. Para avaliar uma entrega específica, o QA deve usar a branch ou tag indicada pela equipe e registrar o commit testado. A branch local de autoria deste documento é `feature/issue-48-README`; sua publicação não é presumida nestas instruções.

### 3. Instalar as dependências

Execute na raiz, onde estão `package.json` e `package-lock.json`:

```bash
npm ci
```

Não é necessário criar outro projeto Vite nem instalar React ou Tailwind separadamente. `npm ci` usa o lockfile versionado. Se houver incompatibilidade entre o manifesto e o lockfile, registre o erro para a equipe corrigir; não apague o lockfile para contornar o problema.

### 4. Iniciar a aplicação

```bash
npm run dev
```

Abra o endereço informado pelo Vite no terminal, normalmente `http://localhost:5173`. Se essa porta estiver ocupada, use a porta efetivamente exibida. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

### Configuração de ambiente

O código inspecionado não utiliza variáveis de ambiente nem integra uma API. Portanto, não é necessário criar `.env` para executar esta versão. O `.env.example` contém somente um exemplo de endereço público de API para uma futura integração; ele não representa um backend disponível.

Nunca inclua senhas, tokens, credenciais ou dados pessoais sensíveis neste documento. Variáveis com prefixo `VITE_` podem ser expostas no navegador e não devem armazenar segredos.

## Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instalar as dependências conforme o lockfile. |
| `npm run dev` | Iniciar o servidor de desenvolvimento. |
| `npm run lint` | Executar Oxlint. |
| `npm run build` | Executar `tsc -b` e gerar a versão de produção em `dist/`. |
| `npm run preview` | Servir localmente o build já gerado; usar após `npm run build`. |

Não existe script `test` no `package.json` inspecionado. Os comandos acima foram conferidos no manifesto, mas não executados nesta alteração exclusivamente documental; instalação limpa e execução ainda precisam de evidência do QA.

## Rotas e estado atual

| Rota | Página | Estado observado no código |
| --- | --- | --- |
| `/` | Home | Página inicial com título. |
| `/locais` | Locais | Título de listagem; sem listagem funcional implementada. |
| `/cadastrar` | Cadastro | Título de cadastro; sem formulário funcional implementado. |
| `/sobre` | Sobre | Título informativo sobre o projeto. |
| Caminho não reconhecido | NotFound | Rota de página não encontrada. |

As rotas são declaradas em `src/routes/AppRoutes.tsx`. A presença dessas rotas não comprova que listagem, cadastro ou persistência estejam concluídos.

## Equipe e responsabilidades


### Squad 1 
| Papel | Nome ou identificação fornecida | GitHub |
| --- | --- | --- |
| TL | Murilo de Souza | [murilo-a-souza](https://github.com/murilo-a-souza) |
| QA | Enzo Nukui | [EnzoNukui](https://github.com/EnzoNukui) |
| QA | Marina Fernandes | [marifernandesgm](https://github.com/marifernandesgm) |
| DEV | Carlos Franco | [francosdev](https://github.com/francosdev) |
| DEV | Giovanni Zorzetto Oliveira | [Gizetto61](https://github.com/Gizetto61) |
| DEV | Leticia Almeida | [lehalmeidafc0](https://github.com/lehalmeidafc0) |
| DEV | Felipe Lima | [felipelima2005](https://github.com/felipelima2005) |
| DEV | Nicolas | [nicolaspk](https://github.com/nicolaspk) |
| DEV | Ruhtra10 | [ruhtradev10](https://github.com/ruhtradev10) |
| DEV | Le Felix | [LeticiaFelix18](https://github.com/LeticiaFelix18) |
| DEV | Sam Giulian Altoe | [Sammer-07](https://github.com/Sammer-07) |
| DEV | Diego Trujillo | [diegotrujillo011](https://github.com/diegotrujillo011) |
| DEV | Milena Silva Conegin | [MilenaConegin](https://github.com/MilenaConegin) |
| DEV | Raphael Gomes Brito | [PhaelRGB](https://github.com/PhaelRGB) |
| DEV | Andre Luiz | [AndreL050690](https://github.com/AndreL050690) |
| DEV | Eduardo Guelere | [Eduardoguelere](https://github.com/Eduardoguelere) |
| DEV | Isabelle Ferreira | [isabelleferreiraa](https://github.com/isabelleferreiraa) |
| DEV | Andre Luiz | [andreluizramos414](https://github.com/andreluizramos414) |
| DEV | Henrique Bonachela de Carvalho Carabante | [henriquebonachela](https://github.com/henriquebonachela) |

### Squad 2

| Papel | Integrante | GitHub |
| --- | --- | --- |
| TL | Carolina Kotz | [carolinakotz](https://github.com/carolinakotz) |
| QA | Giovanni Ferreira Alves de Azevedo | [GiovanniDEVazevedo](https://github.com/GiovanniDEVazevedo) |
| QA | Tárik Moussa Alma | [cearaa](https://github.com/cearaa) |
| DEV | Arthur Palacio Alves | [Thiefman469](https://github.com/Thiefman469) |
| DEV | Carlos Eduardo Tsucamoto Chiarelli | [carlostsucamoto](https://github.com/carlostsucamoto) |
| DEV | Cauã de Souza Vasconcellos | [cauadesouzavasconcellos-byte](https://github.com/cauadesouzavasconcellos-byte) |
| DEV | Felipe Motitsuki Tan | [felipemotitsukitan](https://github.com/felipemotitsukitan) |
| DEV | Gabriel Feitosa de Lima | [gabefeitosa](https://github.com/gabefeitosa) |
| DEV | Giovanni Lopez Zavam | [Giovanni0403](https://github.com/Giovanni0403) |
| DEV | Guilherme da Costa Campos | [guilherme76campos-creator](https://github.com/guilherme76campos-creator) |
| DEV | Fabricio Aquiles Sales da Silva | [fabricioaquiles](https://github.com/fabricioaquiles) |
| DEV | Italo Eujacio de Oliveira Neto | [I-neeto99](https://github.com/I-neeto99) |
| DEV | João Gabriel Dantas Moura | [Gabrieo367](https://github.com/Gabrieo367) |
| DEV | Luigi Tormim Carqueijeiro | [LuigiT2703](https://github.com/LuigiT2703) |
| DEV | Murilo Martins de Campos | [Muale-0](https://github.com/Muale-0) |
| DEV | Pedro Henrique Salvatore | [Pedro-H-Salvatore](https://github.com/Pedro-H-Salvatore) |
| DEV | Thiago Andrade Silva Piedade | [EuThiaguera](https://github.com/EuThiaguera) |
| DEV | Záyon Alves Marques | [Zayon101](https://github.com/Zayon101) |



- **TL (Tech Lead):** acompanha decisões técnicas, revisão e integração das entregas.
- **DEV (Developer):** implementa e documenta a demanda atribuída.
- **QA (Quality Assurance):** valida os critérios de aceite e registra evidências e problemas encontrados.

## Estrutura de pastas

```text
portal-locais-acessiveis/
├── .github/                 # Templates, responsáveis e workflow de qualidade
├── docs/                    # Guias, configuração e modelos de relatórios
│   └── tutoriais/           # Orientações do fluxo de trabalho
├── src/
│   ├── assets/              # Reservado para recursos estáticos
│   ├── components/
│   │   ├── Feedback/        # Componente de mensagem de erro
│   │   ├── Footer/
│   │   └── Header/
│   ├── layouts/
│   │   └── MainLayout/      # Layout compartilhado
│   ├── pages/
│   │   ├── Cadastro/
│   │   ├── Home/
│   │   ├── Locais/
│   │   ├── NotFound/
│   │   └── Sobre/
│   ├── routes/             # Definição das rotas
│   ├── services/           # Reservado para serviços e integrações
│   ├── types/              # Tipos Local, Categoria e RecursoAcessibilidade
│   ├── App.tsx             # Composição da aplicação
│   └── main.tsx            # Entrada React e BrowserRouter
├── .env.example            # Modelo de configuração futura
├── globals.css             # Estilos globais e Tailwind
├── index.html              # Documento de entrada do Vite
├── package.json            # Dependências e scripts
├── package-lock.json       # Versões resolvidas das dependências
├── tsconfig*.json          # Configurações TypeScript
├── vite.config.ts          # Plugins React e Tailwind
├── vercel.json             # Configuração de publicação
├── README.md               # Documento preexistente, preservado
└── CP1ATUALIZADO.md         # Este documento
```


