import { api } from './axios-client';

export interface Property {
    id: number;
    title: string;
    description: string;
    type: string;
    purpose: string;
    price: number;
    area_sqft: number;
    bedrooms: number;
    bathrooms: number;
    emirate: string;
    location: string;
    images: string[];
    features: string[];
    status: 'active' | 'closed' | 'sold' | 'rented';
    createdAt: string;
    updatedAt: string;
    owner_id: number;
    company_id: number;
    owner?: any;
    // ... potentially other fields
}

export async function getNewArrivals(limit: number = 6): Promise<Property[]> {
    const { data } = await api.get(`/properties/new-arrivals/${limit}`);
    return data.properties || [];
}

export async function getAllProperties(params: any = {}): Promise<Property[]> {
    // By default, only show active/available properties for public listings
    // Unless explicitly requesting all statuses (for admin/broker dashboards)
    const queryParams = {
        ...params
    };

    // If showAll is true (dashboard), request all statuses
    if (params.showAll) {
        queryParams.status = 'active,closed,sold,rented';
        delete queryParams.showAll; // Remove showAll as it's not an API parameter
    } else if (!params.status) {
        // If no status filter is provided, filter to active only
        queryParams.status = 'active';
    }

    const { data } = await api.get('/properties', { params: queryParams });
    return data.properties || [];
}

export async function getPropertyById(id: number | string): Promise<Property> {
    const { data } = await api.get(`/properties/${id}`);
    return data.property;
}
