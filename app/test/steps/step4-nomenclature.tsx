'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { StepProps } from '../format/setup';

export const Step4Nomenclature = ({ data, update }: StepProps) => {
    // Assurez-vous que nomenclature existe dans les données
    const nomenclature = data.nomenclature || {
        prefixe: '',
        separateur: '-',
        inclureTranche: false,
        inclureImm: true
    };

    const handleUpdate = (newNomenclature: any) => {
        update({ 
            nomenclature: { ...nomenclature, ...newNomenclature } 
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Étape 4: Nomenclature</CardTitle>
                <CardDescription>Système de nommage des appartements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="prefixe">Préfixe *</Label>
                    <Input
                        id="prefixe"
                        value={nomenclature.prefixe}
                        onChange={(e) => handleUpdate({ prefixe: e.target.value })}
                        placeholder="Ex: LOT, APP, etc."
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="separateur">Séparateur</Label>
                    <Input
                        id="separateur"
                        value={nomenclature.separateur || ''}
                        onChange={(e) => handleUpdate({ separateur: e.target.value })}
                        placeholder="Ex: -, _, etc."
                        maxLength={3}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="inclureTranche"
                        checked={nomenclature.inclureTranche || false}
                        onCheckedChange={(checked) => handleUpdate({ inclureTranche: checked })}
                    />
                    <Label htmlFor="inclureTranche">Inclure la tranche dans la référence</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="inclureImm"
                        checked={nomenclature.inclureImm !== false} // true par défaut
                        onCheckedChange={(checked) => handleUpdate({ inclureImm: checked })}
                    />
                    <Label htmlFor="inclureImm">Inclure l'immeuble dans la référence</Label>
                </div>

                <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Préfixe "{nomenclature.prefixe || '...'}" est défini.</span>
                </div>
            </CardContent>
        </Card>
    );
};