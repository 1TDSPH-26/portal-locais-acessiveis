# Portal de Locais e Serviços Acessíveis — CP3

## Documentação técnica

- [Modelo de dados Local](docs/modelo-local.md): campos, tipos, categorias, recursos de acessibilidade, exemplo e uso na implementação.
- [Modelo de Relatório de Release](docs/modelo-release.md): checklist de verificação e formulário para aprovação formal da release.
- [Modelo de Relatório do Tech Lead](docs/modelo-relatorio-tech-lead.md): registro de consolidação das entregas e decisões técnicas.

O Portal de Locais e Serviços Acessíveis é uma aplicação web que tem como objetivo facilitar a descoberta, avaliação e compartilhamento de estabelecimentos e serviços com recursos de acessibilidade. A plataforma permite a consulta avançada com filtros combinados, visualização detalhada, gerenciamento de favoritos com persistência local e cadastro de novos locais com validações acessíveis.

Este documento reúne as instruções de execução, comandos de qualidade, mapa de rotas funcionais e a composição oficial das squads para a entrega da **Release CP3**.

---

## Recursos oficiais

| Recurso | Endereço ou situação |
| --- | --- |
| Repositório | [1TDSPH-26/portal-locais-acessiveis](https://github.com/1TDSPH-26/portal-locais-acessiveis) |
| Board do GitHub Projects | [Project 2 — 1TDSPH-26](https://github.com/orgs/1TDSPH-26/projects/2) |
| Figma | [Lugares Acessíveis — Guia de Estilos](https://www.figma.com/design/wFjJ9JQOaaqRK2gH9ql329/Lugares-Acess%C3%ADveis-%E2%80%94-Guia-de-Estilos-%7C-Squad-1-A--Copy-?node-id=0-1) |

---

## Stack tecnológica

| Tecnologia | Utilização |
| --- | --- |
| React 19 | Construção da interface com componentes funcionais reativos. |
| Vite | Servidor de desenvolvimento ultrarrápido e geração de build de produção. |
| TypeScript | Tipagem estática rigorosa dos componentes, serviços e modelos de dados. |
| Tailwind CSS v4 | Estilização utilitária e tokens globais integrados via `@tailwindcss/vite`. |
| React Router v8 | Roteamento dinâmico SPA e navegação acessível no cliente. |
| Oxlint | Verificação e análise estática de código ultrarrápida. |
| Vitest & Testing Library | Testes unitários e de integração de componentes, hooks e utilitários. |
| Playwright | Testes ponta a ponta (E2E) e validação de acessibilidade. |

As dependências declaradas ficam em `package.json`; as versões resolvidas para instalação reproduzível ficam em `package-lock.json`.

---

## Instalação e execução local

### 1. Pré-requisitos

- Git instalado e acesso ao repositório.
- Node.js 22.x LTS (compatível com a automação de CI do GitHub Actions) e npm.
- Terminal moderno e navegador web.

Confira os pré-requisitos instalados:

```bash
git --version
node --version
npm --version
```

### 2. Clonar e acessar o projeto

```bash
git clone https://github.com/1TDSPH-26/portal-locais-acessiveis.git
cd portal-locais-acessiveis
git switch release/cp3
```

> Em ambiente de produção e avaliação final da release, utilize a branch `main` ou a tag publicada. Para o fluxo de desenvolvimento contínuo, utilize `develop`.

### 3. Instalar as dependências

Execute na raiz do projeto:

```bash
npm ci
```

### 4. Iniciar a aplicação em desenvolvimento

```bash
npm run dev
```

Abra o endereço informado pelo terminal (geralmente `http://localhost:5173`). Para encerrar o servidor, pressione `Ctrl+C`.

### Configuração de ambiente

As variáveis de ambiente suportadas estão exemplificadas em `.env.example`. Para uso local não confidencial, crie um arquivo `.env` baseado no modelo:

```bash
cp .env.example .env
```

> **Atenção:** Nunca versione senhas, tokens ou dados sensíveis. Variáveis expostas no cliente com o prefixo `VITE_` são públicas por definição.

---

## Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instalação limpa e determinística das dependências via lockfile. |
| `npm run dev` | Inicia o servidor local de desenvolvimento Vite com HMR. |
| `npm run lint` | Executa o linter Oxlint em todos os arquivos do projeto. |
| `npm run build` | Valida tipagens TypeScript (`tsc -b`) e gera o pacote de produção em `dist/`. |
| `npm test` | Executa todos os testes unitários e de integração com Vitest. |
| `npm run preview` | Serve localmente a versão compilada em `dist/` para validação pré-deploy. |

---

## Rotas da aplicação

As rotas são declaradas em `src/routes/AppRoutes.tsx`:

| Rota | Página | Descrição e Funcionalidade |
| --- | --- | --- |
| `/` | Início | Apresentação do portal, busca rápida, atalhos de navegação e destaques de acessibilidade. |
| `/locais` | Locais | Listagem de locais com paginação, filtros combinados, histórico de busca e ordenação. |
| `/locais/:id` | Detalhes | Visualização detalhada do local, recursos acessíveis, endereço e compartilhamento de link. |
| `/favoritos` | Favoritos | Gerenciamento de locais salvos com contador acessível via leitores de tela e persistência local. |
| `/cadastrar` | Cadastro | Formulário para cadastro de novos locais com validações de campos, CEP e acessibilidade. |
| `/sobre` | Sobre | Informações sobre a iniciativa, objetivos de inclusão e histórico do projeto. |
| `/acessibilidade` | Acessibilidade | Recursos assistivos, guia de navegação por teclado e conformidade com diretrizes. |
| `/erro` | Indisponibilidade | Tratamento amigável e mensagens para indisponibilidade ou falhas de serviço. |
| `*` | NotFound | Página acessível para rotas não encontradas (404) com retorno seguro à navegação. |

---

## Equipe e responsabilidades

### Liderança Técnica (Tech Leads)

Responsáveis pela arquitetura, integração de branches, governança de código, revisão técnica de PRs e preparação da release:

| Papel | Nome | GitHub |
| --- | --- | --- |
| TL | Murilo de Souza | [murilo-a-souza](https://github.com/murilo-a-souza) |
| TL | Giovanni Ferreira Alves de Azevedo | [GiovanniDEVazevedo](https://github.com/GiovanniDEVazevedo) |

---

### Squad 1 (Time A)

| Papel | Integrante | GitHub |
| --- | --- | --- |
| QA | Enzo Nukui | [EnzoNukui](https://github.com/EnzoNukui) |
| DEV | André Luiz | [AndreL050690](https://github.com/AndreL050690) |
| DEV | Diego Trujillo | [diegotrujillo011](https://github.com/diegotrujillo011) |
| DEV | Eduardo Guelere | [Eduardoguelere](https://github.com/Eduardoguelere) |
| DEV | Henrique Bonachela de Carvalho Carabante | [henriquebonachela](https://github.com/henriquebonachela) |
| DEV | Leticia Almeida | [lehalmeidafc0](https://github.com/lehalmeidafc0) |
| DEV | Leticia Felix | [LeticiaFelix18](https://github.com/LeticiaFelix18) |
| DEV | Nicolas | [nicolaspk](https://github.com/nicolaspk) |

---

### Squad 2 (Time B)

| Papel | Integrante | GitHub |
| --- | --- | --- |
| QA | Marina Fernandes | [marifernandesgm](https://github.com/marifernandesgm) |
| DEV | Giovanni Zorzetto Oliveira | [Gizetto61](https://github.com/Gizetto61) |
| DEV | Carlos Franco | [francosdev](https://github.com/francosdev) |
| DEV | Felipe Lima | [felipelima2005](https://github.com/felipelima2005) |
| DEV | Raphael Gomes Brito | [PhaelRGB](https://github.com/PhaelRGB) |
| DEV | João Gabriel Dantas Moura | [Gabrieo367](https://github.com/Gabrieo367) |
| DEV | Isabelle Ferreira | [isabelleferreiraa](https://github.com/isabelleferreiraa) |
| DEV | Milena Silva Conegin | [MilenaConegin](https://github.com/MilenaConegin) |

---

### Squad 3 (Time 1)

| Papel | Integrante | GitHub |
| --- | --- | --- |
| QA | — *(Liderança realocada para TL)* | — |
| DEV | Arthur Palacio Alves | [Thiefman469](https://github.com/Thiefman469) |
| DEV | Carlos Eduardo Tsucamoto Chiarelli | [carlostsucamoto](https://github.com/carlostsucamoto) |
| DEV | Cauã de Souza Vasconcellos | [cauadesouzavasconcellos-byte](https://github.com/cauadesouzavasconcellos-byte) |
| DEV | Felipe Motitsuki Tan | [felipemotitsukitan](https://github.com/felipemotitsukitan) |
| DEV | Gabriel Feitosa de Lima | [gabefeitosa](https://github.com/gabefeitosa) |
| DEV | Giovanni Lopez Zavam | [Giovanni0403](https://github.com/Giovanni0403) |
| DEV | Guilherme da Costa Campos | [guilherme76campos-creator](https://github.com/guilherme76campos-creator) |

---

### Squad 4 (Time 2)

| Papel | Integrante | GitHub |
| --- | --- | --- |
| QA | Tárik Moussa Alma | [cearaa](https://github.com/cearaa) |
| DEV | Fabricio Aquiles Sales da Silva | [fabricioaquiles](https://github.com/fabricioaquiles) |
| DEV | Italo Eujacio de Oliveira Neto | [I-neeto99](https://github.com/I-neeto99) |
| DEV | Záyon Alves Marques | [Zayon101](https://github.com/Zayon101) |
| DEV | Luigi Tormim Carqueijeiro | [LuigiT2703](https://github.com/LuigiT2703) |
| DEV | Murilo Martins de Campos | [Muale-0](https://github.com/Muale-0) |
| DEV | Pedro Henrique Salvatore | [Pedro-H-Salvatore](https://github.com/Pedro-H-Salvatore) |
| DEV | Thiago Andrade Silva Piedade | [EuThiaguera](https://github.com/EuThiaguera) |

---

### Descrição dos Papéis

- **TL (Tech Lead):** Acompanha decisões arquiteturais, governança de código, revisão técnica de Pull Requests, resolução de conflitos e integração contínua das entregas.
- **QA (Quality Assurance):** Conduz planos de teste, valida critérios de aceite e acessibilidade, e emite os relatórios formais de decisão (Go/No-Go).
- **DEV (Developer):** Constrói e testa as funcionalidades, componentes e regras de negócio especificadas nas issues.

---

## Estrutura de pastas

```text
portal-locais-acessiveis/
├── .github/                 # Workflows de CI/CD, templates de Issue/PR e CODEOWNERS
├── docs/                    # Documentação técnica de modelos, labels e releases
│   └── tutoriais/           # Guias de fluxo de trabalho do repositório
├── src/
│   ├── assets/              # Recursos visuais estáticos e ícones
│   ├── components/          # Componentes reutilizáveis (Feedback, Header, Footer, Navegação)
│   ├── hooks/               # Custom hooks (geolocalização, controle de título, etc.)
│   ├── layouts/             # Layout base compartilhado (MainLayout)
│   ├── pages/               # Páginas da aplicação (Início, Locais, Detalhes, Favoritos, etc.)
│   ├── routes/              # Configuração e declaração das rotas React Router
│   ├── services/            # Serviços de dados e tratamento de erros
│   ├── types/               # Definições TypeScript (Local, Filtros, etc.)
│   ├── utils/               # Funções utilitárias (filtros, histórico, geolocalização)
│   ├── App.tsx              # Componente raiz da aplicação
│   ├── globals.css          # Tokens Tailwind CSS e regras globais
│   └── main.tsx             # Ponto de entrada do cliente Vite
├── .env.example            # Modelo de variáveis de ambiente
├── index.html              # Documento HTML principal
├── package.json            # Manifesto de dependências e scripts npm
├── package-lock.json       # Versões fixadas das dependências
├── tsconfig*.json          # Configurações do compilador TypeScript
├── vite.config.ts          # Configurações do Vite e plugins
└── vercel.json             # Regras de reescrita para publicação SPA
```
