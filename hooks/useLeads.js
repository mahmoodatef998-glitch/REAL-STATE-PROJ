import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../lib/api/leads';

/**
 * Hook to fetch all leads with optional filters
 */
export function useLeads(filters = {}) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadsApi.getAll(filters),
    select: (data) => data.leads || []
  });
}

/**
 * Hook to fetch a single lead by ID
 */
export function useLead(id) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsApi.getById(id),
    select: (data) => data.lead,
    enabled: !!id
  });
}

/**
 * Hook to create a new lead
 */
export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (leadData) => leadsApi.create(leadData),
    onSuccess: () => {
      // Invalidate leads queries to refetch
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-notifications'] });
    }
  });
}

/**
 * Hook to update lead status
 */
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => leadsApi.updateStatus(id, status),
    onSuccess: () => {
      // Invalidate leads queries to refetch
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-notifications'] });
    }
  });
}

/**
 * Hook to delete a lead
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => leadsApi.delete(id),
    onSuccess: () => {
      // Invalidate leads queries to refetch
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}

/**
 * Hook to fetch leads for a specific property
 */
export function usePropertyLeads(propertyId) {
  return useQuery({
    queryKey: ['leads', 'property', propertyId],
    queryFn: () => leadsApi.getByProperty(propertyId),
    select: (data) => data.leads || [],
    enabled: !!propertyId
  });
}

/**
 * Hook to fetch lead statistics
 */
export function useLeadStats() {
  return useQuery({
    queryKey: ['leads', 'stats'],
    queryFn: () => leadsApi.getStats(),
    select: (data) => data.stats
  });
}

/**
 * Hook to fetch notification count (new leads)
 * Only enabled when user is authenticated
 */
export function useLeadNotifications(isAuthenticated = false) {
  return useQuery({
    queryKey: ['lead-notifications'],
    queryFn: () => leadsApi.getNotificationCount(),
    select: (data) => data.count || 0,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
    enabled: isAuthenticated // Only run query when authenticated
  });
}

