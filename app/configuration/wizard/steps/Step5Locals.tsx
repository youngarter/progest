// steps/Step5Locals.tsx
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ResidenceData, LocalType } from "@/types/residence";

export default function Step5Locals({ data, update }: { data: ResidenceData, update: any }) {
  const [tempType, setTempType] = useState<LocalType>("SYNDIC");
  const [tempNom, setTempNom] = useState("");

  const addLocal = () => {
    if(!tempNom) return;
    update({ locaux: [...data.locaux, { type: tempType, nom: tempNom, surface: 0 }] });
    setTempNom("");
  };

  const removeLocal = (idx: number) => {
      const newLocals = [...data.locaux];
      newLocals.splice(idx, 1);
      update({ locaux: newLocals });
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border">
        <div className="w-[200px] space-y-2">
            <span className="text-sm font-medium">Type</span>
            <Select value={tempType} onValueChange={(v: LocalType) => setTempType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="SYNDIC">Bureau Syndic</SelectItem>
                    <SelectItem value="TECHNIQUE">Local Technique</SelectItem>
                    <SelectItem value="JARDIN">Jardinage</SelectItem>
                    <SelectItem value="LOGE">Loge Gardien</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex-1 space-y-2">
            <span className="text-sm font-medium">Nom</span>
            <Input value={tempNom} onChange={(e) => setTempNom(e.target.value)} placeholder="Ex: Local Piscine A" />
        </div>
        <Button onClick={addLocal}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.locaux.map((local, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 border rounded shadow-sm">
                <div className="flex items-center gap-3">
                    <Badge variant="outline">{local.type}</Badge>
                    <span className="font-medium">{local.nom}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeLocal(idx)}>
                    <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                </Button>
            </div>
        ))}
        {data.locaux.length === 0 && <p className="text-muted-foreground text-sm italic p-4">Aucun local ajouté.</p>}
      </div>
    </div>
  );
}