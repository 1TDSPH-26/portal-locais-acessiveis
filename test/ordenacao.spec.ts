import { expect, test } from '@playwright/test'

// Primeira página (4 cards) de cada ordenação, com os dados de src/data/locais.ts.
const ORDEM_ORIGINAL = [
  'Restaurante Sabor & Inclusão',
  'Café Horizonte',
  'Centro de Saúde Vila Nova',
  'Clínica Bem-Estar',
]

const ORDEM_A_Z = [
  'Biblioteca Comunitária Leitura Livre',
  'Café Horizonte',
  'Centro Cultural Aberto',
  'Centro de Saúde Vila Nova',
]

const ORDEM_Z_A = [
  'Unidade de Atendimento Municipal',
  'Restaurante Sabor & Inclusão',
  'Poupatempo Cidadania',
  'Parque das Águas',
]

test('troca de ordenação reorganiza os cards da listagem', async ({
  page,
}) => {
  await page.goto('/locais')

  const seletor = page.getByRole('combobox', { name: 'Ordenar por' })
  const titulos = page
    .getByRole('region', { name: 'Locais encontrados' })
    .getByRole('heading', { level: 2 })

  await expect(seletor).toHaveValue('original')
  await expect(titulos).toHaveText(ORDEM_ORIGINAL)

  await seletor.selectOption('nome-asc')
  await expect(titulos).toHaveText(ORDEM_A_Z)

  await seletor.selectOption('nome-desc')
  await expect(titulos).toHaveText(ORDEM_Z_A)

  await seletor.selectOption('original')
  await expect(titulos).toHaveText(ORDEM_ORIGINAL)
})
