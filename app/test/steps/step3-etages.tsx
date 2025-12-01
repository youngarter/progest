'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { StepProps } from '../format/setup';

export const Step3Etages = ({ data, update }: StepProps) => (
    <Card>
        <CardHeader>
            <CardTitle>Étape 3: Détails des Étages</CardTitle>
            <CardDescription>Configuration des étages par immeuble</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Tous les immeubles ont leurs 5 étages configurés.</span>
            </div>
            {/* Add your etages form fields here */}
        </CardContent>
    </Card>
);