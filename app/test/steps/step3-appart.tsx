'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Calculator, Building } from 'lucide-react';
import { StepProps } from '../format/setup';
import { useState, useEffect } from 'react';

export const Step3Appart = ({ data, update }: StepProps) => {
    const [expandedImmeuble, setExpandedImmeuble] = useState<string | null>(null);
    const [nomenclatureType, setNomenclatureType] = useState<'tranche-imm-etage' | 'imm-etage' | 'simple'>('tranche-imm-etage');

    // Types de nomenclature disponibles
    const nomenclatureOptions = [
        {
            id: 'tranche-imm-etage',
            label: 'TRANCHE-IMM-ETAGE-NUMAPP',
            description: 'Ex: A-B-1-01, A-B-2-01',
            pattern: (tranche: string, imm: string, etage: number, app: number) => 
                `${tranche}-${imm}-${etage}-${app.toString().padStart(2, '0')}`
        },
        {
            id: 'imm-etage',
            label: 'IMM-ETAGE-NUMAPP',
            description: 'Ex: B-1-01, B-2-01', 
            pattern: (tranche: string, imm: string, etage: number, app: number) =>
                `${imm}-${etage}-${app.toString().padStart(2, '0')}`
        },
        {
            id: 'simple',
            label: 'NUMAPP Simple',
            description: 'Ex: 001, 002, 003',
            pattern: (tranche: string, imm: string, etage: number, app: number) =>
                `${app.toString().padStart(3, '0')}`
        }
    ];

    // Initialiser automatiquement les étages basés sur les données de l'étape 2
    useEffect(() => {
        if (data.tranches.length > 0) {
            const needsInitialization = data.tranches.some(tranche =>
                tranche.immeubles.some(immeuble =>
                    !immeuble.etages || immeuble.etages.length !== immeuble.nombreEtages
                )
            );

            if (needsInitialization) {
                const tranches = data.tranches.map(tranche => ({
                    ...tranche,
                    immeubles: tranche.immeubles.map(immeuble => ({
                        ...immeuble,
                        etages: Array.from({ length: immeuble.nombreEtages }, (_, i) => ({
                            numero: i,
                            label: `Étage ${i}`,
                            nbApparts: immeuble.nbAppartsParEtage || 0
                        }))
                    }))
                }));
                update({ tranches });
            }
        }
    }, [data.tranches, update]);

    // Générer les appartements basés sur la nomenclature sélectionnée
    const generateAppartements = () => {
        const selectedNomenclature = nomenclatureOptions.find(opt => opt.id === nomenclatureType);
        if (!selectedNomenclature) return;

        let appCounter = 1;
        const appartements = [];

        for (const tranche of data.tranches) {
            const trancheCode = tranche.nom.charAt(0).toUpperCase(); // Première lettre de la tranche
            
            for (const immeuble of tranche.immeubles) {
                const immCode = immeuble.nom.charAt(0).toUpperCase(); // Première lettre de l'immeuble
                
                for (const etage of immeuble.etages) {
                    for (let i = 1; i <= etage.nbApparts; i++) {
                        const reference = selectedNomenclature.pattern(trancheCode, immCode, etage.numero, appCounter);
                        
                        appartements.push({
                            reference,
                            trancheId: tranche.id,
                            immeubleId: immeuble.id,
                            etageNumero: etage.numero,
                            nomenclature: data.nomenclature,
                            appartementIndex: appCounter,
                            statut: 'Promoteur' as const,
                            ownerId: undefined,
                            locataireId: undefined
                        });
                        
                        appCounter++;
                    }
                }
            }
        }

        // Mettre à jour les données avec les appartements générés
        update({ 
            ...data,
            appartements 
        });

        return appartements;
    };

    const handleEtageChange = (
        trancheIndex: number, 
        immeubleIndex: number, 
        etageIndex: number, 
        field: 'numero' | 'label' | 'nbApparts', 
        value: any
    ) => {
        const tranches = [...data.tranches];
        const etage = tranches[trancheIndex].immeubles[immeubleIndex].etages[etageIndex];
        
        if (field === 'nbApparts') {
            etage[field] = parseInt(value) || 0;
        } else if (field === 'numero') {
            etage[field] = parseInt(value) || 0;
        } else {
            etage[field] = value;
        }
        
        update({ tranches });
    };

    const isEtagesComplete = () => {
        return data.tranches.length > 0 && 
            data.tranches.every(tranche =>
                tranche.immeubles.every(immeuble =>
                    immeuble.etages && 
                    immeuble.etages.length === immeuble.nombreEtages &&
                    immeuble.etages.every(etage => 
                        etage.label && etage.label.trim() !== '' && 
                        etage.nbApparts >= 0
                    )
                )
            );
    };

    const getTotalAppartements = () => {
        return data.tranches.reduce((total, tranche) =>
            total + tranche.immeubles.reduce((trancheTotal, immeuble) =>
                trancheTotal + (immeuble.etages ? immeuble.etages.reduce((immeubleTotal, etage) =>
                    immeubleTotal + (etage.nbApparts || 0), 0
                ) : 0), 0
            ), 0
        );
    };

    const getTotalEtages = () => {
        return data.tranches.reduce((total, tranche) =>
            total + tranche.immeubles.reduce((trancheTotal, immeuble) =>
                trancheTotal + (immeuble.etages?.length || 0), 0
            ), 0
        );
    };

    const toggleImmeuble = (immeubleId: string) => {
        setExpandedImmeuble(expandedImmeuble === immeubleId ? null : immeubleId);
    };

    const handleGenerateAppartements = () => {
        const generatedAppartements = generateAppartements();
        if (generatedAppartements) {
            // Afficher un message de succès
            console.log(`✅ ${generatedAppartements.length} appartements générés avec la nomenclature: ${nomenclatureType}`);
        }
    };

    if (data.tranches.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Étape 3: Configuration des Appartements</CardTitle>
                    <CardDescription>
                        Configurez la nomenclature et générez les appartements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucun immeuble configuré</h3>
                        <p className="text-muted-foreground mb-4">
                            Vous devez d&apos;abord configurer la structure des tranches et immeubles à l&apos;étape 2.
                        </p>
                        <Button 
                            variant="outline"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            Retour à l&apos;étape 2
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Étape 3: Configuration des Appartements</CardTitle>
                <CardDescription>
                    Choisissez la nomenclature et générez automatiquement les appartements
                    {isEtagesComplete() && (
                        <div className="flex items-center space-x-2 text-sm text-green-600 mt-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Tous les étages sont correctement configurés.</span>
                        </div>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Sélection de la nomenclature */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Nomenclature des Appartements
                        </CardTitle>
                        <CardDescription>
                            Choisissez le format de référence pour vos appartements
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup 
                            value={nomenclatureType} 
                            onValueChange={(value: 'tranche-imm-etage' | 'imm-etage' | 'simple') => 
                                setNomenclatureType(value)
                            }
                            className="space-y-3"
                        >
                            {nomenclatureOptions.map((option) => (
                                <div key={option.id} className="flex items-center space-x-3 space-y-0 rounded-lg border p-4 hover:bg-white/50 transition-colors">
                                    <RadioGroupItem value={option.id} id={option.id} />
                                    <Label htmlFor={option.id} className="flex flex-col space-y-1 cursor-pointer">
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-sm text-muted-foreground">{option.description}</span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                {data.appartements && data.appartements.length > 0 ? (
                                    <span className="text-green-600 font-medium">
                                        ✅ {data.appartements.length} appartements générés
                                    </span>
                                ) : (
                                    <span>Appartements non générés</span>
                                )}
                            </div>
                            <Button 
                                onClick={handleGenerateAppartements}
                                disabled={!isEtagesComplete()}
                                className="flex items-center gap-2"
                            >
                                <Calculator className="w-4 h-4" />
                                Générer les Appartements
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Aperçu de la nomenclature sélectionnée */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-md">Aperçu de la Nomenclature</CardTitle>
                        <CardDescription>
                            Exemples de références générées avec le format sélectionné
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {data.tranches.slice(0, 1).map((tranche, tIndex) => 
                                tranche.immeubles.slice(0, 1).map((immeuble, iIndex) => {
                                    const selectedNomenclature = nomenclatureOptions.find(opt => opt.id === nomenclatureType);
                                    const trancheCode = tranche.nom.charAt(0).toUpperCase();
                                    const immCode = immeuble.nom.charAt(0).toUpperCase();
                                    
                                    return (
                                        <div key={`preview-${tIndex}-${iIndex}`} className="space-y-2">
                                            <div className="font-medium">{tranche.nom} - {immeuble.nom}</div>
                                            <div className="space-y-1 text-muted-foreground">
                                                {[1, 2].map((appNum) => (
                                                    <div key={appNum} className="font-mono text-xs">
                                                        {selectedNomenclature?.pattern(trancheCode, immCode, 1, appNum)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Résumé avec comparaison */}
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calculator className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-900">Calculs de l&apos;étape 2</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{getTotalEtages()}</div>
                                <div className="text-green-800">Étages configurés</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{getTotalAppartements()}</div>
                                <div className="text-green-800">Appartements total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {data.tranches.reduce((total, tranche) => 
                                        total + tranche.immeubles.reduce((trancheTotal, immeuble) => 
                                            trancheTotal + (immeuble.nombreEtages || 0), 0
                                        ), 0
                                    )}
                                </div>
                                <div className="text-green-800">Étages prévus</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {data.tranches.reduce((total, tranche) => 
                                        total + tranche.immeubles.reduce((trancheTotal, immeuble) => 
                                            trancheTotal + ((immeuble.nbAppartsParEtage || 0) * (immeuble.nombreEtages || 0)), 0
                                        ), 0
                                    )}
                                </div>
                                <div className="text-green-800">Apparts prévus</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Configuration par immeuble */}
                {data.tranches.map((tranche, trancheIndex) => (
                    <div key={tranche.id} className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                            Tranche: {tranche.nom}
                        </h3>
                        
                        {tranche.immeubles.map((immeuble, immeubleIndex) => {
                            const immeubleId = `${tranche.id}-${immeuble.id}`;
                            const isExpanded = expandedImmeuble === immeubleId;
                            const isComplete = immeuble.etages && 
                                             immeuble.etages.length === immeuble.nombreEtages;

                            return (
                                <div key={immeuble.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <h4 className="font-medium">{immeuble.nom}</h4>
                                            <div className="text-sm text-muted-foreground">
                                                {immeuble.nombreEtages} étages • {immeuble.nbAppartsParEtage} apparts/étage
                                            </div>
                                            {isComplete ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleImmeuble(immeubleId)}
                                            className="flex items-center gap-2"
                                        >
                                            {isExpanded ? 'Réduire' : 'Développer'}
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </Button>
                                    </div>

                                    {/* Détails des étages */}
                                    {isExpanded && immeuble.etages && (
                                        <div className="space-y-3 mt-4">
                                            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground mb-2">
                                                <div className="col-span-2">Numéro</div>
                                                <div className="col-span-5">Label</div>
                                                <div className="col-span-3">Nb. apparts</div>
                                                <div className="col-span-2">Actions</div>
                                            </div>
                                            
                                            {immeuble.etages.map((etage, etageIndex) => (
                                                <div key={etageIndex} className="grid grid-cols-12 gap-2 items-center">
                                                    <div className="col-span-2">
                                                        <Input
                                                            type="number"
                                                            value={etage.numero}
                                                            onChange={(e) => 
                                                                handleEtageChange(
                                                                    trancheIndex,
                                                                    immeubleIndex,
                                                                    etageIndex,
                                                                    'numero',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <Input
                                                            value={etage.label}
                                                            onChange={(e) => 
                                                                handleEtageChange(
                                                                    trancheIndex,
                                                                    immeubleIndex,
                                                                    etageIndex,
                                                                    'label',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Ex: Rez-de-chaussée, 1er étage..."
                                                        />
                                                    </div>
                                                    <div className="col-span-3">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={etage.nbApparts}
                                                            onChange={(e) => 
                                                                handleEtageChange(
                                                                    trancheIndex,
                                                                    immeubleIndex,
                                                                    etageIndex,
                                                                    'nbApparts',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={true}
                                                            title="La suppression d&apos;étages se fait à l&apos;étape 2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* Instructions */}
                <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Information :</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Les étages ont été <strong>générés automatiquement</strong> depuis les données de l&apos;étape 2</li>
                        <li>Choisissez une <strong>nomenclature</strong> pour le nommage des appartements</li>
                        <li>Cliquez sur <strong>&quot;Générer les Appartements&quot;</strong> pour créer automatiquement toutes les références</li>
                        <li>Les références seront utilisées dans les étapes suivantes pour la gestion des propriétaires et locataires</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};