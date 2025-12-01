import { AppartData, ResidenceData, LocalCommercial, Nomenclature } from '../format/setup';

export const INITIAL_DATA: ResidenceData = {
    id: "res-001",
    nom: "Résidence Les Jardins de Marrakech",
    adresse: "Avenue Hassan II, Quartier Palmier",
    codePostal: "40000",
    ville: "Marrakech",
    pays: "Maroc",
    nombreLogements: 40,
    nombreCommerce: 4,
    // AJOUT DE LA NOMENCLATURE MANQUANTE
    nomenclature: {
        prefixe: "LOT",
        separateur: "-",
        inclureTranche: false,
        inclureImm: true,
        formatEtage: 'chiffre',
        zeros: 2,
        startIndex: 1
    },
    tranches: [
        {
            id: "tranche-1",
            nom: "Tranche Principale",
            immeubles: [
                {
                    id: "imm-a",
                    nom: "Immeuble Al Andalus",
                    nombreEtages: 5,
                    ascenseur: true,
                    etages: [
                        { numero: 0, label: "RDC", nbApparts: 2 },
                        { numero: 1, label: "1er étage", nbApparts: 4 },
                        { numero: 2, label: "2ème étage", nbApparts: 4 },
                        { numero: 3, label: "3ème étage", nbApparts: 4 },
                        { numero: 4, label: "4ème étage", nbApparts: 2 }
                    ]
                },
                {
                    id: "imm-b",
                    nom: "Immeuble Oasis",
                    nombreEtages: 4,
                    ascenseur: false,
                    etages: [
                        { numero: 0, label: "RDC", nbApparts: 3 },
                        { numero: 1, label: "1er étage", nbApparts: 3 },
                        { numero: 2, label: "2ème étage", nbApparts: 3 },
                        { numero: 3, label: "3ème étage", nbApparts: 3 }
                    ]
                }
            ]
        },
        {
            id: "tranche-2",
            nom: "Tranche Secondaire",
            immeubles: [
                {
                    id: "imm-c",
                    nom: "Immeuble Majorelle",
                    nombreEtages: 3,
                    ascenseur: true,
                    etages: [
                        { numero: 0, label: "RDC", nbApparts: 2 },
                        { numero: 1, label: "1er étage", nbApparts: 2 },
                        { numero: 2, label: "2ème étage", nbApparts: 2 }
                    ]
                }
            ]
        }
    ],
    locaux: [
        {
            id: "local-1",
            type: "SYNDIC",
            nom: "Bureau du syndic principal",
            surface: 25,
            etage: 0,
            immeubleId: "imm-a"
        },
        {
            id: "local-2",
            type: "TECHNIQUE",
            nom: "Local technique électrique",
            surface: 15,
            etage: -1,
            immeubleId: "imm-a"
        },
        {
            id: "local-3",
            type: "LAVERIE",
            nom: "Laverie commune",
            surface: 20,
            etage: 0,
            immeubleId: "imm-b"
        },
        {
            id: "local-4",
            type: "DETENTE",
            nom: "Salle de détente",
            surface: 40,
            etage: 1,
            immeubleId: "imm-a"
        },
        {
            id: "local-5",
            type: "PISCINE",
            nom: "Local technique piscine",
            surface: 12,
            etage: 0
        }
    ]
};

// Données pour les appartements générés
export const SAMPLE_APPARTEMENTS: AppartData[] = [
    {
        reference: "LOT-A1-101",
        trancheId: "tranche-1",
        immeubleId: "imm-a",
        etageNumero: 1,
        nomenclature: {
            prefixe: "LOT",
            separateur: "-",
            inclureTranche: false,
            inclureImm: true,
            formatEtage: "chiffre",
            zeros: 2,
            startIndex: 1
        },
        appartementIndex: 1,
        statut: "Coprop",
        ownerId: "owner-001"
    },
    {
        reference: "LOT-A1-102",
        trancheId: "tranche-1",
        immeubleId: "imm-a",
        etageNumero: 1,
        nomenclature: {
            prefixe: "LOT",
            separateur: "-",
            inclureTranche: false,
            inclureImm: true,
            formatEtage: "chiffre",
            zeros: 2,
            startIndex: 1
        },
        appartementIndex: 2,
        statut: "Loue",
        ownerId: "owner-002",
        locataireId: "tenant-001"
    },
    {
        reference: "LOT-B1-201",
        trancheId: "tranche-1",
        immeubleId: "imm-b",
        etageNumero: 2,
        nomenclature: {
            prefixe: "LOT",
            separateur: "-",
            inclureTranche: false,
            inclureImm: true,
            formatEtage: "chiffre",
            zeros: 2,
            startIndex: 1
        },
        appartementIndex: 1,
        statut: "Promoteur"
    }
];

// Données pour les locaux commerciaux
export const SAMPLE_COMMERCIAUX: LocalCommercial[] = [
    {
        id: "com-001",
        type: "BOUTIQUE",
        nom: "Boutique Alimentation Générale",
        immeubleId: "imm-a",
        statut: "Loue"
    },
    {
        id: "com-002",
        type: "RESTAURANT",
        nom: "Café Restaurant Le Palmier",
        immeubleId: "imm-a",
        statut: "Coprop"
    },
    {
        id: "com-003",
        type: "PHARMACIE",
        nom: "Pharmacie du Quartier",
        immeubleId: "imm-b",
        statut: "Promoteur"
    },
    {
        id: "com-004",
        type: "SALON_COIFFURE",
        nom: "Salon de Coiffure Modern Style",
        statut: "Loue"
    }
];

// Données minimales pour le développement - CORRIGÉ AVEC NOMENCLATURE
export const MINIMAL_DATA: ResidenceData = {
    id: "res-min-001",
    nom: "Résidence Test",
    adresse: "123 Avenue de Test",
    ville: "Ville Test",
    // AJOUT DE LA NOMENCLATURE MANQUANTE
    nomenclature: {
        prefixe: "LOT",
        separateur: "-",
        inclureTranche: false,
        inclureImm: true,
        formatEtage: "chiffre",
        zeros: 2,
        startIndex: 1
    },
    tranches: [
        {
            id: "tranche-test",
            nom: "Tranche Unique",
            immeubles: [
                {
                    id: "imm-test",
                    nom: "Immeuble Test",
                    nombreEtages: 3,
                    etages: [
                        { numero: 0, label: "RDC", nbApparts: 2 },
                        { numero: 1, label: "1er étage", nbApparts: 2 },
                        { numero: 2, label: "2ème étage", nbApparts: 2 }
                    ]
                }
            ]
        }
    ],
    locaux: [
        {
            id: "local-test",
            type: "SYNDIC",
            nom: "Bureau syndic",
            surface: 20
        }
    ]
};

// Configuration de nomenclature par défaut
export const DEFAULT_NOMENCLATURE: Nomenclature = {
    prefixe: "LOT",
    separateur: "-",
    inclureTranche: false,
    inclureImm: true,
    formatEtage: "chiffre",
    zeros: 2,
    startIndex: 1
};

// Données de test alternatives
export const TEST_DATA_SIMPLE: ResidenceData = {
    id: "test-simple",
    nom: "Résidence Simple",
    adresse: "1 Rue du Test",
    ville: "Testville",
    nomenclature: {
        prefixe: "APT",
        separateur: "-",
        inclureTranche: false,
        inclureImm: true
    },
    tranches: [
        {
            id: "tranche-simple",
            nom: "Tranche Unique",
            immeubles: [
                {
                    id: "imm-simple",
                    nom: "Immeuble Principal",
                    nombreEtages: 2,
                    etages: [
                        { numero: 0, label: "RDC", nbApparts: 1 },
                        { numero: 1, label: "1er étage", nbApparts: 1 }
                    ]
                }
            ]
        }
    ],
    locaux: [
        {
            id: "local-simple",
            type: "SYNDIC",
            nom: "Bureau",
            surface: 15
        }
    ]
};

// Export groupé pour faciliter les imports
export const SAMPLE_DATA = {
    INITIAL_DATA,
    MINIMAL_DATA,
    TEST_DATA_SIMPLE,
    SAMPLE_APPARTEMENTS,
    SAMPLE_COMMERCIAUX,
    DEFAULT_NOMENCLATURE
};