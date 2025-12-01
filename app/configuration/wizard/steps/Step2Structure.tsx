// steps/Step2Structure.tsx
import { useState } from "react";
import { Plus, Trash2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResidenceData, Tranche } from "@/types/residence";
import { Separator } from "@/components/ui/separator";

export default function Step2Structure({ data, update }: { data: ResidenceData, update: any }) {
  
  const addTranche = () => {
    const newTranche: Tranche = { 
      id: crypto.randomUUID(), 
      nom: `Tranche ${data.tranches.length + 1}`, 
      immeubles: [] 
    };
    update({ tranches: [...data.tranches, newTranche] });
  };

  const addImmeuble = (trancheIndex: number) => {
    const newTranches = [...data.tranches];
    newTranches[trancheIndex].immeubles.push({
      id: crypto.randomUUID(),
      nom: `Imm ${String.fromCharCode(65 + newTranches[trancheIndex].immeubles.length)}`, // A, B, C...
      etages: [] // Sera configuré à l'étape suivante
    });
    update({ tranches: newTranches });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Structure de la Copropriété</h2>
        <Button onClick={addTranche} size="sm"><Plus className="mr-2 h-4 w-4" /> Ajouter une Tranche</Button>
      </div>

      {data.tranches.map((tranche, tIndex) => (
        <Card key={tranche.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
               <Input 
                 className="font-bold w-[200px]" 
                 value={tranche.nom} 
                 onChange={(e) => {
                    const newT = [...data.tranches];
                    newT[tIndex].nom = e.target.value;
                    update({ tranches: newT });
                 }}
               />
               <span className="text-sm text-muted-foreground">{tranche.immeubles.length} immeubles</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => {/* Logique suppression */}}><Trash2 className="h-4 w-4 text-red-500"/></Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tranche.immeubles.map((imm, iIndex) => (
                <div key={imm.id} className="p-3 border rounded-lg bg-slate-50 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Building className="h-4 w-4 text-slate-500"/>
                    <Input 
                      className="h-7 text-xs" 
                      value={imm.nom} 
                      onChange={(e) => {
                         const newT = [...data.tranches];
                         newT[tIndex].immeubles[iIndex].nom = e.target.value;
                         update({ tranches: newT });
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="h-full min-h-[60px] border-dashed" onClick={() => addImmeuble(tIndex)}>
                <Plus className="h-4 w-4 mr-1"/> Ajouter Imm
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}