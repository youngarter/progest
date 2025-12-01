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
    appartements?: AppartData[]; 
    locauxCommuns: LocalCoprop[];    // ← RENOMMÉ pour plus de clarté
    locauxCommerciaux: LocalCommercial[]; // ← AJOUTÉ pour séparation claire
    
    // Métadonnées
    dateCreation?: Date;
    dateModification?: Date;
    createdBy?: string;
    statut?: 'brouillon' | 'actif' | 'archive';
}

export interface Tranche {
    id: string;
    nom: string;
    code: string; // ← AJOUTÉ: Code court (ex: "A", "B", "Nord")
    description?: string;
    immeubles: Immeuble[];
}

export interface Immeuble {
    id: string;
    nom: string;
    code: string; // ← AJOUTÉ: Code court (ex: "I", "II", "Alpha")
    nombreEtages: number;
    nbAppartsParEtage?: number;
    etages: Etage[];
}

export interface Etage {
    id: string; // ← AJOUTÉ: Identifiant unique pour chaque étage
    numero: number;
    label: string;
    nbApparts: number;
}

export interface AppartData {
    id: string; // ← AJOUTÉ: Identifiant unique
    reference: string;
    trancheId: string;
    trancheCode?: string; // ← AJOUTÉ: Pour référence rapide
    immeubleId: string;
    immeubleCode?: string; // ← AJOUTÉ: Pour référence rapide
    etageNumero: number;
    etageId: string;
    nomenclature: Nomenclature;
    appartementIndex: number;
    
   
    
    // Statut
    statut: 'Promoteur' | 'Coprop' | 'Loue';
    
    // Relations
    ownerId?: string;
    locataireId?: string;
    
    // Métadonnées
    dateAcquisition?: Date;
    dateLocation?: Date;
}

export interface Nomenclature {
    prefixe: string;
    separateur?: string;
    inclureTranche?: boolean;
    inclureImm?: boolean;
    formatEtage?: 'chiffre' | 'lettre';
    zeros?: number;
    startIndex?: number;
    
    // AJOUTÉ: Options de formatage
    formatReference?: 'tranche-imm-etage' | 'imm-etage' | 'simple';
    majuscules?: boolean;
}

export interface LocalCoprop {
    id: string;
    type: 'bureau-syndic' | 'salle-reunion' | 'local-technique' | 'local-nettoyage' | 
          'local-jardinage' | 'local-pompage' | 'local-entretien' | 'garage' | 
          'cave' | 'piscine' | 'gym' | 'autre';
    nom: string;
    surface?: number;
    etage?: number;
    trancheId?: string; // ← AJOUTÉ: Référence à la tranche
    immeubleId?: string;
    emplacement?: string; // ← AJOUTÉ: Description de l'emplacement
    responsableId?: string; // ← AJOUTÉ: Responsable du local
}

export interface LocalCommercial {
    id: string;
    type: 'bureau' | 'commerce' | 'restaurant' | 'pharmacie' | 'coiffeur' | 
          'banque' | 'autre-commerce';
    nom: string;
    surface?: number;
    trancheId?: string; // ← AJOUTÉ: Référence à la tranche
    immeubleId?: string;
    statut: 'Promoteur' | 'Coprop' | 'Loue';
    
    // AJOUTÉ: Informations commerciales
    
    contact?: {
        nom: string;
        telephone?: string;
        email?: string;
    };
    
}

export interface owner {
    id: string;
    type: 'proprietaire' | 'locataire' | 'syndic' | 'gestionnaire' |'Promoteur';
    nom: string;
    prenom: string;
    email?: string;
    telephone?: [string, string]; // [fixe, mobile]
    appartement?: AppartData[];    
    locauxCommerciaux?: LocalCommercial[];
    
    // AJOUTÉ: Informations spécifiques
    coproprietaireDepuis?: Date;
    observations?: string;
}

export interface StepProps {
    data: ResidenceData;
    update: (newData: Partial<ResidenceData>) => void;
    currentStep: number; // ← AJOUTÉ: Pour savoir à quelle étape on est
    totalSteps: number; // ← AJOUTÉ: Pour la progression
}

// AJOUTÉ: Interface pour les documents
export interface Document {
    id: string;
    type: 'plan' | 'reglement' | 'contrat' | 'facture' | 'autre';
    nom: string;
    description?: string;
    fichierUrl: string;
    dateUpload: Date;
    uploadedBy: string;
    taille: number;
    residenceId: string;
}

// AJOUTÉ: Interface pour les charges et budgets
export interface Charge {
    id: string;
    type: 'ordinaire' | 'extraordinaire';
    description: string;
    montant: number;
    periode: 'mensuel' | 'trimestriel' | 'annuel';
    repartition: 'lot' | 'surface' | 'quote-part';
    dateEcheance: Date;
    residenceId: string;
}

// AJOUTÉ: Interface pour les travaux
export interface Travaux {
    id: string;
    description: string;
    type: 'entretien' | 'renovation' | 'urgence';
    priorite: 'faible' | 'moyenne' | 'haute';
    budgetEstime: number;
    dateDebut?: Date;
    dateFin?: Date;
    statut: 'planifie' | 'en-cours' | 'termine' | 'annule';
    responsableId?: string;
    residenceId: string;
}