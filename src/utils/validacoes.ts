export function validarCep(cep: string): boolean {
  const somenteNumeros = cep.replace(/\D/g, '')

  return somenteNumeros.length === 8
}