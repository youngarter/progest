'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { StepProps } from '../format/setup';

export const Step5Locaux = ({ data, update }: StepProps) => (
    <Card>
        <CardHeader>
            <CardTitle>Étape 5: Locaux Communs</CardTitle>
            <CardDescription>Espaces communs de la résidence</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Deux locaux communs sont définis.</span>
            </div>
            {/* Add your locaux form fields here */}
        </CardContent>
    </Card>
);