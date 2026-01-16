"use client";
import { useQuery } from '@tanstack/react-query';
import { getDisciplines } from '../lib/api/disciplines';

export function useDisciplines() {
  return useQuery({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
    staleTime: 300_000 // 5 minutes
  });
}
