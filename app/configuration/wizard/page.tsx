"use client";

import { useState } from "react";
// Assurez-vous que le chemin est correct pour vos types
import { ResidenceData, initialData } from "@/types/residence"; 
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Import pour les messages d'erreur
import { 
  step1Schema, 
  step2Schema, 
  step3Schema, 
  step4Schema,
  // 💡 J'ai supposé que vous pourriez vouloir un step5Schema
  // import { step5Schema } from "./schemas/residence"; 
} from "./schemas/residence"; // Import des schémas Zod

// Import des étapes (ajustez les chemins si nécessaire)
import Step1Identity from "./steps/step1Identity";
import Step2Structure from "./steps/Step2Structure";
import Step3Details from "./steps/Step3Details";
import Step4Nomenclature from "./steps/Step4Nomenclature";
import Step5Locals from "./steps/Step5Locals";

export default function ResidenceWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ResidenceData>(initialData);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const updateData = (partialData: Partial<ResidenceData>) => {
    setData((prev) => ({ ...prev, ...partialData }));
  };

  /**
   * Logique de validation de l'étape courante utilisant les schémas Zod.
   * Affiche un toast d'erreur si la validation échoue.
   */
  const validateCurrentStep = (): boolean => {
    let schema: any = undefined; // Initialiser le schéma à undefined
    let currentData = data; 

    try {
      switch (step) {
        case 1:
          schema = step1Schema;
          break;
        case 2:
          schema = step2Schema;
          break;
        case 3:
          schema = step3Schema;
          break;
        case 4:
          schema = step4Schema;
          break;
        case 5:
        default:
          // Si on est à l'étape 5 (ou autre), on ne fait rien pour l'instant
          // On peut mettre ici step5Schema si l'étape 5 est bloquante
          return true; 
      }
      
      // Valide uniquement si un schéma a été défini pour l'étape
      if (schema) {
        schema.parse(currentData);
      }
      return true;
      
    } catch (error: any) {
      if (error && error.errors) {
        // Affiche la première erreur rencontrée
        const firstError = error.errors[0];
        toast.error("Étape incomplète ou invalide", {
          description: firstError.message,
          duration: 3000,
        });
      }
      return false; // Bloque le passage à l'étape suivante
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Identity data={data} update={updateData} />;
      case 2: return <Step2Structure data={data} update={updateData} />;
      case 3: return <Step3Details data={data} update={updateData} />;
      case 4: return <Step4Nomenclature data={data} update={updateData} />;
      case 5: return <Step5Locals data={data} update={updateData} />;
      default: return null;
    }
  };

  /**
   * Fonction de soumission finale des données (Appel API)
   */
  const handleSubmit = async () => {
    // 1. Validation finale de l'étape 5 (si elle est importante)
    // Si l'étape 5 doit valider quelque chose, mettez le code ici.
    // Sinon, on considère que les données sont prêtes.
    console.log("Données à soumettre :", step);
    if (step === totalSteps && !validateCurrentStep()) {
      // Dans le cas où on a mis un schéma bloquant pour l'étape 5
      return;
    }

    toast.info("Envoi des données en cours...");

    try {
      // Simuler un appel API pour la création de la résidence
      // REMPLACER ceci par votre VRAI appel API (ex: fetch('/api/residences', ...))
      
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // Ici, le code envoie réellement l'objet `data` complet au backend
      console.log("✅ Données prêtes pour l'envoi, objet final :", data);

      toast.success("Résidence créée avec succès !", { description: "Simulation de l'enregistrement réussie. Redirection..." });
      
      // 3. Redirection après succès (exemple)
      // router.push('/dashboard/residences'); 

    } catch (error) {
      console.error("Erreur de soumission:", error);
      toast.error("Échec de la création", { description: "Une erreur est survenue lors de l'appel au serveur." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Création de Résidence</h1>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Étape {step} sur {totalSteps}</span>
          <span>{Math.round(progress)}% complété</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="min-h-[500px]">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button variant="outline" onClick={prevStep} disabled={step === 1}>
          Précédent
        </Button>
        {step === totalSteps ? (
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={handleSubmit} // ⬅️ Utilisation de la nouvelle fonction de soumission
          >
            Valider et Créer
          </Button>
        ) : (
          <Button onClick={nextStep}>Suivant</Button>
        )}
      </div>
    </div>
  );
}