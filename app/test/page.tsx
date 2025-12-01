"use client";
import React, { useState, useCallback, useMemo } from "react";
import { allSchemas } from "./zod/schemas";
import { CheckCircle, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { ResidenceData } from "./format/setup";
import {
  Step1Identity,
  Step2Structure,
  Step3Appart,
  Step5Locaux,
} from "./steps/all-steps";

const stepsComponents = [
  Step1Identity,
  Step2Structure,
  Step3Appart,
  Step5Locaux,
];

// Données initiales vides
const EMPTY_DATA: ResidenceData = {
  id: `res-${Date.now()}`,
  nom: "",
  adresse: "",
  codePostal: "",
  ville: "",
  pays: "",
  nombreLogements: 0,
  nombreCommerce: 0,
  nomenclature: {
    prefixe: "LOT",
    separateur: "-",
    inclureTranche: false,
    inclureImm: true,
    formatEtage: "chiffre",
    zeros: 2,
    startIndex: 1,
  },
  tranches: [],
  appartements: [],
  locauxCommuns: [],     // ← CORRIGÉ
  locauxCommerciaux: [],
};

export default function ResidenceWizard() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ResidenceData>(EMPTY_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = allSchemas.length;

  // Utiliser useCallback pour éviter les re-renders
  const updateData = useCallback((newData: Partial<ResidenceData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  // Validation memoïsée pour éviter les re-calculs inutiles
  const isStepValid = useMemo(() => {
    try {
      const currentSchema = allSchemas[step - 1];
      currentSchema.parse(data);
      return true;
    } catch (e) {
      console.log("Validation échouée à l'étape", step, e);
      return false;
    }
  }, [data, step]);

  const validateCurrentStep = useCallback(() => {
    if (isStepValid) return true;

    try {
      const currentSchema = allSchemas[step - 1];
      currentSchema.parse(data);
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const firstError = e.issues[0];
        let errorMessage = firstError?.message || "Erreur de validation";

        // Messages d'erreur plus explicites par étape
        const errorMessages: Record<number, string> = {
          1: "Veuillez compléter les informations d'identification de la résidence.",
          2: "Vous devez définir au moins une tranche avec un immeuble.",
          3: "Problème dans la configuration des étages.",
          4: "La nomenclature n'est pas correctement configurée.",
          5: "Vous devez ajouter au moins un local commun.",
        };

        errorMessage = errorMessages[step] || errorMessage;

        toast({
          title: `Erreur - Étape ${step}`,
          description: errorMessage,
          variant: "destructive",
        });
      }
      return false;
    }
  }, [data, step, isStepValid, toast]);

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Validation finale de toutes les étapes
    let allValid = true;
    let invalidStep = 1;

    for (let i = 1; i <= totalSteps; i++) {
      try {
        allSchemas[i - 1].parse(data);
      } catch (e) {
        console.log("Validation échouée à l'étape", i, e);
        allValid = false;
        invalidStep = i;
        break;
      }
    }

    if (!allValid) {
      toast({
        title: "Données incomplètes",
        description: `L'étape ${invalidStep} nécessite des corrections.`,
        variant: "destructive",
      });
      setStep(invalidStep);
      return;
    }

    toast({
      title: "Création en cours",
      description: "La résidence est en cours de création...",
    });

    setIsSubmitting(true);

    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("🏠 Résidence créée :", data);

      toast({
        title: "Succès !",
        description: `La résidence "${data.nom}" a été créée avec succès.`,
      });

      // Réinitialiser le formulaire après succès
      setData({
        ...EMPTY_DATA,
        id: `res-${Date.now()}`,
      });
      setStep(1);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  }, [step, totalSteps, validateCurrentStep]);

  const handlePrev = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const resetForm = useCallback(() => {
    setData({
      ...EMPTY_DATA,
      id: `res-${Date.now()}`,
    });
    setStep(1);
    toast({
      title: "Formulaire réinitialisé",
      description: "Toutes les données ont été effacées.",
    });
  }, [toast]);

  const CurrentStepComponent = stepsComponents[step - 1];
  const isLastStep = step === totalSteps;

  // Calculs memoïsés pour le résumé
  const summaryData = useMemo(() => {
  const totalEtages = data.tranches.reduce(
    (acc, tranche) =>
      acc +
      tranche.immeubles.reduce(
        (trancheAcc, immeuble) => trancheAcc + immeuble.etages.length,
        0
      ),
    0
  );

    const totalAppartements = data.tranches.reduce(
    (acc, tranche) =>
      acc +
      tranche.immeubles.reduce(
        (trancheAcc, immeuble) =>
          trancheAcc +
          immeuble.etages.reduce(
            (etageAcc, etage) => etageAcc + (etage.nbApparts || 0),
            0
          ),
        0
      ),
    0
  );

  return {
    tranchesCount: data.tranches.length,
    immeublesCount: data.tranches.reduce(
      (acc, t) => acc + t.immeubles.length,
      0
    ),
    etagesCount: totalEtages,
    appartementsCount: totalAppartements,
    locauxCommunsCount: data.locauxCommuns?.length || 0, // ← CORRIGÉ
    locauxCommerciauxCount: data.locauxCommerciaux?.length || 0, // ← AJOUTÉ
  };
}, [data.tranches, data.locauxCommuns, data.locauxCommerciaux]); 

  // Vérification si le formulaire a des données
  const hasData = useMemo(() => {
    return (
      data.nom !== "" ||
      data.adresse !== "" ||
      data.tranches.length > 0 ||
      data.locaux.length > 0
    );
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Assistant de Création de Résidence
          </h1>
          <p className="text-muted-foreground">
            Étape {step} sur {totalSteps} - {getStepTitle(step)}
          </p>
        </div>

        <Button
          onClick={resetForm}
          variant="outline"
          className="flex items-center gap-2"
          disabled={!hasData && step === 1}
        >
          <Trash2 className="w-4 h-4" />
          Nouveau
        </Button>
      </div>

      <Progress value={(step / totalSteps) * 100} className="w-full" />

      <CurrentStepComponent data={data} update={updateData} />

      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          onClick={handlePrev}
          disabled={step === 1 || isSubmitting}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </Button>

        <div className="flex items-center gap-2 text-sm">
          {isStepValid ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              Étape valide
            </div>
          ) : (
            <div className="text-amber-600">Données manquantes</div>
          )}
        </div>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isStepValid}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </>
            ) : (
              <>
                Créer la Résidence
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting || !isStepValid}
            className="flex items-center gap-2"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Résumé des données saisies */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Résumé de la résidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            <div>
              <div className="font-medium">Nom</div>
              <div className="text-muted-foreground truncate">
                {data.nom || "Non renseigné"}
              </div>
            </div>
            <div>
              <div className="font-medium">Tranches</div>
              <div className="text-muted-foreground">
                {summaryData.tranchesCount}
              </div>
            </div>
            <div>
              <div className="font-medium">Immeubles</div>
              <div className="text-muted-foreground">
                {summaryData.immeublesCount}
              </div>
            </div>
            <div>
              <div className="font-medium">Étages</div>
              <div className="text-muted-foreground">
                {summaryData.etagesCount}
              </div>
            </div>
            <div>
              <div className="font-medium">Appartements</div>
              <div className="text-muted-foreground">
                {summaryData.appartementsCount}
              </div>
            </div>
            <div>
              <div className="font-medium">Locaux</div>
              <div className="text-muted-foreground">
                {summaryData.locauxCount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getStepTitle(step: number): string {
  const titles = [
    "Identification",
    "Structure",
    "Étages",
    "Appartements",
    "Locaux",
  ];
  return titles[step - 1] || "Configuration";
}
