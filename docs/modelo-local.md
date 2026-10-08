# Modelo de dados Local — CP2

Responsável: Pedro Henrique Salvatore — RM 569497 — DEV — [@Pedro-H-Salvatore](https://github.com/Pedro-H-Salvatore).

## Objetivo e fonte de verdade

`Local` representa um estabelecimento ou serviço consultado pelo portal, com sua localização, categoria e recursos de acessibilidade informados. Esta documentação descreve a implementação atual; não define um contrato de API ou banco de dados ainda inexistente.

A fonte de verdade é [src/types/local.ts](../src/types/local.ts). Os exemplos usados pela aplicação estão em [src/data/locais.ts](../src/data/locais.ts), na constante `listaLocais: Local[]`.

## Estrutura implementada

```ts
export type Local = {
  id: number;
  nome: string;
  endereco: string;
  cep: string;
  categoria: Categoria;
  recursosAcessibilidade: RecursoAcessibilidade[];
};
```

| Campo | Tipo | Obrigatório na declaração | Finalidade e comportamento atual |
| --- | --- | --- | --- |
| `id` | `number` | Sim | Identifica o local na consulta de detalhes e na montagem de links. Os dados locais fornecem os IDs; o formulário não solicita nem gera esse campo. O tipo não garante unicidade nem número inteiro positivo. |
| `nome` | `string` | Sim | Nome exibido na listagem, nos destaques e nos detalhes. O cadastro rejeita texto vazio ou formado apenas por espaços. |
| `endereco` | `string` | Sim | Endereço apresentado ao visitante. É um texto único, sem campos separados de cidade, estado ou coordenadas. O cadastro rejeita texto vazio ou formado apenas por espaços. |
| `cep` | `string` | Sim | Código postal em texto, preservando zeros iniciais. Os dados locais incluem hífen; a validação do formulário exige oito dígitos sem hífen. |
| `categoria` | `Categoria` | Sim | Classifica o estabelecimento e permite filtrar a listagem. Aceita um dos cinco códigos definidos abaixo. |
| `recursosAcessibilidade` | `RecursoAcessibilidade[]` | Sim | Lista de códigos dos recursos informados para o local. Usada na exibição e nos filtros. Pode ser vazia; o formulário não exige selecionar um recurso. A declaração não impede códigos repetidos. |

Nenhuma propriedade tem `?`. Essa obrigatoriedade na declaração não é uma validação de conteúdo em execução: `string` admite texto vazio, arrays admitem listas vazias e TypeScript não valida automaticamente dados externos. Os recursos registrados também não constituem certificação de acessibilidade.

## Categoria

`Categoria` é uma união de literais de texto, não um `enum` nem uma string livre.

| Código | Significado |
| --- | --- |
| `restaurante` | Restaurante e estabelecimentos de alimentação |
| `saude` | Saúde |
| `educacao` | Educação |
| `lazer` | Lazer |
| `servico_publico` | Serviço público |

## RecursoAcessibilidade

Cada posição de `recursosAcessibilidade` deve usar um dos códigos abaixo. Os componentes convertem os códigos em rótulos para a interface.

| Código | Significado |
| --- | --- |
| `rampa_acesso` | Rampa de acesso |
| `banheiro_adaptado` | Banheiro adaptado |
| `piso_tatil` | Piso tátil |
| `sinalizacao_visual` | Sinalização visual |
| `vagas_estacionamento` | Vagas de estacionamento acessíveis |
| `braile` | Informações ou material em braile |
| `libras` | Atendimento em Libras |
| `elevador` | Elevador acessível |
| `balcao_acessivel` | Balcão acessível |
| `assentos_prioritarios` | Assentos prioritários |
| `espaco_tranquilo` | Espaço tranquilo |
| `cao_guia` | Entrada permitida para cão-guia |

## Exemplo existente nos dados locais

O objeto abaixo corresponde ao primeiro item de `listaLocais`. É um dado de demonstração, não uma declaração de verificação do estabelecimento.

```ts
import type { Local } from './src/types/local'; // Exemplo situado na raiz.

const exemplo: Local = {
  id: 1,
  nome: 'Restaurante Sabor & Inclusão',
  endereco: 'Rua das Flores, 120 - Centro',
  cep: '01001-000',
  categoria: 'restaurante',
  recursosAcessibilidade: [
    'rampa_acesso',
    'banheiro_adaptado',
    'balcao_acessivel',
    'braile',
  ],
};
```

O CEP do exemplo é compatível com `Local` e com a fonte de dados, mas não passa na validação atual do formulário. Para digitar esse CEP no cadastro, use `01001000`. Não existe normalização automática entre os dois formatos.

## Uso na aplicação

| Arquivo | Uso do modelo |
| --- | --- |
| [Dados locais](../src/data/locais.ts) | Declara `listaLocais: Local[]`, a fonte local dos estabelecimentos. |
| [Página inicial](../src/pages/Inicio/Inicio.tsx) | Consulta diretamente os dados locais para destaques e busca. |
| [Serviço de listagem](../src/services/locaisService.ts) | `listarLocais(): Promise<Local[]>` retorna a lista local; é o serviço importado pela página de listagem. |
| [Listagem](../src/pages/Locais/Locais.tsx) | Consome a lista de locais e apresenta os resultados. |
| [Filtros](../src/utils/filtrarLocais.ts) | Recebe `Local[]`, `Categoria \| ''` e `RecursoAcessibilidade[]`; retorna `Local[]`. Categoria vazia não restringe o resultado. Todos os recursos selecionados devem estar presentes no local. |
| [LocalCard](../src/components/LocalCard/LocalCard.tsx) | Recebe `local: Local` e exibe nome, endereço, CEP e recursos. `detalhesUrl?: string` pertence às propriedades do componente, não ao modelo. |
| [Serviço de consulta](../src/services/locais-consulta.ts) | Oferece listagem com simulações de falha e `buscarLocalPorId(id: string): Promise<Local \| null>`, usado nos detalhes. A busca compara o ID numérico convertido para texto e retorna `null` se não encontrar. |
| [Detalhes](../src/pages/DetalhesLocal/DetalhesLocal.tsx) | Consulta o local pelo parâmetro da rota `/locais/:id`. O parâmetro textual da URL não altera o tipo numérico de `Local.id`. |
| [Cadastro](../src/pages/Cadastro/Cadastro.tsx) | Usa um tipo derivado para editar os campos. O envio é simulado; não insere objetos em `listaLocais`, em uma API ou em banco de dados. |

### Tipos específicos do formulário

```ts
type DadosFormulario = Omit<Local, 'id' | 'categoria'> & {
  categoria: Categoria | ''
}

type ErrosFormulario = Partial<Record<keyof DadosFormulario, string>>
```

- `Omit` reaproveita os campos de `Local`, removendo `id` e a declaração original de `categoria`.
- `categoria: ''` representa a opção ainda não selecionada e só é admitida no formulário, não no modelo `Local`.
- `ErrosFormulario` permite associar uma mensagem de erro aos campos que falharam na validação.
- Nome e endereço são verificados com `trim()` para detectar ausência de conteúdo; isso não significa que os valores armazenados no estado sejam normalizados.
- A função [validarCep](../src/utils/validacoes.ts) aceita exatamente oito dígitos (`/^\d{8}$/`). Não consulta a existência do CEP.

## Limites do modelo atual

Não existem campos de imagem, telefone, avaliação, latitude, longitude, proprietário ou data de cadastro em `Local`. Não devem ser documentados como implementados. Também não há validação automática completa de objetos recebidos de uma futura API: tipagem estática e validação de dados em execução são responsabilidades diferentes.

Ao alterar a definição, atualizar esta documentação e conferir os dados de demonstração, os filtros, o formulário e os mapas de rótulos dos componentes.

