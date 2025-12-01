'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Building, Home, Calculator, Hash } from 'lucide-react';
import { StepProps, Immeuble, Tranche } from '../format/setup';

export const Step2Structure = ({ data, update }: StepProps) => {
    const addTranche = () => {
        const newTranche: Tranche = {
            id: `tranche-${Date.now()}`,
            nom: `Tranche ${data.tranches.length + 1}`,
            code: String.fromCharCode(65 + data.tranches.length), // A, B, C, ...
            description: '',
            immeubles: []
        };
        update({
            tranches: [...data.tranches, newTranche]
        });
    };

    const removeTranche = (index: number) => {
        const newTranches = data.tranches.filter((_, i) => i !== index);
        update({ tranches: newTranches });
    };

    const updateTranche = (index: number, field: keyof Tranche, value: any) => {
        const newTranches = [...data.tranches];
        if (field === 'code') {
            // Convertir en majuscules
            newTranches[index] = { ...newTranches[index], [field]: value.toUpperCase() };
        } else {
            newTranches[index] = { ...newTranches[index], [field]: value };
        }
        update({ tranches: newTranches });
    };

    const addImmeuble = (trancheIndex: number) => {
        const tranches = [...data.tranches];
        const tranche = tranches[trancheIndex];
        
        const newImmeuble: Immeuble = {
            id: `imm-${Date.now()}`,
            nom: `Immeuble ${tranche.immeubles.length + 1}`,
            code: String.fromCharCode(65 + tranche.immeubles.length), // A, B, C, ...
            nombreEtages: 4,
            nbAppartsParEtage: 2,
            etages: [],
        };

        tranche.immeubles.push(newImmeuble);
        update({ tranches });
    };

    const removeImmeuble = (trancheIndex: number, immeubleIndex: number) => {
        const tranches = [...data.tranches];
        tranches[trancheIndex].immeubles = tranches[trancheIndex].immeubles.filter((_, i) => i !== immeubleIndex);
        update({ tranches });
    };

    const updateImmeuble = (
        trancheIndex: number, 
        immeubleIndex: number, 
        field: keyof Immeuble, 
        value: any
    ) => {
        const tranches = [...data.tranches];
        const immeuble = tranches[trancheIndex].immeubles[immeubleIndex];
        
        if (field === 'nombreEtages' || field === 'nbAppartsParEtage') {
            (immeuble[field] as number) = Math.max(1, parseInt(value) || 1);
        } else if (field === 'code') {
            // Convertir en majuscules
            (immeuble[field] as string) = value.toUpperCase();
        } else {
            (immeuble[field] as string) = value;
        }
        
        update({ tranches });
    };

    const totalImmeubles = data.tranches.reduce((total, tranche) => total + tranche.immeubles.length, 0);
    const totalEtages = data.tranches.reduce((total, tranche) => 
        total + tranche.immeubles.reduce((trancheTotal, immeuble) => 
            trancheTotal + (immeuble.nombreEtages || 0), 0
        ), 0
    );
    const totalAppartements = data.tranches.reduce((total, tranche) => 
        total + tranche.immeubles.reduce((trancheTotal, immeuble) => 
            trancheTotal + ((immeuble.nbAppartsParEtage || 0) * (immeuble.nombreEtages || 0)), 0
        ), 0
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Étape 2: Structure des Bâtiments</CardTitle>
                <CardDescription>
                    Définissez l&apos;organisation en tranches et immeubles de votre résidence
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Section Tranches */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Tranches
                        </h3>
                        <Button onClick={addTranche} size="sm" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une tranche
                        </Button>
                    </div>

                    {data.tranches.length === 0 ? (
                        <div className="text-center p-8 border-2 border-dashed rounded-lg">
                            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                Aucune tranche définie. Commencez par ajouter votre première tranche.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.tranches.map((tranche, trancheIndex) => (
                                <Card key={tranche.id} className="relative">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor={`tranche-nom-${trancheIndex}`}>
                                                        Nom de la tranche
                                                    </Label>
                                                    <Input
                                                        id={`tranche-nom-${trancheIndex}`}
                                                        value={tranche.nom}
                                                        onChange={(e) => updateTranche(trancheIndex, 'nom', e.target.value)}
                                                        placeholder="Ex: Tranche A, Résidence Principale..."
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`tranche-code-${trancheIndex}`} className="flex items-center gap-1">
                                                        <Hash className="w-3 h-3" />
                                                        Code de la tranche
                                                    </Label>
                                                    <Input
                                                        id={`tranche-code-${trancheIndex}`}
                                                        value={tranche.code}
                                                        onChange={(e) => updateTranche(trancheIndex, 'code', e.target.value)}
                                                        placeholder="Ex: A, B, NORD..."
                                                        className="mt-1 uppercase"
                                                        maxLength={3}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`tranche-desc-${trancheIndex}`}>
                                                        Description (optionnel)
                                                    </Label>
                                                    <Input
                                                        id={`tranche-desc-${trancheIndex}`}
                                                        value={tranche.description || ''}
                                                        onChange={(e) => updateTranche(trancheIndex, 'description', e.target.value)}
                                                        placeholder="Brève description..."
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                            {data.tranches.length > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeTranche(trancheIndex)}
                                                    className="ml-4"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Section Immeubles pour cette tranche */}
                                        <div className="space-y-4 mt-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium flex items-center gap-2">
                                                    <Home className="w-4 h-4" />
                                                    Immeubles de cette tranche
                                                </h4>
                                                <Button 
                                                    onClick={() => addImmeuble(trancheIndex)} 
                                                    size="sm" 
                                                    variant="outline"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Ajouter un immeuble
                                                </Button>
                                            </div>

                                            {tranche.immeubles.length === 0 ? (
                                                <div className="text-center p-4 border-2 border-dashed rounded-lg">
                                                    <p className="text-muted-foreground">
                                                        Aucun immeuble dans cette tranche. Ajoutez votre premier immeuble.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {tranche.immeubles.map((immeuble, immeubleIndex) => (
                                                        <Card key={immeuble.id} className="relative">
                                                            <CardContent className="p-4 space-y-3">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h5 className="font-medium text-sm">
                                                                            {immeuble.nom}
                                                                        </h5>
                                                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                            <Hash className="w-3 h-3" />
                                                                            Code: {immeuble.code}
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => removeImmeuble(trancheIndex, immeubleIndex)}
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <Label className="text-xs">
                                                                                Nom de l&apos;immeuble
                                                                            </Label>
                                                                            <Input
                                                                                value={immeuble.nom}
                                                                                onChange={(e) => updateImmeuble(trancheIndex, immeubleIndex, 'nom', e.target.value)}
                                                                                placeholder="Ex: Immeuble A, Bâtiment Central..."
                                                                                className="h-8 text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs">
                                                                                Code
                                                                            </Label>
                                                                            <Input
                                                                                value={immeuble.code}
                                                                                onChange={(e) => updateImmeuble(trancheIndex, immeubleIndex, 'code', e.target.value)}
                                                                                placeholder="Ex: A, B, I, II..."
                                                                                className="h-8 text-sm uppercase"
                                                                                maxLength={3}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <Label className="text-xs">
                                                                                Nombre d&apos;étages
                                                                            </Label>
                                                                            <Input
                                                                                type="number"
                                                                                min="1"
                                                                                max="50"
                                                                                value={immeuble.nombreEtages}
                                                                                onChange={(e) => updateImmeuble(trancheIndex, immeubleIndex, 'nombreEtages', e.target.value)}
                                                                                placeholder="Ex: 4, 5, 10..."
                                                                                className="h-8 text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs">
                                                                                Appartements par étage
                                                                            </Label>
                                                                            <Input
                                                                                type="number"
                                                                                min="1"
                                                                                max="20"
                                                                                value={immeuble.nbAppartsParEtage}
                                                                                onChange={(e) => updateImmeuble(trancheIndex, immeubleIndex, 'nbAppartsParEtage', e.target.value)}
                                                                                placeholder="Ex: 2, 4, 6..."
                                                                                className="h-8 text-sm"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="text-xs text-muted-foreground pt-2 border-t">
                                                                    {immeuble.nbAppartsParEtage && immeuble.nombreEtages ? (
                                                                        <span>
                                                                            Total: {immeuble.nbAppartsParEtage * immeuble.nombreEtages} appartements
                                                                        </span>
                                                                    ) : (
                                                                        <span>Renseignez les informations pour voir le total</span>
                                                                    )}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Résumé avec calculs */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calculator className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-blue-900">Résumé des calculs</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{data.tranches.length}</div>
                                <div className="text-blue-800">Tranche(s)</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{totalImmeubles}</div>
                                <div className="text-blue-800">Immeuble(s)</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{totalEtages}</div>
                                <div className="text-blue-800">Étages total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{totalAppartements}</div>
                                <div className="text-blue-800">Appartements total</div>
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-blue-700 text-center">
                            Ces calculs seront utilisés pour pré-remplir l&apos;étape 3
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Conseils :</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Une <strong>tranche</strong> représente un groupe d&apos;immeubles (ex: &quot;Tranche A&quot;, &quot;Résidence Sud&quot;)</li>
                        <li>Le <strong>code</strong> de la tranche sera utilisé dans les références des appartements</li>
                        <li>Un <strong>immeuble</strong> est un bâtiment individuel avec ses propres étages</li>
                        <li>Le <strong>nombre d&apos;étages</strong> sera utilisé pour générer automatiquement les étapes suivantes</li>
                        <li>Les <strong>appartements par étage</strong> aident à pré-configurer la distribution</li>
                        <li>Le <strong>code de l&apos;immeuble</strong> sera utilisé dans les références des appartements</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};