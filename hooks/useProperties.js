"use client";
import { useQuery } from '@tanstack/react-query';
import { getNewArrivals, getAllProperties } from '../lib/api/properties';

export function useNewProjects(limit = 6) {
  return useQuery({
    queryKey: ['new-projects', limit],
    queryFn: () => getNewArrivals(limit),
    staleTime: 60_000
  });
}

export function useAllProperties(filters = {}) {
  return useQuery({
    queryKey: ['all-properties', filters],
    queryFn: () => getAllProperties(filters),
    staleTime: 60_000
  });
}


