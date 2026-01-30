import { api } from './axios-client';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'broker' | 'client';
    phone?: string;
    avatar?: string;
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
    companyId?: number;
    // ...
}

export const getPendingBrokers = async (): Promise<User[]> => {
    const response = await api.get('/users/pending/brokers');
    return response.data.users;
};

export const approveBroker = async (userId: number | string) => {
    const response = await api.post(`/users/${userId}/approve`);
    return response.data;
};

export const rejectBroker = async (userId: number | string) => {
    const response = await api.post(`/users/${userId}/reject`);
    return response.data;
};

export const getAllUsers = async (role?: string): Promise<User[]> => {
    const response = await api.get('/users', { params: { role } });
    return response.data.users;
};

export const createUser = async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const deleteUser = async (userId: number | string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};
