# Plano de testes — Issue #84

## Objetivo

Validar as rotas da aplicação e verificar se a navegação pode ser realizada utilizando apenas o teclado, com indicação visual de foco.

## Ambiente

- Branch: `qa/84-rotas-navegacao-teclado`
- Execução local
- Navegador desktop

## Rotas previstas

- `/`
- `/locais`
- `/cadastrar`
- `/sobre`
- `/acessibilidade`
- `/locais/:id`
- rota inexistente para validação da página NotFound

## Cenários

### CT01 — Home
Acessar `/` e verificar o carregamento correto.

### CT02 — Locais
Acessar `/locais` e verificar o carregamento correto.

### CT03 — Cadastro
Acessar `/cadastrar` e verificar o carregamento correto.

### CT04 — Sobre
Acessar `/sobre` e verificar o carregamento correto.

### CT05 — Acessibilidade
Acessar `/acessibilidade` e verificar o carregamento correto.

### CT06 — Detalhes de local
Acessar um local pela rota `/locais/:id`.

### CT07 — NotFound
Acessar uma rota inexistente e verificar a página de erro.

### CT08 — Navegação por teclado
Navegar utilizando apenas `Tab`, `Shift + Tab`, `Enter` e `Espaço`.

### CT09 — Foco visível
Verificar indicação visual de foco nos elementos interativos.

### CT10 — Responsividade
Validar navegação e foco em desktop e mobile.

### CT11 — Testes automatizados
Executar `npm test`.

### CT12 — Lint
Executar `npm run lint`.

### CT13 — Build
Executar `npm run build`.