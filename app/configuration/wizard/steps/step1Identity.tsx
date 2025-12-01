import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResidenceData } from "@/types/residence";

export default function Step1Identity({ data, update }: { data: ResidenceData, update: any }) {
  return (
    <Card>
      <CardHeader><CardTitle>Informations Générales</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        
        {/* Champ 1: Nom de la Résidence (Validé par Zod) */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="nom">Nom de la Résidence</Label>
          <Input 
            id="nom" 
            value={data.nom} 
            onChange={(e) => update({ nom: e.target.value })} 
            placeholder="Ex: Résidence Les Palmiers" 
          />
        </div>

        {/* ➡️ Champ 2: Adresse (Obligatoire par Zod - Ajouté) */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="adresse">Adresse complète</Label>
          <Input 
            id="adresse" 
            value={data.adresse} 
            onChange={(e) => update({ adresse: e.target.value })} 
            placeholder="Ex: 12 Rue du Faubourg Saint-Honoré" 
          />
        </div>

        {/* Champ 3: Ville (Non validé par Zod, mais utile) */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="ville">Ville</Label>
          <Input 
            id="ville" 
            value={data.ville} 
            onChange={(e) => update({ ville: e.target.value })} 
            placeholder="Ex: Casablanca" 
          />
        </div>
      </CardContent>
    </Card>
  );
}