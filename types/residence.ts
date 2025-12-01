// types/residence.ts

export type LocalType = 'SYNDIC' | 'TECHNIQUE' | 'JARDIN' | 'LOGE' | 'AUTRE';

export interface EtageConfig {
  numero: number;
  label: string; // ex: "RDC", "1er", "Sous-sol"
  nbApparts: number;
}

export interface Immeuble {
  id: string;
  nom: string; // ex: "Bloc A"
  etages: EtageConfig[]; 
}

export interface Tranche {
  id: string;
  nom: string; // ex: "Les Oliviers"
  immeubles: Immeuble[];
}

export interface ResidenceData {
  nom: string;
  adresse: string;
  ville: string;
  tranches: Tranche[];
  nomenclature: {
    prefixe: string;
    separateur: string; // "-", "_", "/"
    inclureTranche: boolean;
    inclureImm: boolean;
  };
  locaux: { type: LocalType; nom: string; surface: number }[];
}

export const initialData: ResidenceData = {
  nom: "", adresse: "", ville: "",
  tranches: [],
  nomenclature: { prefixe: "LOT", separateur: "-", inclureTranche: true, inclureImm: true },
  locaux: []
};