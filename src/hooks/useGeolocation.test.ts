
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGeolocation } from "./useGeolocation";

describe("useGeolocation", () => {
  const getCurrentPosition = vi.fn();

  beforeEach(() => {
    getCurrentPosition.mockReset();

    vi.stubGlobal("navigator", {
      geolocation: {
        getCurrentPosition,
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("inicia no estado ocioso sem solicitar localização automaticamente", () => {
    const { result } = renderHook(() => useGeolocation());

    expect(result.current.status).toBe("ocioso");
    expect(result.current.coordenadas).toBeNull();
    expect(result.current.erro).toBeUndefined();
    expect(getCurrentPosition).not.toHaveBeenCalled();
  });

  it("retorna as coordenadas quando a localização é obtida", () => {
    getCurrentPosition.mockImplementation(
      (sucesso: PositionCallback) => {
        sucesso({
          coords: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
        } as GeolocationPosition);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.solicitarLocalizacao();
    });

    expect(result.current.status).toBe("sucesso");
    expect(result.current.coordenadas).toEqual({
      latitude: -23.5505,
      longitude: -46.6333,
    });
    expect(result.current.erro).toBeUndefined();
  });

  it("define o estado solicitando enquanto aguarda a resposta", () => {
    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.solicitarLocalizacao();
    });

    expect(result.current.status).toBe("solicitando");
    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it("trata erros retornados pela API", () => {
    getCurrentPosition.mockImplementation(
      (
        _sucesso: PositionCallback,
        falha: PositionErrorCallback,
      ) => {
        falha({
          code: 1,
          message: "Permissão negada",
        } as GeolocationPositionError);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.solicitarLocalizacao();
    });

    expect(result.current.status).toBe("erro");
    expect(result.current.erro?.message).toBe("Permissão negada");
  });

  it("trata ambientes sem suporte à geolocalização", () => {
    vi.stubGlobal("navigator", {});

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.solicitarLocalizacao();
    });

    expect(result.current.status).toBe("indisponivel");
    expect(result.current.coordenadas).toBeNull();
    expect(result.current.erro).toBeInstanceOf(Error);
    expect(getCurrentPosition).not.toHaveBeenCalled();
  });

  it("trata exceções lançadas durante a solicitação", () => {
    getCurrentPosition.mockImplementation(() => {
      throw new Error("Falha inesperada");
    });

    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.solicitarLocalizacao();
    });

    expect(result.current.status).toBe("erro");
    expect(result.current.erro?.message).toBe("Falha inesperada");
  });
});
