import { api } from './axios-client';

export const getPendingBrokers = async () => {
  const response = await api.get('/users/pending/brokers');
  return response.data.users;
};

export const approveBroker = async (userId) => {
  const response = await api.post(`/users/${userId}/approve`);
  return response.data;
};

export const rejectBroker = async (userId) => {
  const response = await api.post(`/users/${userId}/reject`);
  return response.data;
};

