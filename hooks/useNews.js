"use client";
import { useQuery } from '@tanstack/react-query';
import { getLatestNews } from '../lib/api/news';

export function useLatestNews(limit = 6) {
  return useQuery({
    queryKey: ['latest-news', limit],
    queryFn: () => getLatestNews(limit),
    staleTime: 60_000
  });
}
