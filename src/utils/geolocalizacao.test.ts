
import { describe, expect, it } from "vitest";
import { calcularDistanciaKm } from "./geolocalizacao";

describe("calcularDistanciaKm", () => {
  it("retorna zero para o mesmo ponto", () => {
    expect(calcularDistanciaKm(-23.5505, -46.6333, -23.5505, -46.6333))
      .toBe(0);
  });

  it("calcula aproximadamente 111,19 km para um grau de longitude no equador", () => {
    expect(calcularDistanciaKm(0, 0, 0, 1)).toBe(111.19);
  });

  it("calcula aproximadamente 111,19 km para um grau de latitude", () => {
    expect(calcularDistanciaKm(0, 0, 1, 0)).toBe(111.19);
  });

  it("calcula uma distância grande entre pontos opostos do globo", () => {
    expect(calcularDistanciaKm(0, 0, 0, 180)).toBe(20015.09);
  });

  it("retorna uma distância positiva entre São Paulo e Rio de Janeiro", () => {
    const distancia = calcularDistanciaKm(
      -23.5505,
      -46.6333,
      -22.9068,
      -43.1729,
    );

    expect(distancia).toBeGreaterThan(0);
    expect(distancia).toBeLessThan(500);
    expect(Number.isFinite(distancia)).toBe(true);
  });
});
