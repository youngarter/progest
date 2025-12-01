import { z } from 'zod';

// Schéma pour l'étape 1: Identification de la résidence



// Schéma pour l'étape 1: Identification de la résidence
const step1Schema = z.object({
    nom: z.string().min(3, "Le nom de la résidence est requis (min 3 caractères)."),
    adresse: z.string().min(5, "L'adresse complète est requise."),
    codePostal: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    nombreLogements: z.number().min(1, "Le nombre de logements doit être au moins 1").optional(),
    nombreCommerce: z.number().min(0, "Le nombre de commerces ne peut pas être négatif").optional(),
    // AJOUTEZ CES CHAMPS OBLIGATOIRES :
    nomenclature: z.object({
        prefixe: z.string().min(1, "Le préfixe est requis"),
        separateur: z.string().optional(),
        inclureTranche: z.boolean().optional(),
        inclureImm: z.boolean().optional(),
        formatEtage: z.enum(['chiffre', 'lettre']).optional(),
        zeros: z.number().optional(),
        startIndex: z.number().optional(),
    }),
    tranches: z.array(z.any()).optional(), // Ou z.array(z.object({...})).optional()
    locaux: z.array(z.any()).optional(), // Ou z.array(z.object({...})).optional()
});

// Schéma pour l'étape 2: Structure des tranches et immeubles
const step2Schema = z.object({
    tranches: z.array(z.object({
        id: z.string().min(1, "L'ID de la tranche est requis"),
        nom: z.string().min(1, "Le nom de la tranche est requis"),
        immeubles: z.array(z.object({
            id: z.string().min(1, "L'ID de l'immeuble est requis"),
            nom: z.string().min(1, "Le nom de l'immeuble est requis"),
            nombreEtages: z.number().min(1, "Le nombre d'étages doit être au moins 1"),
            ascenseur: z.boolean().optional(),
            etages: z.array(z.any()) // Validation détaillée à l'étape 3
        })).min(1, "Chaque tranche doit avoir au moins un immeuble")
    })).min(1, "Vous devez définir au moins une tranche")
});

// Schéma pour l'étape 3: Validation des étages
const step3Schema = z.object({
    tranches: z.array(z.object({
        immeubles: z.array(z.object({
            id: z.string(),
            nom: z.string(),
            nombreEtages: z.number().min(1),
            etages: z.array(z.object({
                numero: z.number().int("Le numéro d'étage doit être un entier"),
                label: z.string().min(1, "Le label de l'étage est requis"),
                nbApparts: z.number().int("Le nombre d'appartements doit être un entier").min(0, "Le nombre d'appartements ne peut pas être négatif"),
            })).min(1, "Chaque immeuble doit avoir au moins un étage")
        }))
    }))
}).refine((data) => {
    // Validation: le nombre d'étages déclaré doit correspondre au nombre d'étages configurés
    return data.tranches.every(tranche => 
        tranche.immeubles.every(immeuble => 
            immeuble.etages.length === immeuble.nombreEtages
        )
    );
}, {
    message: "Le nombre d'étages configurés doit correspondre au nombre d'étages déclaré pour chaque immeuble"
}).refine((data) => {
    // Validation: les numéros d'étage doivent être cohérents
    return data.tranches.every(tranche =>
        tranche.immeubles.every(immeuble => {
            const etagesNumbers = immeuble.etages.map(e => e.numero);
            const expectedNumbers = Array.from({length: immeuble.nombreEtages}, (_, i) => i);
            return JSON.stringify(etagesNumbers.sort()) === JSON.stringify(expectedNumbers.sort());
        })
    );
}, {
    message: "Les numéros d'étage doivent être cohérents et couvrir tous les étages déclarés"
});

// Schéma pour l'étape 4: Nomenclature
const step4Schema = z.object({
    nomenclature: z.object({
        prefixe: z.string().min(1, "Le préfixe de référence est obligatoire."),
        separateur: z.string().max(3, "Le séparateur ne peut pas dépasser 3 caractères").optional(),
        inclureTranche: z.boolean().optional(),
        inclureImm: z.boolean().optional(),
        formatEtage: z.enum(['chiffre', 'lettre']).optional(),
        zeros: z.number().int().min(0).max(4).optional(),
        startIndex: z.number().int().min(0).optional(),
    }).refine((nomenclature) => {
        // Validation: si inclureTranche ou inclureImm sont true, le séparateur est requis
        if ((nomenclature.inclureTranche || nomenclature.inclureImm) && !nomenclature.separateur) {
            return false;
        }
        return true;
    }, {
        message: "Un séparateur est requis lorsque vous incluez la tranche ou l'immeuble dans la nomenclature"
    })
});

// Schéma pour l'étape 5: Locaux communs
const step5Schema = z.object({
    locaux: z.array(z.object({
        id: z.string().min(1, "L'ID du local est requis"),
        type: z.string().min(1, "Le type de local est requis"),
        nom: z.string().min(1, "Le nom du local est requis"),
        surface: z.number().min(0, "La surface ne peut pas être négative").optional(),
        etage: z.number().int().optional(),
        immeubleId: z.string().optional(),
    })).min(1, "Vous devez ajouter au moins un local commun")
});

// Schéma complet pour la résidence (validation finale)
export const residenceCompleteSchema = z.object({
    id: z.string().min(1, "L'ID de la résidence est requis"),
    nom: z.string().min(3, "Le nom de la résidence doit contenir au moins 3 caractères"),
    adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    codePostal: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    nombreLogements: z.number().min(1, "Le nombre de logements doit être au moins 1").optional(),
    nombreCommerce: z.number().min(0, "Le nombre de commerces ne peut pas être négatif").optional(),
    tranches: z.array(z.object({
        id: z.string().min(1, "L'ID de la tranche est requis"),
        nom: z.string().min(1, "Le nom de la tranche est requis"),
        immeubles: z.array(z.object({
            id: z.string().min(1, "L'ID de l'immeuble est requis"),
            nom: z.string().min(1, "Le nom de l'immeuble est requis"),
            nombreEtages: z.number().min(1, "Le nombre d'étages doit être au moins 1"),
            ascenseur: z.boolean().optional(),
            etages: z.array(z.object({
                numero: z.number().int("Le numéro d'étage doit être un entier"),
                label: z.string().min(1, "Le label de l'étage est requis"),
                nbApparts: z.number().int("Le nombre d'appartements doit être un entier").min(0, "Le nombre d'appartements ne peut pas être négatif"),
            })).min(1, "Chaque immeuble doit avoir au moins un étage")
        })).min(1, "Chaque tranche doit avoir au moins un immeuble")
    })).min(1, "Au moins une tranche est requise"),
    locaux: z.array(z.object({
        id: z.string().min(1, "L'ID du local est requis"),
        type: z.string().min(1, "Le type de local est requis"),
        nom: z.string().min(1, "Le nom du local est requis"),
        surface: z.number().min(0, "La surface ne peut pas être négative").optional(),
        etage: z.number().int().optional(),
        immeubleId: z.string().optional(),
    })).min(1, "Au moins un local commun est requis")
});

// Schémas pour les autres interfaces
export const appartDataSchema = z.object({
    reference: z.string().min(1, "La référence est requise"),
    trancheId: z.string().min(1, "L'ID de la tranche est requis"),
    immeubleId: z.string().min(1, "L'ID de l'immeuble est requis"),
    etageNumero: z.number().int("Le numéro d'étage doit être un entier"),
    nomenclature: z.object({
        prefixe: z.string().min(1),
        separateur: z.string().optional(),
        inclureTranche: z.boolean().optional(),
        inclureImm: z.boolean().optional(),
        formatEtage: z.enum(['chiffre', 'lettre']).optional(),
        zeros: z.number().int().min(0).max(4).optional(),
        startIndex: z.number().int().min(0).optional(),
    }),
    appartementIndex: z.number().int().min(0, "L'index de l'appartement ne peut pas être négatif"),
    statut: z.enum(['Promoteur', 'Coprop', 'Loue']),
    ownerId: z.string().optional(),
    locataireId: z.string().optional(),
});

export const localCommercialSchema = z.object({
    id: z.string().min(1, "L'ID du local commercial est requis"),
    type: z.string().min(1, "Le type de local commercial est requis"),
    nom: z.string().min(1, "Le nom du local commercial est requis"),
    immeubleId: z.string().optional(),
    statut: z.enum(['Promoteur', 'Coprop', 'Loue']),
});

export const allSchemas = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema];

// Fonctions utilitaires pour la validation
export const validateStep = (step: number, data: any) => {
    if (step < 1 || step > allSchemas.length) {
        return { success: false, error: new Error("Étape invalide") };
    }
    const schema = allSchemas[step - 1];
    return schema.safeParse(data);
};

export const validateCompleteResidence = (data: any) => {
    return residenceCompleteSchema.safeParse(data);
};

export const validateAppartData = (data: any) => {
    return appartDataSchema.safeParse(data);
};

export const validateLocalCommercial = (data: any) => {
    return localCommercialSchema.safeParse(data);
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