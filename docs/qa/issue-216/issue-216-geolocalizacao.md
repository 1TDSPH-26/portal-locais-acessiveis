# Ciclo de QA — Geolocalização, distância e tratamento de permissão

**Issue:** [#216 — Validar geolocalização, distância e tratamento de permissão](https://github.com/1TDSPH-26/portal-locais-acessiveis/issues/216)  
**Pull Request de QA:** [#260](https://github.com/1TDSPH-26/portal-locais-acessiveis/pull/260)  
**Implementação de referência:** [PR #247 — Infraestrutura de geolocalização](https://github.com/1TDSPH-26/portal-locais-acessiveis/pull/247)  
**QA responsável:** @EnzoNukui  
**Data:** 23/10/2026  
**Branch avaliada:** `qa/216-geolocalizacao-distancia-permissoes`, atualizada com `develop`  
**Decisão:** **BLOQUEADO POR DEPENDÊNCIAS DE DESENVOLVIMENTO**

## 1. Contexto e objetivo

Validar as funcionalidades de geolocalização e proximidade do Portal de Locais Acessíveis, incluindo solicitação e tratamento de permissões, cálculo Haversine, distância apresentada nos cartões em metros e quilômetros, ordenação por “Mais próximos”, filtros após a negação de permissão, ausência de erros não tratados e acessibilidade.

A versão avaliada contém a infraestrutura de geolocalização, mas **não apresenta na interface** a solicitação de localização, os indicadores de distância nos cartões nem a ordenação por proximidade. Por isso, foi possível testar a infraestrutura com simulações automatizadas, mas não os fluxos integrados previstos na Issue #216.

O bloqueio descreve **dependências de funcionalidades ausentes**, não reprovação automática do hook ou do cálculo matemático.

## 2. Ambiente de teste

- **Sistema operacional:** Windows
- **Navegador:** Google Chrome
- **Aplicação:** React, TypeScript e Vite
- **Framework de testes:** Vitest e React Testing Library
- **Execução:** local, em `http://localhost:5173`
- **Página examinada:** `/locais`
- **Branch:** `qa/216-geolocalizacao-distancia-permissoes`
- **Base incorporada:** `develop` (merge local observado no commit `6ff6025`)

### Validações técnicas executadas

| Comando | Resultado |
| --- | --- |
| `npm run test` | **Aprovado** — quantidade total não registrada |
| `npm run lint` | **Aprovado** |
| `npm run build` | **Aprovado** |
| `npx vitest run src/geolocalizacao.qa.test.tsx` | **Aprovado — 14/14 testes, 0 falhas** |

O arquivo `src/geolocalizacao.qa.test.tsx` foi criado apenas para os testes complementares e removido após a execução, conforme informado pelo QA. **Não integra a entrega da PR #260.**

## 3. Pré-condições e dados utilizados

1. Repositório na branch de QA, com atualizações da `develop` incorporadas.
2. Dependências disponíveis e aplicação iniciada pelo Vite.
3. Infraestrutura `useGeolocation` e `calcularDistanciaKm` presente no código.
4. Testes complementares executados com simulações da API `navigator.geolocation`.
5. Página `/locais` aberta para inspeção dos controles existentes.

**Dados de referência:** São Paulo (`-23.5505`, `-46.6333`), Rio de Janeiro (`-22.9068`, `-43.1729`), pontos idênticos, um grau no Equador e pontos opostos. Foram examinadas coordenadas dos locais presentes em `listaLocais` quando disponibilizadas.

**Estados simulados no hook:** `ocioso`, `solicitando`, `sucesso`, `erro` e `indisponivel`.

> **Limite da evidência:** a aprovação dos testes com mocks confirma a lógica do hook nos cenários testados. Não comprova permissões reais do navegador, experiência de leitor de tela ou comportamento dos controles integrados, pois não estavam disponíveis na interface.

## 4. Plano e resultados dos testes automatizados

Todos os 14 cenários abaixo foram executados no arquivo temporário de QA e constam como aprovados na evidência **EV01**.

| ID | Cenário e procedimento | Resultado esperado | Resultado obtido | Status |
| --- | --- | --- | --- | --- |
| CT01 | Calcular Haversine entre dois pontos idênticos | `0 km` | `0 km` | **Aprovado** |
| CT02 | Calcular 1° de longitude no Equador | Aproximadamente `111,19 km` | Valor dentro da referência | **Aprovado** |
| CT03 | Calcular entre `(0, 0)` e `(0, 180)` | Aproximadamente `20.015,09 km` | Valor dentro da referência | **Aprovado** |
| CT04 | Inverter origem e destino entre São Paulo e Rio de Janeiro | Distâncias iguais | Simetria confirmada | **Aprovado** |
| CT05 | Calcular com coordenadas extremas | Número finito e não negativo | Resultado válido | **Aprovado** |
| CT06 | Conferir arredondamento da distância | Até duas casas decimais | Precisão validada | **Aprovado** |
| CT07 | Percorrer locais com coordenadas | Latitude entre -90 e 90; longitude entre -180 e 180 | Coordenadas avaliadas dentro dos limites | **Aprovado** |
| CT08 | Calcular distâncias para locais com coordenadas | Valores finitos e não negativos | Cálculos válidos | **Aprovado** |
| CT09 | Montar o hook sem solicitar localização | Estado `ocioso`, coordenadas nulas e nenhuma chamada automática pelo **hook isolado** | Comportamento confirmado | **Aprovado** |
| CT10 | Chamar `solicitarLocalizacao()` | Uma chamada à API e estado `solicitando` | Comportamento confirmado | **Aprovado** |
| CT11 | Simular retorno de permissão concedida | Estado `sucesso` e coordenadas retornadas | Comportamento confirmado | **Aprovado** |
| CT12 | Simular permissão negada | Estado `erro` e mensagem disponível | Comportamento confirmado | **Aprovado** |
| CT13 | Remover a API simulada do navegador | Estado `indisponivel` e informação de erro | Comportamento confirmado | **Aprovado** |
| CT14 | Simular falha seguida de nova solicitação bem-sucedida | Recuperação para `sucesso` | Recuperação confirmada | **Aprovado** |

### Síntese

- **Cálculo de distâncias:** 6/6 aprovados.
- **Dados geográficos:** 2/2 aprovados.
- **Hook de geolocalização:** 6/6 aprovados.
- **Total complementar:** 14/14 aprovados, 0 falhas; execução de aproximadamente 1,09 segundo.

## 5. Inspeção da interface e cenários bloqueados

A página `/locais` abriu normalmente e apresentou **10 locais encontrados**, busca, filtros de categoria e acessibilidade, cartões, ordenação existente e paginação. Na versão avaliada, não foram encontrados controles integrados de localização nem opções de proximidade (**EV02**).

Os cenários abaixo foram classificados como **bloqueados por dependência**, sem simular ou declarar resultados que não puderam ser obtidos.

### CT15 — Solicitação de geolocalização na interface

**Procedimento:** abrir `/locais` e procurar o controle de localização ou a solicitação de permissão do navegador.  
**Resultado esperado:** fluxo de obtenção de localização utilizável e compreensível.  
**Resultado obtido:** não havia controle ou solicitação de localização na versão avaliada.  
**Status:** **BLOQUEADO POR DEPENDÊNCIA**.

### CT16 — Exibição de distância nos cartões

**Procedimento:** inspecionar os cartões da listagem para identificar badges de distância.  
**Resultado esperado:** distância aproximada em `m` ou `km` quando houver coordenadas válidas e permissão.  
**Resultado obtido:** nenhum indicador de distância disponível nos cartões.  
**Status:** **BLOQUEADO POR DEPENDÊNCIA**.

### CT17 — Ordenação por “Mais próximos”

**Procedimento:** inspecionar as opções do seletor de ordenação.  
**Resultado esperado:** opção “Mais próximos” e ordenação correta por distância.  
**Resultado obtido:** a opção não estava disponível; não foi possível verificar a ordem por proximidade.  
**Status:** **BLOQUEADO POR DEPENDÊNCIA**.

### CT18 — Permissão negada e mensagem orientativa

**Procedimento previsto:** negar permissão de localização no navegador e observar a mensagem exibida.  
**Resultado esperado:** aviso claro, sem bloquear a navegação.  
**Resultado obtido:** fluxo não executável, porque a geolocalização não estava integrada à página.  
**Status:** **BLOQUEADO POR DEPENDÊNCIA**.

### CT19 — Busca e filtros após negação de permissão

**Procedimento previsto:** negar localização, aplicar filtros e pesquisar locais.  
**Resultado esperado:** busca e filtros funcionais após o erro.  
**Resultado obtido:** o estado de permissão negada não pôde ser reproduzido na interface; **não foi validado o fluxo combinado**.  
**Status:** **BLOQUEADO POR DEPENDÊNCIA**.

### CT20 — Console durante solicitações de localização

**Procedimento previsto:** observar o console ao conceder, negar e repetir solicitações.  
**Resultado esperado:** nenhuma exceção JavaScript não tratada.  
**Resultado obtido:** o fluxo de localização não estava disponível; não há evidência de execução desse teste na interface.  
**Status:** **BLOQUEADO POR DEPENDÊNCIA**.

### CT21 — Acessibilidade dos controles integrados

**Procedimento previsto:** verificar navegação por teclado, foco, texto de distância e avisos para tecnologias assistivas.  
**Resultado esperado:** controles operáveis, informações acessíveis e anúncios adequados.  
**Resultado obtido:** os elementos específicos de geolocalização não existiam na interface avaliada.  
**Status:** **BLOQUEADO POR DEPENDÊNCIA**.

## 6. Critérios de aceite — Issue #216

| Critério | Resultado | Justificativa |
| --- | --- | --- |
| Permissão concedida apresenta distâncias coerentes e ordenação por proximidade | **Bloqueado** | Fluxos não integrados à interface |
| Permissão negada apresenta aviso e preserva a utilização do portal | **Bloqueado** | Não foi possível reproduzir a negação na interface |
| Distâncias e avisos acessíveis a tecnologias assistivas | **Bloqueado** | Elementos indisponíveis para teste |
| Console sem erros não tratados durante geolocalização | **Bloqueado** | Fluxo integrado indisponível |
| `npm run test`, `npm run lint` e `npm run build` | **Aprovado** | Comandos executados com sucesso |
| Relatório de testes, evidências e parecer técnico | **Documentado** | Este relatório reúne a execução e os impedimentos |

## 7. Análise técnica

**Aspectos validados:** a função Haversine apresentou resultados esperados nos casos avaliados. O hook de geolocalização respondeu corretamente à solicitação explícita, aos callbacks simulados de sucesso e erro, à ausência da API e a uma tentativa posterior à falha. Os dados geográficos examinados produziram distâncias válidas.

**Limites técnicos:** testes do hook isolado não garantem que uma página não o invoque automaticamente. A inspeção da interface não demonstrou nenhum mecanismo de solicitação. Também não se deve confundir distância linear Haversine com distância percorrida por ruas, calçadas ou rotas acessíveis.

**Dependências não disponíveis na versão avaliada:** badges de distância, ordenação por proximidade, mensagens de orientação de permissão e controles acessíveis desses fluxos. Essas ausências impedem concluir integralmente a demanda de QA, independentemente do êxito dos testes unitários.

## 8. Defeitos e pendências

| ID | Registro | Impacto | Classificação |
| --- | --- | --- | --- |
| DEP01 | Distâncias não exibidas nos cartões | Impede aferir apresentação e formatação `m`/`km` | Dependência de implementação |
| DEP02 | Ordenação “Mais próximos” indisponível | Impede conferir priorização por distância | Dependência de implementação |
| DEP03 | Fluxo de permissão não integrado | Impede avaliar avisos, filtros após negação e console no fluxo | Dependência de implementação |
| DEP04 | Recursos acessíveis de geolocalização ausentes | Impede testar foco, teclado e anúncios específicos | Dependência de implementação |

**Defeitos identificados na infraestrutura testada:** nenhum nos 14 cenários automatizados executados. Isso não equivale à aprovação das funcionalidades não disponíveis.

## 9. Evidências dos testes

### EV01 — Testes automatizados complementares de geolocalização

**Objetivo:** comprovar os resultados da execução do arquivo temporário `src/geolocalizacao.qa.test.tsx`.

**Cenários relacionados:** CT01 a CT14.

**O que a captura mostra:** execução do Vitest com as seções de cálculo de distâncias (6 testes), dados geográficos (2 testes) e hook de geolocalização (6 testes). O resumo do terminal indica **1 arquivo aprovado, 14 testes aprovados e nenhuma falha**.

<p align="center">
  <img width="950" alt="Terminal Vitest: 14 testes complementares de geolocalização aprovados" src="https://github.com/user-attachments/assets/388c7338-3b4f-46e3-b9bd-48eb1acbb81e" />
</p>

**Conclusão:** infraestrutura de cálculo e tratamento de estados aprovada nas condições simuladas.

---

### EV02 — Listagem sem as funcionalidades de proximidade integradas

**Objetivo:** registrar o estado da interface de `/locais` no momento do QA.

**Cenários relacionados:** CT15 a CT21.

**O que a captura mostra:** listagem com **10 locais encontrados**, campo de busca, filtros, seletor de ordenação existente, cartões e paginação. Não aparecem controle de solicitação de localização, badges com distância ou opção “Mais próximos”.

<p align="center">
  <img width="950" alt="Página Locais exibindo cartões e filtros, sem controles de geolocalização, distâncias ou ordenação por proximidade" src="https://github.com/user-attachments/assets/f65d1ac2-7036-49bb-971b-c4b90873cbc7" />
</p>

**Conclusão:** impossibilidade de executar os fluxos integrados exigidos pela Issue #216 na versão avaliada.

---

**Nota de rastreabilidade:** as duas evidências são suficientes para demonstrar os resultados dos testes automatizados e a ausência visível das funcionalidades de proximidade. Não são apresentadas como comprovação de testes integrados que não puderam ser executados.

## 10. Resumo e decisão final do QA

### Resultados consolidados

| Grupo | Resultado |
| --- | --- |
| Testes complementares de QA | **14 aprovados / 0 falhas** |
| `npm run test` | **Aprovado** |
| `npm run lint` | **Aprovado** |
| `npm run build` | **Aprovado** |
| Cenários integrados CT15–CT21 | **7 bloqueados por dependência** |

### Parecer

- [ ] Aprovado
- [ ] Aprovado com ressalva
- [ ] Reprovado
- [x] **Bloqueado por dependências**

**Justificativa:** os testes automatizados confirmaram o funcionamento da infraestrutura de geolocalização, cálculos Haversine e tratamento de estados simulados. Entretanto, a versão avaliada não disponibilizava os componentes necessários para testar distância nos cartões, ordenação por proximidade, permissões e acessibilidade na interface. Assim, **não há evidência suficiente para declarar todos os critérios de aceite da Issue #216 atendidos**.

**Decisão final:** **QA parcialmente executado — infraestrutura aprovada; validação integrada bloqueada**. Este relatório encerra o registro das verificações possíveis na versão disponibilizada, sem atestar as funcionalidades ausentes.
