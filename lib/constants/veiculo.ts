import { Car, Bike, Sailboat, Truck, CarFront, Package, type LucideIcon } from "lucide-react";
import type { TipoVeiculo, TipoCombustivel } from "@prisma/client";

export const TIPO_VEICULO_LABELS: Record<TipoVeiculo, string> = {
  CARRO: "Carro",
  MOTO: "Moto",
  JET_SKI: "Jet Ski",
  CAMINHONETE: "Caminhonete",
  SUV: "SUV",
  UTILITARIO: "Utilitário",
};

export const TIPO_VEICULO_ICONS: Record<TipoVeiculo, LucideIcon> = {
  CARRO: Car,
  MOTO: Bike,
  JET_SKI: Sailboat,
  CAMINHONETE: Truck,
  SUV: CarFront,
  UTILITARIO: Package,
};

export const TIPO_VEICULO_OPTIONS = Object.entries(TIPO_VEICULO_LABELS).map(
  ([value, label]) => ({ value: value as TipoVeiculo, label })
);

export const COMBUSTIVEL_LABELS: Record<TipoCombustivel, string> = {
  GASOLINA: "Gasolina",
  ETANOL: "Etanol",
  DIESEL: "Diesel",
  FLEX: "Flex",
  HIBRIDO: "Híbrido",
  ELETRICO: "Elétrico",
};

export const COMBUSTIVEL_OPTIONS = Object.entries(COMBUSTIVEL_LABELS).map(
  ([value, label]) => ({ value: value as TipoCombustivel, label })
);
