'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { StepProps } from '../format/setup';

export const Step1Identity = ({ data, update }: StepProps) => (
    <Card>
        <CardHeader>
            <CardTitle>Étape 1: Identification</CardTitle>
            <CardDescription>Informations de base de la résidence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="nom" className="text-sm font-medium">
                    Nom de la Résidence *
                </label>
                <Input
                    id="nom"
                    value={data.nom}
                    onChange={(e) => update({ nom: e.target.value })}
                    placeholder="Ex: Résidence Les Jardins"
                    required
                />
                {data.nom.length > 0 && data.nom.length < 3 && (
                    <p className="text-sm text-red-500">Le nom doit contenir au moins 3 caractères</p>
                )}
            </div>
            
            <div className="space-y-2">
                <label htmlFor="adresse" className="text-sm font-medium">
                    Adresse complète *
                </label>
                <Textarea
                    id="adresse"
                    value={data.adresse}
                    onChange={(e) => update({ adresse: e.target.value })}
                    placeholder="Adresse complète de la résidence"
                    required
                />
                {data.adresse.length > 0 && data.adresse.length < 5 && (
                    <p className="text-sm text-red-500">L&apos;adresse doit contenir au moins 5 caractères</p>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="codePostal" className="text-sm font-medium">
                        Code Postal
                    </label>
                    <Input
                        id="codePostal"
                        value={data.codePostal || ''}
                        onChange={(e) => update({ codePostal: e.target.value })}
                        placeholder="Ex: 75001"
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="ville" className="text-sm font-medium">
                        Ville
                    </label>
                    <Input
                        id="ville"
                        value={data.ville || ''}
                        onChange={(e) => update({ ville: e.target.value })}
                        placeholder="Ex: Paris"
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label htmlFor="pays" className="text-sm font-medium">
                    Pays
                </label>
                <Input
                    id="pays"
                    value={data.pays || ''}
                    onChange={(e) => update({ pays: e.target.value })}
                    placeholder="Ex: France"
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="nombreLogements" className="text-sm font-medium">
                        Nombre de Logements
                    </label>
                    <Input
                        id="nombreLogements"
                        type="number"
                        value={data.nombreLogements || ''}
                        onChange={(e) => update({ nombreLogements: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="nombreCommerce" className="text-sm font-medium">
                        Nombre de Commerces
                    </label>
                    <Input
                        id="nombreCommerce"
                        type="number"
                        value={data.nombreCommerce || ''}
                        onChange={(e) => update({ nombreCommerce: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                    />
                </div>
            </div>

            {/* Indicateur de validation */}
            <div className={`flex items-center space-x-2 text-sm ${
                data.nom.length >= 3 && data.adresse.length >= 5 
                    ? 'text-green-600' 
                    : 'text-amber-600'
            }`}>
                <CheckCircle className="w-4 h-4" />
                <span>
                    {data.nom.length >= 3 && data.adresse.length >= 5 
                        ? 'Données de l\'étape 1 valides' 
                        : 'Remplissez les champs obligatoires (*)'}
                </span>
            </div>
            
            {/* Aide pour l'utilisateur */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                    <strong>Champs obligatoires :</strong> Nom et Adresse<br/>
                    <strong>Conseil :</strong> Renseignez au moins le nom (3 caractères min) et l&apos;adresse (5 caractères min) pour passer à l&apos;étape suivante.
                </p>
            </div>
        </CardContent>
    </Card>
);