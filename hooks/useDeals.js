import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal
} from '../lib/api/deals';

/**
 * Hook to fetch all deals with filters
 */
export function useDeals(filters = {}) {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: () => getAllDeals(filters),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch a single deal by ID
 */
export function useDeal(id) {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => getDealById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

/**
 * Hook to update a deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updateData }) => updateDeal(id, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.id] });
    },
  });
}

/**
 * Hook to delete a deal
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

