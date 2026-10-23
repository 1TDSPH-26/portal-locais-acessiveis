# Ciclo de QA — Issue #216

**Demanda:** [#216 — Validar geolocalização, distância e tratamento de permissão](https://github.com/1TDSPH-26/portal-locais-acessiveis/issues/216)  
**Responsável:** @EnzoNukui  
**Data do registro:** 23/10/2026  
**Situação:** Parcial — validação da infraestrutura concluída; testes integrados da listagem pendentes.

## Contexto e escopo

A Issue #216 solicita validar a geolocalização integrada à listagem do Portal de Locais Acessíveis, incluindo permissão concedida e negada, apresentação e formatação de distâncias nos cartões, ordenação por proximidade, acessibilidade e ausência de erros não tratados.

Esta entrega documenta as verificações **já realizadas** no ciclo de QA da [PR #247](https://github.com/1TDSPH-26/portal-locais-acessiveis/pull/247), relacionada à infraestrutura de geolocalização (Issue #175). **Não equivale à aprovação dos fluxos integrados exigidos pela Issue #216.**

## Validações já executadas — base de geolocalização

| ID | Cenário | Resultado | Evidência / observação |
|---|---|---|---|
| QA01 | Solicitação de geolocalização somente após ação do usuário | Aprovado | Teste no navegador e Vitest |
| QA02 | Estado `solicitando` e solicitação de permissão | Aprovado | Teste no navegador |
| QA03 | Permissão concedida, coordenadas e estado `sucesso` | Aprovado | Teste no navegador e Vitest |
| QA04 | Cálculo de distância Haversine, incluindo casos conhecidos e extremos | Aprovado | Vitest |
| QA05 | Permissão negada e retorno do estado `erro` no hook | Aprovado | Vitest com simulação da API |
| QA06 | API não disponível e estado `indisponivel` | Aprovado | Vitest |
| QA07 | Nova solicitação após erro | Aprovado | Vitest |
| QA08 | Ausência de gravação em `localStorage` durante o fluxo do hook testado | Aprovado | Vitest |
| QA09 | Testes complementares de QA | Aprovado | 10/10 |
| QA10 | `npm run test`, `npm run lint` e `npm run build` da PR #247 | Aprovado | Execução local relatada no ciclo da #247 |

### Evidências da base de geolocalização

**Solicitação de localização no navegador**

<p align="center"><img width="950" alt="Solicitação de permissão de geolocalização" src="https://github.com/user-attachments/assets/0623560a-992c-4cf3-82d8-d4464e2b500a" /></p>

**Coordenadas obtidas e distância aproximada**

<p align="center"><img width="850" alt="Estado de sucesso com coordenadas e distância" src="https://github.com/user-attachments/assets/c602f6ee-c6d6-4c8f-a6fe-3cab5ccdbac5" /></p>

**Testes complementares automatizados**

<p align="center"><img width="950" alt="Resultado dos testes automatizados com Vitest" src="https://github.com/user-attachments/assets/20d837ae-49a6-4fc3-b0d8-47ad2bb75df6" /></p>

## Validações integradas pendentes — Issue #216

- [ ] Com permissão concedida, conferir distâncias dos cartões `LocalCard` e formatação em `m` e `km`.
- [ ] Verificar opção **Mais próximos** e ordem efetiva de distância dos locais.
- [ ] Repetir os testes com coordenadas fixas simuladas pelos sensores do DevTools.
- [ ] Com permissão negada, conferir aviso amigável na interface integrada, sem travamento.
- [ ] Com permissão negada, verificar buscas e filtros da listagem.
- [ ] Conferir o console para ausência de erros JavaScript não tratados.
- [ ] Validar foco visível, navegação por teclado e anúncios para tecnologias assistivas.
- [ ] Executar `npm run test`, `npm run lint` e `npm run build` na **branch integrada** das funcionalidades de proximidade.
- [ ] Anexar evidências da listagem com distâncias, ordenação e estados de permissão.

## Análise técnica e limites

A validação efetuada na PR #247 demonstrou o funcionamento isolado do hook `useGeolocation`, do cálculo Haversine e do tratamento de estados. As coordenadas dos locais são representativas, e a distância calculada é linear — não representa trajetos por ruas ou calçadas.

Não foram verificados nesta entrega os requisitos finais de distância exibida nos cartões e ordenação dinâmica, porque esses fluxos não integravam o escopo da PR #247. Os testes do hook **não comprovam** que avisos de interface, filtros e ordenação funcionam corretamente após integração.

## Parecer do QA

**Resultado: validação parcial / integração pendente.**

A infraestrutura de geolocalização analisada na PR #247 foi aprovada nos testes descritos. **A Issue #216 ainda não pode ser declarada integralmente aprovada**: os critérios relacionados à listagem, aos avisos acessíveis e à integração devem ser testados antes de seu encerramento.

Esta PR entrega a documentação do progresso de QA disponível até a data da entrega, preservando a rastreabilidade dos testes concluídos e das pendências.
