// steps/Step3Details.tsx
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ResidenceData, EtageConfig } from "@/types/residence";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Step3Details({ data, update }: { data: ResidenceData, update: any }) {
    const [selectedTrancheIdx, setSelectedTrancheIdx] = useState(0);
    const [selectedImmIdx, setSelectedImmIdx] = useState(0);

    // Valeurs temporaires pour le configurateur
    const [nbEtages, setNbEtages] = useState(4);
    const [aptsParEtage, setAptsParEtage] = useState(2);
    const [hasRDC, setHasRDC] = useState(true);

    // Fonction pour générer les étages
    const applyConfiguration = () => {
        // 1. Définir les nouveaux étages (la logique de construction est correcte)
        const floors: EtageConfig[] = [];

        if (hasRDC) {
            floors.push({ numero: 0, label: "RDC", nbApparts: aptsParEtage });
        }
        for (let i = 1; i <= nbEtages; i++) {
            floors.push({ numero: i, label: `Etage ${i}`, nbApparts: aptsParEtage });
        }

        // 2. Mettre à jour l'état global en garantissant l'immutabilité
        const newTranches = [...data.tranches];

        // Créer une COPIE de l'immeuble ciblé avec les NOUVEAUX étages
        const updatedImmeuble = {
            ...newTranches[selectedTrancheIdx].immeubles[selectedImmIdx],
            etages: floors,
        };

        // Créer une COPIE du tableau d'immeubles de la tranche, en remplaçant l'ancien Immeuble par la version mise à jour
        const updatedImmeublesList = newTranches[selectedTrancheIdx].immeubles.map((imm, idx) =>
            idx === selectedImmIdx ? updatedImmeuble : imm
        );

        // Créer une COPIE de la tranche avec la nouvelle liste d'immeubles
        const updatedTranche = {
            ...newTranches[selectedTrancheIdx],
            immeubles: updatedImmeublesList,
        };

        // Remplacer l'ancienne tranche par la nouvelle dans la liste des tranches
        newTranches[selectedTrancheIdx] = updatedTranche;

        // 3. Persister le changement (déclenche le rafraîchissement)
        update({ tranches: newTranches });

        // Afficher un succès pour le développeur (facultatif)
        toast.success(`${updatedImmeuble.nom} configuré avec ${floors.length} niveaux.`, { duration: 1500 });
    };

    const currentImm = data.tranches[selectedTrancheIdx]?.immeubles[selectedImmIdx];

    if (!currentImm) return <div>Veuillez ajouter des immeubles à l'étape précédente.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Colonne gauche: Sélection */}
            <Card className="md:col-span-1 bg-slate-50">
                <CardContent className="pt-6 space-y-4">
                    <Label>Choisir l'Immeuble à configurer</Label>
                    <Select
                        onValueChange={(val) => setSelectedTrancheIdx(Number(val))}
                        defaultValue={String(selectedTrancheIdx)}
                    >
                        <SelectTrigger><SelectValue placeholder="Tranche" /></SelectTrigger>
                        <SelectContent>
                            {data.tranches.map((t, idx) => <SelectItem key={t.id} value={String(idx)}>{t.nom}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <div className="space-y-1">
                        {data.tranches[selectedTrancheIdx]?.immeubles.map((imm, idx) => (
                            <div
                                key={imm.id}
                                onClick={() => setSelectedImmIdx(idx)}
                                className={`p-2 rounded cursor-pointer text-sm flex justify-between ${selectedImmIdx === idx ? 'bg-primary text-primary-foreground' : 'hover:bg-slate-200'}`}
                            >
                                <span>{imm.nom}</span>
                                <span className="text-xs opacity-80">{imm.etages.length > 0 ? "Configuré" : "Vide"}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Colonne droite: Configurateur */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">Configuration de {currentImm.nom}</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mode Rapide</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Nombre d'étages (hors RDC)</Label>
                                <span className="font-bold">{nbEtages}</span>
                            </div>
                            <Slider value={[nbEtages]} onValueChange={(v) => setNbEtages(v[0])} max={20} step={1} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Appartements par étage (Standard)</Label>
                                <span className="font-bold">{aptsParEtage}</span>
                            </div>
                            <Slider value={[aptsParEtage]} onValueChange={(v) => setAptsParEtage(v[0])} max={10} step={1} />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="rdc-mode" checked={hasRDC} onCheckedChange={setHasRDC} />
                            <Label htmlFor="rdc-mode">Inclure un Rez-de-chaussée</Label>
                        </div>

                        <Button onClick={applyConfiguration} className="w-full">Générer la structure</Button>
                    </CardContent>
                </Card>

                {/* Prévisualisation simple */}
                {currentImm.etages.length > 0 && (
                    <div className="bg-white border rounded-md p-4">
                        <h4 className="font-semibold mb-3">Aperçu : {currentImm.etages.length} niveaux</h4>
                        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
                            {[...currentImm.etages].reverse().map((etage) => (
                                <div key={etage.numero} className="flex justify-between text-sm p-2 bg-slate-50 rounded border">
                                    <span>{etage.label}</span>
                                    <span className="text-muted-foreground">{etage.nbApparts} Apparts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}