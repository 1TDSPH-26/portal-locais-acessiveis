
const RAIO_TERRA_KM = 6371;

export function calcularDistanciaKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const paraRadianos = (graus: number): number =>
    (graus * Math.PI) / 180;

  const latitude1 = paraRadianos(lat1);
  const latitude2 = paraRadianos(lat2);
  const diferencaLatitude = paraRadianos(lat2 - lat1);
  const diferencaLongitude = paraRadianos(lon2 - lon1);

  const a =
    Math.sin(diferencaLatitude / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(diferencaLongitude / 2) ** 2;

  const valorLimitado = Math.min(1, Math.max(0, a));
  const angulo = 2 * Math.atan2(
    Math.sqrt(valorLimitado),
    Math.sqrt(1 - valorLimitado),
  );

  const distancia = RAIO_TERRA_KM * angulo;

  return Number(distancia.toFixed(2));
}
