"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingBrokers, approveBroker, rejectBroker, getAllUsers, createUser, deleteUser, updateUser } from '../lib/api/users';

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

export function useUsers(role) {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => getAllUsers(role),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
