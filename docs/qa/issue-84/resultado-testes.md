# Resultado do ciclo de testes — Issue #84

## Objetivo

Executar o ciclo de testes das rotas da aplicação e validar a navegação utilizando teclado, verificando também a indicação visual de foco nos elementos interativos.

## Ambiente de teste

- Branch: `qa/84-rotas-navegacao-teclado`
- Execução: ambiente local
- Aplicação executada com `npm run dev`
- Navegador: Google Chrome
- Testes realizados sem alterações funcionais no código da aplicação

---

## Rotas validadas

Foram verificadas as seguintes rotas da aplicação:

- `/`
- `/locais`
- `/cadastrar`
- `/sobre`
- `/acessibilidade`
- `/locais/:id`
- rota inexistente para validação da página NotFound

---

## Resultados dos cenários

| Cenário | Resultado |
| --- | --- |
| CT01 — Home | ✅ Aprovado |
| CT02 — Locais | ✅ Aprovado |
| CT03 — Cadastro | ✅ Aprovado |
| CT04 — Sobre | ✅ Aprovado |
| CT05 — Acessibilidade | ⚠️ Rota aprovada, com defeito de navegação identificado no Footer |
| CT06 — Detalhes do local | ✅ Aprovado |
| CT07 — NotFound | ✅ Aprovado |
| CT08 — Navegação por teclado | ✅ Aprovado |
| CT09 — Foco visível | ✅ Aprovado |
| CT10 — Responsividade e utilização da navegação | ✅ Validado durante os testes |
| CT11 — Lint | ⚠️ Concluído com 0 erros e 1 warning |
| CT12 — Build | ✅ Aprovado |

---

# Evidências dos testes

## Evidência 01 — Rota Home

Foi acessada a rota `/`.

### Resultado observado

- a página inicial foi carregada corretamente;
- os elementos principais da Home foram exibidos;
- a navegação principal permaneceu disponível;
- os locais em destaque foram carregados corretamente.

<p align="center">
  <img width="900" alt="Rota Home funcionando" src="https://github.com/user-attachments/assets/12af4900-387e-4afa-becb-e39e746ae3bb" />
</p>

---

## Evidência 02 — Rota Locais

Foi acessada a rota `/locais`.

### Resultado observado

- a listagem de locais foi carregada corretamente;
- os filtros de categoria e recursos de acessibilidade foram exibidos;
- os cards dos locais foram carregados;
- os links `Ver detalhes` ficaram disponíveis para navegação.

<p align="center">
  <img width="900" alt="Rota Locais funcionando" src="https://github.com/user-attachments/assets/52a508cf-b7f0-42e2-8a20-5924f8245ecc" />
</p>

---

## Evidência 03 — Rota Cadastro

Foi acessada a rota `/cadastrar`.

### Resultado observado

- o formulário de cadastro foi carregado corretamente;
- os campos obrigatórios foram exibidos;
- os controles do formulário permaneceram disponíveis para interação;
- a navegação principal permaneceu funcional.

<p align="center">
  <img width="900" alt="Rota Cadastro funcionando" src="https://github.com/user-attachments/assets/f35b7b9b-b217-4a37-b5bb-d8646001666f" />
</p>

---

## Evidência 04 — Rota Sobre

Foi acessada a rota `/sobre`.

### Resultado observado

- a página foi carregada corretamente;
- o conteúdo informativo foi apresentado;
- os elementos de navegação permaneceram disponíveis.

<p align="center">
  <img width="900" alt="Rota Sobre funcionando" src="https://github.com/user-attachments/assets/93b2cab2-37aa-474c-a61e-8f9424077d99" />
</p>

---

## Evidência 05 — Rota Acessibilidade

Foi acessada diretamente a rota `/acessibilidade`.

### Resultado observado

- a página de acessibilidade foi carregada corretamente;
- o conteúdo da página foi exibido;
- a rota está implementada e pode ser acessada diretamente pela URL.

<p align="center">
  <img width="900" alt="Rota Acessibilidade funcionando" src="https://github.com/user-attachments/assets/4c9f3411-c265-4692-9f67-b78076bc3f24" />
</p>

Durante os testes também foi identificado um problema no link de acesso a essa página pelo Footer, registrado na seção de defeitos encontrados.

---

## Evidência 06 — Rota inexistente / NotFound

Foi acessada uma rota não cadastrada na aplicação.

### Resultado observado

- a página de erro 404 foi exibida corretamente;
- a mensagem informou que o endereço solicitado não foi encontrado;
- foi disponibilizado um caminho para retorno à Home.

<p align="center">
  <img width="900" alt="Rota inexistente exibindo página 404" src="https://github.com/user-attachments/assets/780de3d9-a482-4121-bcf3-d83b7fd91b47" />
</p>

---

## Evidência 07 — Detalhes dos locais e navegação por teclado

Foi realizado um teste em vídeo percorrendo a aplicação e validando a navegação entre as rotas e os elementos interativos.

O vídeo também contempla o acesso às páginas de detalhes através da rota `/locais/:id`.

### Resultado observado

- os links `Ver detalhes` direcionaram para as páginas correspondentes;
- a rota dinâmica `/locais/:id` foi carregada corretamente;
- a navegação pôde ser realizada utilizando teclado;
- os elementos interativos puderam ser percorridos utilizando `Tab` e `Shift + Tab`;
- os controles puderam ser acionados pelo teclado;
- a indicação visual de foco permaneceu perceptível durante a navegação;
- as funcionalidades principais permaneceram utilizáveis sem dependência exclusiva do mouse.

https://github.com/user-attachments/assets/fbc8518b-731c-436b-bed8-f2141da1a9e2

---

# Defeitos encontrados

## Defeito 01 — Link de Acessibilidade do Footer direciona para a rota incorreta

Durante a validação das rotas foi identificado que a página de acessibilidade existe e funciona normalmente quando acessada diretamente através de `/acessibilidade`.

Entretanto, o link de acessibilidade disponível no Footer direciona o usuário para outra página.

### Passos para reprodução

1. Acessar uma página que contenha o Footer.
2. Navegar até o link referente à acessibilidade.
3. Acionar o link.

### Resultado esperado

O usuário deve ser direcionado para:

`/acessibilidade`

### Resultado obtido

O usuário é direcionado para:

`/sobre`

### Impacto

A página de acessibilidade existe e pode ser acessada diretamente, porém o caminho disponibilizado no Footer não direciona para a rota correspondente.

Isso prejudica o acesso esperado ao conteúdo através da navegação da própria aplicação.

### Situação

⚠️ Defeito identificado e registrado durante o ciclo de QA.

---

# Validações técnicas

## Lint

Foi executado:

```bash
npm run lint
```

### Resultado

O lint foi concluído com:

```text
Found 1 warning and 0 errors.
```

Foi identificado o seguinte warning preexistente:

```text
react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders
```

Arquivo:

```text
src/pages/Locais/Locais.tsx
```

Trecho indicado:

```tsx
useEffect(() => {
  setPaginaAtual(1);
}, [categoriaSelecionada, recursosSelecionados]);
```

O warning não impede a execução da aplicação e não foi introduzido pela branch da Issue #84.

Como a correção desse comportamento não pertence ao escopo desta demanda de QA, nenhuma alteração foi realizada no código funcional.

**Resultado:** ⚠️ 0 erros e 1 warning.

---

## Build

Foi executado:

```bash
npm run build
```

### Resultado

✅ O build da aplicação foi concluído com sucesso, sem erros impeditivos.

---

## Evidência — Lint e Build

A execução dos comandos `npm run lint` e `npm run build` foi registrada no ambiente local de QA.

### Resultado observado

- `npm run lint` concluído com 0 erros e 1 warning;
- `npm run build` concluído com sucesso;
- nenhum erro impeditivo identificado durante as validações técnicas.

<p align="center">
  <img width="900" alt="Execução do lint e build da Issue 84" src="https://github.com/user-attachments/assets/cad8c2c0-d5d2-4c4c-a76c-8a21596bed8b" />
</p>

---

# Resultado dos critérios de aceite

- [x] Todas as rotas previstas foram acessadas durante os testes.
- [x] A navegação pode ser realizada sem depender do mouse.
- [x] O foco possui indicação visual durante a navegação.
- [x] A falha encontrada possui passos claros para reprodução.
- [x] As evidências dos testes foram registradas.
- [x] O ciclo foi executado no estado atual do projeto.
- [x] Build executado sem erro.
- [x] Lint executado sem erros impeditivos.
- [x] Acessibilidade e navegação por teclado foram verificadas.
- [x] Evidências visuais foram anexadas ao ciclo de testes.

---

# Resumo do ciclo

As rotas previstas foram acessadas e apresentaram funcionamento adequado durante os testes.

A navegação por teclado também foi validada, sendo possível percorrer e utilizar os principais elementos interativos sem depender exclusivamente do mouse. A indicação visual de foco permaneceu disponível durante a navegação.

A rota dinâmica de detalhes dos locais foi validada através dos links `Ver detalhes`, e uma rota inexistente apresentou corretamente a página NotFound.

Durante o ciclo foi identificado um defeito de navegação no Footer: o link destinado à página de acessibilidade direciona para `/sobre`, embora a rota `/acessibilidade` exista e funcione corretamente quando acessada diretamente.

O build foi concluído com sucesso. O lint apresentou 0 erros e 1 warning preexistente em `Locais.tsx`, fora do escopo desta demanda.

## Decisão do QA

**Ciclo de testes concluído com defeito identificado.**

O defeito encontrado foi documentado com passos de reprodução e não impede a conclusão da atividade de QA da Issue #84.