// schemas/residence.ts
import { z } from "zod";

// Étape 1 : Identité
// On exige un nom et une ville
export const step1Schema = z.object({
  nom: z.string().min(2, "Le nom de la résidence doit contenir au moins 2 caractères."),
  ville: z.string().min(2, "La ville est requise."),
  adresse: z.string().optional(), // Facultatif pour l'instant
});

// Étape 2 : Structure
// C'est ici qu'on bloque si l'utilisateur n'a rien ajouté.
export const step2Schema = z.object({
  tranches: z
    .array(
      z.object({
        nom: z.string().min(1, "Le nom de la tranche est requis"),
        immeubles: z
          .array(
            z.object({
              nom: z.string().min(1, "Le nom de l'immeuble est requis"),
              // On ne valide pas encore les étages ici, c'est l'étape 3
            })
          )
          .min(1, "Chaque tranche doit contenir au moins un immeuble."),
      })
    )
    .min(1, "Vous devez créer au moins une tranche (ou une structure par défaut)."),
});

// Étape 3 : Configuration
// On vérifie que la structure a bien reçu des étages
export const step3Schema = z.object({
  tranches: z.array(
    z.object({
      // On ne valide pas la structure complète, on prépare la vérification
      immeubles: z.array(
        z.object({
          etages: z.array(z.any()), // On accepte le tableau d'étages
        })
      ),
    })
  )
})
.refine(data => {
    // Parcourir toutes les tranches et tous les immeubles
    for (const tranche of data.tranches) {
        for (const immeuble of tranche.immeubles) {
            // Si le tableau d'étages est vide, la configuration n'a pas été faite
            if (immeuble.etages.length === 0) {
                return false; 
            }
        }
    }
    return true; // Tous les immeubles sont configurés
}, {
    // Message d'erreur si la condition échoue
    message: "Veuillez configurer et générer la structure d'étages pour CHAQUE immeuble.",
    path: ['tranches'], // Place le message d'erreur au niveau des tranches
});

// Étape 4 : Nomenclature (généralement toujours valide si valeurs par défaut, mais bon exemple)
export const step4Schema = z.object({
  nomenclature: z.object({
    prefixe: z.string().min(1, "Le préfixe est requis"),
    separateur: z.string(),
  }),
});