import { api } from './axios-client.js';

export async function getNewArrivals(limit = 6) {
  const { data } = await api.get(`/properties/new-arrivals/${limit}`);
  return data.properties || [];
}

export async function getAllProperties(params = {}) {
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

export async function getPropertyById(id) {
  const { data } = await api.get(`/properties/${id}`);
  return data.property;
}


