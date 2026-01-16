"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingBrokers, approveBroker, rejectBroker } from '../lib/api/users';

export function usePendingBrokers() {
  return useQuery({
    queryKey: ['pendingBrokers'],
    queryFn: getPendingBrokers,
  });
}

export function useApproveBroker() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: approveBroker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingBrokers'] });
    },
  });
}

export function useRejectBroker() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rejectBroker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingBrokers'] });
    },
  });
}

