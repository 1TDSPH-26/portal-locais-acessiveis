export function validarCep(cep: string): boolean {
  return /^\d{8}$/.test(cep)
}