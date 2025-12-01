'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Building, CheckCircle } from 'lucide-react';
import { StepProps } from '../format/setup';
import { useCallback } from 'react';

export const Step2Structure = ({ data, update }: StepProps) => {
    
    const addTranche = useCallback(() => {
        const newTranche = {
            id: `tranche-${Date.now()}`,
            nom: `Tranche ${data.tranches.length + 1}`,
            immeubles: []
        };
        update({ 
            tranches: [...data.tranches, newTranche] 
        });
    }, [data.tranches, update]);

    const removeTranche = useCallback((trancheId: string) => {
        update({ 
            tranches: data.tranches.filter(t => t.id !== trancheId) 
        });
    }, [data.tranches, update]);

    const addImmeuble = useCallback((trancheId: string) => {
        const updatedTranches = data.tranches.map(tranche => {
            if (tranche.id === trancheId) {
                const newImmeuble = {
                    id: `imm-${Date.now()}`,
                    nom: `Immeuble ${tranche.immeubles.length + 1}`,
                    nombreEtages: 0,
                    etages: []
                };
                return {
                    ...tranche,
                    immeubles: [...tranche.immeubles, newImmeuble]
                };
            }
            return tranche;
        });
        update({ tranches: updatedTranches });
    }, [data.tranches, update]);

    const removeImmeuble = useCallback((trancheId: string, immeubleId: string) => {
        const updatedTranches = data.tranches.map(tranche => {
            if (tranche.id === trancheId) {
                return {
                    ...tranche,
                    immeubles: tranche.immeubles.filter(imm => imm.id !== immeubleId)
                };
            }
            return tranche;
        });
        update({ tranches: updatedTranches });
    }, [data.tranches, update]);

    const updateTranche = useCallback((trancheId: string, field: string, value: string) => {
        const updatedTranches = data.tranches.map(tranche => {
            if (tranche.id === trancheId) {
                return { ...tranche, [field]: value };
            }
            return tranche;
        });
        update({ tranches: updatedTranches });
    }, [data.tranches, update]);

    const updateImmeuble = useCallback((trancheId: string, immeubleId: string, field: string, value: any) => {
        const updatedTranches = data.tranches.map(tranche => {
            if (tranche.id === trancheId) {
                const updatedImmeubles = tranche.immeubles.map(immeuble => {
                    if (immeuble.id === immeubleId) {
                        return { ...immeuble, [field]: value };
                    }
                    return immeuble;
                });
                return { ...tranche, immeubles: updatedImmeubles };
            }
            return tranche;
        });
        update({ tranches: updatedTranches });
    }, [data.tranches, update]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Étape 2: Structure de la Résidence</CardTitle>
                <CardDescription>Définissez les tranches et immeubles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-medium">Tranches</h3>
                        <p className="text-sm text-muted-foreground">
                            Une tranche représente un groupe d'immeubles
                        </p>
                    </div>
                    <Button onClick={addTranche} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter une tranche
                    </Button>
                </div>

                {data.tranches.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Aucune tranche définie</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Commencez par ajouter votre première tranche
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.tranches.map((tranche) => (
                            <div key={tranche.id} className="border rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Input
                                        value={tranche.nom}
                                        onChange={(e) => updateTranche(tranche.id, 'nom', e.target.value)}
                                        className="text-lg font-medium"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeTranche(tranche.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">Immeubles</h4>
                                        <Button 
                                            onClick={() => addImmeuble(tranche.id)} 
                                            size="sm"
                                            className="flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Ajouter un immeuble
                                        </Button>
                                    </div>

                                    {tranche.immeubles.map((immeuble) => (
                                        <div key={immeuble.id} className="flex items-center gap-3 p-3 border rounded">
                                            <Input
                                                value={immeuble.nom}
                                                onChange={(e) => updateImmeuble(tranche.id, immeuble.id, 'nom', e.target.value)}
                                                placeholder="Nom de l'immeuble"
                                            />
                                            <Input
                                                type="number"
                                                value={immeuble.nombreEtages}
                                                onChange={(e) => updateImmeuble(tranche.id, immeuble.id, 'nombreEtages', parseInt(e.target.value) || 0)}
                                                placeholder="Nb étages"
                                                className="w-24"
                                                min="0"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeImmeuble(tranche.id, immeuble.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                        {data.tranches.length} tranche(s) et {' '}
                        {data.tranches.reduce((acc, t) => acc + t.immeubles.length, 0)} immeuble(s) définis.
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};