// steps/Step4Nomenclature.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ResidenceData } from "@/types/residence";

export default function Step4Nomenclature({ data, update }: { data: ResidenceData, update: any }) {
  
  // Exemple dynamique
  const demoTranche = data.tranches[0]?.nom || "T1";
  const demoImm = data.tranches[0]?.immeubles[0]?.nom || "A";
  const separateur = data.nomenclature.separateur;
  
  // Logique de construction de l'exemple
  const example = `
    ${data.nomenclature.prefixe}${separateur}
    ${data.nomenclature.inclureTranche ? "T1" + separateur : ""}
    ${data.nomenclature.inclureImm ? "A" + separateur : ""}
    ET2${separateur}04
  `.replace(/\s/g, "");

  const updateNom = (field: string, value: any) => {
      update({ nomenclature: { ...data.nomenclature, [field]: value } });
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 text-white">
        <CardContent className="pt-6 text-center">
            <p className="text-slate-400 text-sm mb-2">Aperçu d'une clé d'appartement</p>
            <div className="text-3xl font-mono tracking-widest">{example}</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <Label>Préfixe</Label>
            <Input value={data.nomenclature.prefixe} onChange={(e) => updateNom('prefixe', e.target.value)} />
        </div>
        <div className="space-y-4">
            <Label>Séparateur</Label>
            <Select value={data.nomenclature.separateur} onValueChange={(v) => updateNom('separateur', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="-">- (Tiret)</SelectItem>
                    <SelectItem value="_">_ (Underscore)</SelectItem>
                    <SelectItem value=".">. (Point)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center space-x-2">
            <Switch checked={data.nomenclature.inclureTranche} onCheckedChange={(c) => updateNom('inclureTranche', c)} />
            <Label>Inclure le nom de la Tranche</Label>
        </div>
        <div className="flex items-center space-x-2">
             <Switch checked={data.nomenclature.inclureImm} onCheckedChange={(c) => updateNom('inclureImm', c)} />
            <Label>Inclure le nom de l'Immeuble</Label>
        </div>
      </div>
    </div>
  );
}