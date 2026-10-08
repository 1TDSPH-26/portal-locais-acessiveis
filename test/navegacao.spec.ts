import { expect, test } from '@playwright/test'

test('menu permite navegar entre as páginas', async ({
  page,
  isMobile,
}) => {
  await page.goto('/')

  const destinos = [
    ['Locais', '/locais', 'Locais acessíveis'],
    ['Cadastro', '/cadastrar', 'Cadastro de local'],
    ['Sobre', '/sobre', 'Sobre o Lugares Acessíveis'],
    ['Home', '/', 'Saber antes de sair de casa.'],
  ]

  for (const [nome, caminho, titulo] of destinos) {
    if (isMobile) {
      await page.getByRole('button', { name: 'Abrir menu' }).click()
    }

    const menu = page.getByRole('navigation', {
      name: isMobile ? 'Navegação móvel' : 'Navegação principal',
      exact: true,
    })

    await menu.getByRole('link', { name: nome, exact: true }).click()

    await expect(page).toHaveURL(caminho)

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: titulo,
        exact: true,
      }),
    ).toBeVisible()

    if (isMobile) {
      await expect(menu).toHaveCount(0)
    } else {
      await expect(
        menu.getByRole('link', { name: nome, exact: true }),
      ).toHaveAttribute('aria-current', 'page')
    }
  }
})

const atalhos = [
  ['Ver todos os locais', '/locais', 'Locais acessíveis'],
  ['Cadastrar local', '/cadastrar', 'Cadastro de local'],
  ['Sobre o projeto', '/sobre', 'Sobre o Lugares Acessíveis'],
]

for (const [nome, caminho, titulo] of atalhos) {
  test(`atalho da Home: ${nome}`, async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: nome, exact: true }).click()

    await expect(page).toHaveURL(caminho)

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: titulo,
        exact: true,
      }),
    ).toBeVisible()
  })
}

test('listagem abre detalhes e permite retornar', async ({ page }) => {
  await page.goto('/locais')

  await page.getByRole('link', {
    name: 'Ver detalhes de Restaurante Sabor & Inclusão',
    exact: true,
  }).click()

  await expect(page).toHaveURL('/locais/1')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Restaurante Sabor & Inclusão',
    }),
  ).toBeVisible()

  await expect(
    page.getByText('Rua das Flores, 120 - Centro', { exact: true }),
  ).toBeVisible()

  await page.getByRole('link', {
    name: 'Voltar para a listagem',
  }).click()

  await expect(page).toHaveURL('/locais')

  await expect(
    page.getByRole('link', { name: /Ver detalhes/ }).first(),
  ).toBeVisible()
})

test('botões voltar e avançar do navegador preservam as rotas', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('link', {
    name: 'Cadastrar local',
    exact: true,
  }).click()

  await expect(page).toHaveURL('/cadastrar')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Cadastro de local' }),
  ).toBeVisible()

  await page.goBack()

  await expect(page).toHaveURL('/')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Saber antes de sair de casa.',
    }),
  ).toBeVisible()

  await page.goForward()

  await expect(page).toHaveURL('/cadastrar')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Cadastro de local' }),
  ).toBeVisible()
})

test('marca do portal retorna à Home', async ({ page }) => {
  await page.goto('/sobre')

  await page.getByRole('banner').getByRole('link', {
    name: 'Lugares Acessíveis',
    exact: true,
  }).click()

  await expect(page).toHaveURL('/')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Saber antes de sair de casa.',
    }),
  ).toBeVisible()
})

test('Tab e Enter permitem pular para o conteúdo principal', async ({
  page,
}) => {
  await page.goto('/')

  await page.keyboard.press('Tab')

  await expect(
    page.getByRole('link', {
      name: 'Pular para o conteúdo principal',
    }),
  ).toBeFocused()

  await page.keyboard.press('Enter')

  await expect(page.locator('#conteudo-principal')).toBeFocused()
  await expect(page).toHaveURL('/#conteudo-principal')
})

test('menu se adapta à tela e permite navegação por teclado', async ({
  page,
  isMobile,
}) => {
  await page.goto('/')

  const menuDesktop = page.getByRole('navigation', {
    name: 'Navegação principal',
    exact: true,
  })

  const abrirMenu = page.getByRole('button', { name: 'Abrir menu' })

  if (isMobile) {
    await expect(menuDesktop).toBeHidden()
    await expect(abrirMenu).toBeVisible()
  } else {
    await expect(menuDesktop).toBeVisible()
    await expect(abrirMenu).toBeHidden()
  }

  const destino = isMobile
    ? abrirMenu
    : menuDesktop.getByRole('link', { name: 'Locais', exact: true })

  // Procura o controle usando somente Tab.
  for (let tentativa = 0; tentativa < 12; tentativa++) {
    await page.keyboard.press('Tab')

    if (await destino.evaluate((elemento) => elemento.matches(':focus'))) {
      break
    }
  }

  await expect(destino).toBeFocused()
  await page.keyboard.press('Enter')

  if (isMobile) {
    const menuMobile = page.getByRole('navigation', {
      name: 'Navegação móvel',
    })

    await expect(menuMobile).toBeVisible()

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    await expect(
      menuMobile.getByRole('link', { name: 'Locais', exact: true }),
    ).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(menuMobile).toHaveCount(0)
  }

  await expect(page).toHaveURL('/locais')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Locais acessíveis' }),
  ).toBeVisible()
})

test('Escape fecha o menu móvel', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 727 })
  await page.goto('/')

  await page.getByRole('button', { name: 'Abrir menu' }).click()

  const menu = page.getByRole('navigation', {
    name: 'Navegação móvel',
  })

  await expect(menu).toBeVisible()

  await page.keyboard.press('Tab')

  await expect(
    menu.getByRole('link', { name: 'Home', exact: true }),
  ).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(menu).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Abrir menu' }),
  ).toHaveAttribute('aria-expanded', 'false')
})