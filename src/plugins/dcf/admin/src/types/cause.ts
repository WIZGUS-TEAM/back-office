interface Donation {
    amount: number;
}

export interface Cause {
    id: number;
    documentId: string;
    name: string;
    description: string;
    state: 'Refusée' | 'En examen' | 'Validée' | 'En attente de retrait' | 'Terminée';
    donationGoal: number;
    currentDonations: number;
    endDate: string;
    association: {
        id: string;
        name: string;
    };
}

export interface CreateCauseDto {
    name: string;
    description: string;
    donationGoal: number;
} 