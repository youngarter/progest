export interface ResidenceData {
     
    // Identification
    id: string;
    nom: string;
    adresse: string;
    codePostal?: string;
    ville?: string;
    pays?: string;
    nombreLogements?: number;
    nombreCommerce?: number;
    // Structure
    nomenclature: Nomenclature;
    tranches: Tranche[];
    locaux: LocalCoprop[];
}

export interface Tranche {
    id: string;
    nom: string;
    immeubles: Immeuble[];
}

export interface Immeuble {
    id: string;
    nom: string;
    nombreEtages: number;
    etages: Etage[];
    ascenseur?: boolean;
}

export interface Etage {
    numero: number;
    label: string;
    nbApparts: number;
}

export interface AppartData {
    reference: string;
    trancheId: string;
    immeubleId: string;
    etageNumero: number;
    nomenclature: Nomenclature;
    appartementIndex: number;
      // Statut
    statut: 'Promoteur' | 'Coprop' | 'Loue' ;   
    // Relations
    ownerId?: string;
    locataireId?: string;
}

export interface Nomenclature {
    prefixe: string;
    separateur?: string;
    inclureTranche?: boolean;
    inclureImm?: boolean;
    formatEtage?: 'chiffre' | 'lettre';
    zeros?: number;
    startIndex?: number;
}

export interface LocalCoprop {
    id: string;
    type: string;
    nom: string;
    surface?: number;
    etage?: number;
    immeubleId?: string;
}

export interface LocalCommercial {
    id: string;
    type: string;
    nom: string;
    immeubleId?: string;
    statut: 'Promoteur' | 'Coprop' | 'Loue' ; 
}

export interface StepProps {
    data: ResidenceData;
    update: (newData: Partial<ResidenceData>) => void;
}


