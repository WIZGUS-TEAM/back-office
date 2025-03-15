import { Cause } from './cause';

export interface Donation {
    id: number;
    documentId: string;
    amount: number;
    cause: Cause;
    company: {
        id: number;
        name: string;
    };
    date: string;
}

export interface DonationResponse {
    data: Donation[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
} 