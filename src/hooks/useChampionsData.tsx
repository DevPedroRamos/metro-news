import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type RankingType = 'corretor' | 'gerente' | 'superintendente';

export interface RankingData {
  id: string;
  name: string;
  nickname: string;
  sales: number;
  revenue: number;
  visits: number;
  contracts: number;
  avatar_url?: string;
}

interface ChampionsCache {
  [key: string]: {
    data: RankingData[];
    totalCount: number;
    timestamp: number;
    pages: { [page: number]: RankingData[] };
  };
}

interface UseChampionsDataOptions {
  pageSize?: number;
  searchTerm?: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache: ChampionsCache = {};

export const useChampionsData = (
  rankingType: RankingType, 
  options: UseChampionsDataOptions = {}
) => {
  const { user } = useAuth();
  const { pageSize = 20, searchTerm = '' } = options;
  
  const [data, setData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const debounceRef = useRef<NodeJS.Timeout>();
  const cacheKey = `${rankingType}-${searchTerm}`;

  // Check cache validity
  const isCacheValid = useCallback((cacheEntry: any) => {
    return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
  }, []);

  // Fetch data from Supabase using the optimized function
  const fetchChampionsData = useCallback(async (page: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      // Check cache first
      const cachedData = cache[cacheKey];
      if (isCacheValid(cachedData) && cachedData.pages[page]) {
        if (reset) {
          setData(cachedData.pages[page]);
          setTotalCount(cachedData.totalCount);
          setHasMore(page * pageSize < cachedData.totalCount);
          setLoading(false);
        } else {
          setData(prev => [...prev, ...cachedData.pages[page]]);
          setHasMore(page * pageSize < cachedData.totalCount);
          setLoadingMore(false);
        }
        return;
      }

      const offset = (page - 1) * pageSize;
      
      const { data: result, error: dbError } = await supabase
        .rpc('get_champions_ranking', {
          ranking_type: rankingType,
          limit_count: pageSize,
          offset_count: offset
        });

      if (dbError) throw dbError;

      if (!result || result.length === 0) {
        if (reset) {
          setData([]);
          setTotalCount(0);
        }
        setHasMore(false);
        return;
      }

      const formattedData: RankingData[] = result.map((item: any) => ({
        id: item.user_id || item.name,
        name: item.name,
        nickname: item.nickname,
        sales: Number(item.sales_count) || 0,
        revenue: Number(item.revenue) || 0,
        visits: Number(item.visits_count) || 0,
        contracts: Number(item.contracts_count) || 0,
        avatar_url: item.avatar_url
      }));

      const totalRecords = result[0]?.total_count || 0;

      // Update cache
      if (!cache[cacheKey]) {
        cache[cacheKey] = {
          data: [],
          totalCount: totalRecords,
          timestamp: Date.now(),
          pages: {}
        };
      }
      
      cache[cacheKey].pages[page] = formattedData;
      cache[cacheKey].totalCount = totalRecords;
      cache[cacheKey].timestamp = Date.now();

      if (reset) {
        setData(formattedData);
        setTotalCount(totalRecords);
      } else {
        setData(prev => [...prev, ...formattedData]);
      }
      
      setHasMore(page * pageSize < totalRecords);

    } catch (err) {
      console.error('Error fetching champions data:', err);
      setError('Erro ao carregar dados dos campeões');
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [rankingType, pageSize, searchTerm, cacheKey, isCacheValid]);

  // Load more data for pagination
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchChampionsData(nextPage, false);
    }
  }, [currentPage, loadingMore, hasMore, fetchChampionsData]);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchChampionsData(1, true);
    }, searchTerm ? 300 : 0);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [rankingType, searchTerm, fetchChampionsData]);

  // Initial load
  useEffect(() => {
    setCurrentPage(1);
    fetchChampionsData(1, true);
  }, [rankingType]);

  // Calculate user position in ranking  
  const userPosition = useMemo(() => {
    if (!user?.id || !data.length) return null;
    
    let position = -1;
    
    if (rankingType === 'corretor') {
      position = data.findIndex(item => item.id === user.id) + 1;
    } else if (rankingType === 'gerente') {
      // Would need user's gerente info - simplified for now
      position = -1;
    } else if (rankingType === 'superintendente') {
      // Would need user's superintendente info - simplified for now  
      position = -1;
    }
    
    return position > 0 ? position : null;
  }, [data, user?.id, rankingType]);

  return {
    data,
    loading,
    error,
    userPosition,
    totalCount,
    hasMore,
    loadingMore,
    loadMore,
    currentPage
  };
};