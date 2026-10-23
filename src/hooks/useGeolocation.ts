
import { useState } from "react";

export type StatusGeolocalizacao =
  | "ocioso"
  | "solicitando"
  | "sucesso"
  | "erro"
  | "indisponivel";

export type Coordenadas = {
  latitude: number;
  longitude: number;
};

type ResultadoGeolocalizacao = {
  coordenadas: Coordenadas | null;
  status: StatusGeolocalizacao;
  erro?: Error;
  solicitarLocalizacao: () => void;
};

export function useGeolocation(): ResultadoGeolocalizacao {
  const [coordenadas, setCoordenadas] =
    useState<Coordenadas | null>(null);

  const [status, setStatus] =
    useState<StatusGeolocalizacao>("ocioso");

  const [erro, setErro] = useState<Error | undefined>(undefined);

  function solicitarLocalizacao(): void {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      setStatus("indisponivel");
      setErro(
        new Error("A geolocalização não está disponível neste ambiente."),
      );
      return;
    }

    setStatus("solicitando");
    setErro(undefined);

    try {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          setCoordenadas({
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude,
          });
          setStatus("sucesso");
          setErro(undefined);
        },
        (erroGeolocalizacao) => {
          setStatus("erro");
          setErro(
            new Error(
              erroGeolocalizacao.message ||
                "Não foi possível obter a localização.",
            ),
          );
        },
      );
    } catch (erroDesconhecido) {
      setStatus("erro");
      setErro(
        erroDesconhecido instanceof Error
          ? erroDesconhecido
          : new Error("Ocorreu um erro ao solicitar a localização."),
      );
    }
  }

  return {
    coordenadas,
    status,
    erro,
    solicitarLocalizacao,
  };
}
