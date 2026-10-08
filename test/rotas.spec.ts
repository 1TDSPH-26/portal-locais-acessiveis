import { expect, test } from '@playwright/test'

const rotas = [
  { caminho: '/', titulo: 'Saber antes de sair de casa.' },
  { caminho: '/locais', titulo: 'Locais acessíveis' },
  { caminho: '/cadastrar', titulo: 'Cadastro de local' },
  { caminho: '/sobre', titulo: 'Sobre o Lugares Acessíveis' },
  {
    caminho: '/acessibilidade',
    titulo: 'Declaração de acessibilidade',
  },
  {
    caminho: '/locais/1',
    titulo: 'Restaurante Sabor & Inclusão',
  },
]

for (const { caminho, titulo } of rotas) {
  test(`abre e recarrega a página ${caminho}`, async ({ page }) => {
    const erros: string[] = []

    page.on('pageerror', (erro) => {
      erros.push(erro.message)
    })

    await page.goto(caminho)

    await expect(page).toHaveURL(caminho)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: titulo,
        exact: true,
      }),
    ).toBeVisible()

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()

    await page.reload()

    await expect(page).toHaveURL(caminho)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: titulo,
        exact: true,
      }),
    ).toBeVisible()

    expect(erros).toEqual([])
  })
}

test('página inexistente mostra 404 e permite voltar à Home', async ({
  page,
}) => {
  await page.goto('/pagina-inexistente-cp2')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Erro 404',
    }),
  ).toBeVisible()

  await page
    .locator('#conteudo-principal')
    .getByRole('link', { name: 'HOME', exact: true })
    .click()

  await expect(page).toHaveURL('/')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Saber antes de sair de casa.',
    }),
  ).toBeVisible()
})

for (const id of ['999999', 'invalido']) {
  test(`local não encontrado: ${id}`, async ({ page }) => {
    await page.goto(`/locais/${id}`)

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Local não encontrado',
      }),
    ).toBeVisible()

    await page
      .getByRole('link', { name: 'Voltar para a listagem' })
      .click()

    await expect(page).toHaveURL('/locais')

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Locais acessíveis',
      }),
    ).toBeVisible()

    await expect(
      page.getByRole('link', { name: /Ver detalhes/ }).first(),
    ).toBeVisible()
  })
}