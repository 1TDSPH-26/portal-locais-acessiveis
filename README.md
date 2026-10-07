# Portal de Locais e Serviços Acessíveis — CP1

O Portal de Locais e Serviços Acessíveis é uma aplicação web que tem como objetivo facilitar a descoberta de estabelecimentos e serviços com recursos de acessibilidade. A proposta é permitir a consulta e o cadastro de locais, organizados por categoria e por recursos como rampas, banheiros adaptados, piso tátil e atendimento em Libras.

Este documento reúne as instruções de execução e as informações disponíveis para a entrega do CP1. Foi preparado na branch `feature/issue-48-README`, referente à issue 48, sem alterações no código da aplicação.

> **Situação da entrega:** integrantes, papéis, squads, Figma e GitHub Projects registrados conforme informações da equipe. As funcionalidades podem evoluir conforme as issues são implementadas e validadas. Este arquivo não substitui a evidência de validação do QA.

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
<!-- CI: validação da entrega da Issue #88 — filtros combinados de locais. -->
