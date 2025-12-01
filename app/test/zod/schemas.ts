import { z } from 'zod';

// ============ SCHÉMAS DE BASE ============

// Schéma pour Nomenclature
const nomenclatureSchema = z.object({
    prefixe: z.string().min(1, "Le préfixe est requis"),
    separateur: z.string().max(3, "Le séparateur ne peut pas dépasser 3 caractères").optional(),
    inclureTranche: z.boolean().optional(),
    inclureImm: z.boolean().optional(),
    formatEtage: z.enum(['chiffre', 'lettre']).optional(),
    zeros: z.number().int().min(0).max(4).optional(),
    startIndex: z.number().int().min(0).optional(),
    formatReference: z.enum(['tranche-imm-etage', 'imm-etage', 'simple']).optional(),
    majuscules: z.boolean().optional(),
});

// Schéma pour Étage
const etageSchema = z.object({
    id: z.string().min(1, "L'ID de l'étage est requis"),
    numero: z.number().int("Le numéro d'étage doit être un entier"),
    label: z.string().min(1, "Le label de l'étage est requis"),
    nbApparts: z.number().int("Le nombre d'appartements doit être un entier").min(0, "Le nombre d'appartements ne peut pas être négatif"),
});

// Schéma pour Immeuble
const immeubleSchema = z.object({
    id: z.string().min(1, "L'ID de l'immeuble est requis"),
    nom: z.string().min(1, "Le nom de l'immeuble est requis"),
    code: z.string().min(1, "Le code de l'immeuble est requis").max(3, "Le code ne peut pas dépasser 3 caractères"),
    nombreEtages: z.number().min(1, "Le nombre d'étages doit être au moins 1"),
    nbAppartsParEtage: z.number().int().min(0, "Le nombre d'appartements par étage ne peut pas être négatif").optional(),
    etages: z.array(etageSchema).min(1, "Chaque immeuble doit avoir au moins un étage"),
});

// Schéma pour Tranche
const trancheSchema = z.object({
    id: z.string().min(1, "L'ID de la tranche est requis"),
    nom: z.string().min(1, "Le nom de la tranche est requis"),
    code: z.string().min(1, "Le code de la tranche est requis").max(3, "Le code ne peut pas dépasser 3 caractères"),
    description: z.string().optional(),
    immeubles: z.array(immeubleSchema).min(1, "Chaque tranche doit avoir au moins un immeuble"),
});

// Schéma pour Local Copropriété
const localCopropSchema = z.object({
    id: z.string().min(1, "L'ID du local est requis"),
    type: z.enum(['bureau-syndic', 'salle-reunion', 'local-technique', 'local-nettoyage', 
                 'local-jardinage', 'local-pompage', 'local-entretien', 'garage', 
                 'cave', 'piscine', 'gym', 'autre']),
    nom: z.string().min(1, "Le nom du local est requis"),
    surface: z.number().min(0, "La surface ne peut pas être négative").optional(),
    etage: z.number().int().optional(),
    trancheId: z.string().optional(),
    immeubleId: z.string().optional(),
    emplacement: z.string().optional(),
    responsableId: z.string().optional(),
});

// Schéma pour Local Commercial
const localCommercialSchema = z.object({
    id: z.string().min(1, "L'ID du local commercial est requis"),
    type: z.enum(['bureau', 'commerce', 'restaurant', 'pharmacie', 'coiffeur', 'banque', 'autre-commerce']),
    nom: z.string().min(1, "Le nom du local commercial est requis"),
    surface: z.number().min(0, "La surface ne peut pas être négative").optional(),
    trancheId: z.string().optional(),
    immeubleId: z.string().optional(),
    statut: z.enum(['Promoteur', 'Coprop', 'Loue']),
    contact: z.object({
        nom: z.string().min(1, "Le nom du contact est requis"),
        telephone: z.string().optional(),
        email: z.string().email("Email invalide").optional(),
    }).optional(),
});

// Schéma pour Propriétaire/Locataire
const ownerSchema = z.object({
    id: z.string().min(1, "L'ID est requis"),
    type: z.enum(['proprietaire', 'locataire', 'syndic', 'gestionnaire', 'Promoteur']),
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    email: z.string().email("Email invalide").optional(),
    telephone: z.array(z.string()).length(2, "Doit contenir [fixe, mobile]").optional(),
    coproprietaireDepuis: z.date().optional(),
    observations: z.string().optional(),
});

// Schéma pour Appartement
const appartDataSchema = z.object({
    id: z.string().min(1, "L'ID de l'appartement est requis"),
    reference: z.string().min(1, "La référence est requise"),
    trancheId: z.string().min(1, "L'ID de la tranche est requis"),
    trancheCode: z.string().optional(),
    immeubleId: z.string().min(1, "L'ID de l'immeuble est requis"),
    immeubleCode: z.string().optional(),
    etageNumero: z.number().int("Le numéro d'étage doit être un entier"),
    etageId: z.string().min(1, "L'ID de l'étage est requis"),
    nomenclature: nomenclatureSchema,
    appartementIndex: z.number().int().min(0, "L'index de l'appartement ne peut pas être négatif"),
    statut: z.enum(['Promoteur', 'Coprop', 'Loue']),
    ownerId: z.string().optional(),
    locataireId: z.string().optional(),
    dateAcquisition: z.date().optional(),
    dateLocation: z.date().optional(),
});

// ============ SCHÉMAS PAR ÉTAPE ============

// Schéma pour l'étape 1: Identification de la résidence
const step1Schema = z.object({
    nom: z.string().min(3, "Le nom de la résidence est requis (min 3 caractères)."),
    adresse: z.string().min(5, "L'adresse complète est requise."),
    codePostal: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    nombreLogements: z.number().min(1, "Le nombre de logements doit être au moins 1").optional(),
    nombreCommerce: z.number().min(0, "Le nombre de commerces ne peut pas être négatif").optional(),
    nomenclature: nomenclatureSchema,
    tranches: z.array(z.any()).optional(),
    locauxCommuns: z.array(z.any()).optional(),
    locauxCommerciaux: z.array(z.any()).optional(),
    dateCreation: z.date().optional(),
    createdBy: z.string().optional(),
    statut: z.enum(['brouillon', 'actif', 'archive']).optional(),
});

// Schéma pour l'étape 2: Structure des tranches et immeubles
const step2Schema = z.object({
    tranches: z.array(trancheSchema.pick({
        id: true,
        nom: true,
        code: true,
        description: true,
        immeubles: true,
    })).min(1, "Vous devez définir au moins une tranche")
}).refine((data) => {
    // Validation: chaque tranche doit avoir au moins un immeuble
    return data.tranches.every(tranche => 
        tranche.immeubles && tranche.immeubles.length > 0
    );
}, {
    message: "Chaque tranche doit avoir au moins un immeuble",
    path: ["tranches"],
});

// Schéma pour l'étape 3: Validation des étages et appartements
const step3Schema = z.object({
    tranches: z.array(z.object({
        id: z.string(),
        immeubles: z.array(z.object({
            id: z.string(),
            nombreEtages: z.number().min(1).optional(), // AJOUTEZ CETTE LIGNE
            etages: z.array(etageSchema.pick({
                id: true,
                numero: true,
                label: true,
                nbApparts: true,
            }))
        }))
    }))
}).refine((data) => {
    // Validation: le nombre d'étages déclaré doit correspondre au nombre d'étages configurés
    return data.tranches.every(tranche => 
        tranche.immeubles.every(immeuble => {
            // Récupérer le nombre d'étages depuis l'immeuble
            const nombreEtagesDeclare = immeuble.nombreEtages || 0;
            return immeuble.etages.length === nombreEtagesDeclare;
        })
    );
}, {
    message: "Le nombre d'étages configurés doit correspondre au nombre d'étages déclaré pour chaque immeuble"
}).refine((data) => {
    // Validation: les numéros d'étage doivent être cohérents
    return data.tranches.every(tranche =>
        tranche.immeubles.every(immeuble => {
            const etagesNumbers = immeuble.etages.map(e => e.numero);
            const nombreEtagesDeclare = immeuble.nombreEtages || 0;
            const expectedNumbers = Array.from(
                {length: nombreEtagesDeclare}, 
                (_, i) => i
            );
            return JSON.stringify(etagesNumbers.sort()) === JSON.stringify(expectedNumbers.sort());
        })
    );
}, {
    message: "Les numéros d'étage doivent être cohérents et couvrir tous les étages déclarés"
});

// Schéma pour l'étape 4: Nomenclature et génération d'appartements
const step4Schema = z.object({
    nomenclature: nomenclatureSchema.refine((nomenclature) => {
        // Validation: si inclureTranche ou inclureImm sont true, le séparateur est requis
        if ((nomenclature.inclureTranche || nomenclature.inclureImm) && !nomenclature.separateur) {
            return false;
        }
        return true;
    }, {
        message: "Un séparateur est requis lorsque vous incluez la tranche ou l'immeuble dans la nomenclature"
    }),
    appartements: z.array(appartDataSchema).optional(),
}).refine((data) => {
    // Validation: au moins un appartement doit être généré
    if (data.appartements && data.appartements.length > 0) {
        return true;
    }
    // On permet que les appartements ne soient pas encore générés
    return true;
}, {
    message: "Vous devez générer les appartements avant de passer à l'étape suivante",
    path: ["appartements"],
});

// Schéma pour l'étape 5: Locaux communs et commerciaux
const step5Schema = z.object({
    locauxCommuns: z.array(localCopropSchema).min(1, "Vous devez ajouter au moins un local commun"),
    locauxCommerciaux: z.array(localCommercialSchema).optional(),
}).refine((data) => {
    // Validation: les locaux commerciaux doivent avoir un statut valide
    if (data.locauxCommerciaux) {
        return data.locauxCommerciaux.every(local => 
            ['Promoteur', 'Coprop', 'Loue'].includes(local.statut)
        );
    }
    return true;
}, {
    message: "Les locaux commerciaux doivent avoir un statut valide (Promoteur, Coprop ou Loue)",
    path: ["locauxCommerciaux"],
});

// ============ SCHÉMA COMPLET ============

export const residenceCompleteSchema = z.object({
    id: z.string().min(1, "L'ID de la résidence est requis"),
    nom: z.string().min(3, "Le nom de la résidence doit contenir au moins 3 caractères"),
    adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    codePostal: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    nombreLogements: z.number().min(1, "Le nombre de logements doit être au moins 1").optional(),
    nombreCommerce: z.number().min(0, "Le nombre de commerces ne peut pas être négatif").optional(),
    
    nomenclature: nomenclatureSchema,
    tranches: z.array(trancheSchema).min(1, "Au moins une tranche est requise"),
    appartements: z.array(appartDataSchema).optional(),
    locauxCommuns: z.array(localCopropSchema).min(1, "Au moins un local commun est requis"),
    locauxCommerciaux: z.array(localCommercialSchema).optional(),
    
    dateCreation: z.date().optional(),
    dateModification: z.date().optional(),
    createdBy: z.string().optional(),
    statut: z.enum(['brouillon', 'actif', 'archive']).optional(),
});

// ============ SCHÉMAS SUPPLÉMENTAIRES ============

// Schéma pour Document
export const documentSchema = z.object({
    id: z.string().min(1, "L'ID du document est requis"),
    type: z.enum(['plan', 'reglement', 'contrat', 'facture', 'autre']),
    nom: z.string().min(1, "Le nom du document est requis"),
    description: z.string().optional(),
    fichierUrl: z.string().url("URL invalide"),
    dateUpload: z.date(),
    uploadedBy: z.string(),
    taille: z.number().min(0, "La taille ne peut pas être négative"),
    residenceId: z.string().min(1, "L'ID de la résidence est requis"),
});

// Schéma pour Charge
export const chargeSchema = z.object({
    id: z.string().min(1, "L'ID de la charge est requis"),
    type: z.enum(['ordinaire', 'extraordinaire']),
    description: z.string().min(1, "La description est requise"),
    montant: z.number().min(0, "Le montant ne peut pas être négatif"),
    periode: z.enum(['mensuel', 'trimestriel', 'annuel']),
    repartition: z.enum(['lot', 'surface', 'quote-part']),
    dateEcheance: z.date(),
    residenceId: z.string().min(1, "L'ID de la résidence est requis"),
});

// Schéma pour Travaux
export const travauxSchema = z.object({
    id: z.string().min(1, "L'ID des travaux est requis"),
    description: z.string().min(1, "La description est requise"),
    type: z.enum(['entretien', 'renovation', 'urgence']),
    priorite: z.enum(['faible', 'moyenne', 'haute']),
    budgetEstime: z.number().min(0, "Le budget ne peut pas être négatif"),
    dateDebut: z.date().optional(),
    dateFin: z.date().optional(),
    statut: z.enum(['planifie', 'en-cours', 'termine', 'annule']),
    responsableId: z.string().optional(),
    residenceId: z.string().min(1, "L'ID de la résidence est requis"),
});

// ============ EXPORTS ============

export const allSchemas = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema];

// Fonctions utilitaires pour la validation
export const validateStep = (step: number, data: Partial<ResidenceCompleteData>) => {
    if (step < 1 || step > allSchemas.length) {
        return { success: false, error: new Error("Étape invalide") };
    }
    const schema = allSchemas[step - 1];
    return schema.safeParse(data);
};

export const validateCompleteResidence = (data: ResidenceCompleteData) => {
    return residenceCompleteSchema.safeParse(data);
};

export const validateAppartData = (data: AppartData) => {
    return appartDataSchema.safeParse(data);
};

export const validateLocalCommercial = (data: LocalCommercial) => {
    return localCommercialSchema.safeParse(data);
};

export const validateLocalCoprop = (data: LocalCoprop) => {
    return localCopropSchema.safeParse(data);
};

export const validateOwner = (data: Owner) => {
    return ownerSchema.safeParse(data);
};
// Types pour TypeScript (inférés des schémas Zod)
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type ResidenceCompleteData = z.infer<typeof residenceCompleteSchema>;
export type AppartData = z.infer<typeof appartDataSchema>;
export type LocalCommercial = z.infer<typeof localCommercialSchema>;
export type LocalCoprop = z.infer<typeof localCopropSchema>;
export type Owner = z.infer<typeof ownerSchema>;
export type Document = z.infer<typeof documentSchema>;
export type Charge = z.infer<typeof chargeSchema>;
export type Travaux = z.infer<typeof travauxSchema>;
export type Nomenclature = z.infer<typeof nomenclatureSchema>;
export type Tranche = z.infer<typeof trancheSchema>;
export type Immeuble = z.infer<typeof immeubleSchema>;
export type Etage = z.infer<typeof etageSchema>;