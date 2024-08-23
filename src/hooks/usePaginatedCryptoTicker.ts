import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CoinGeckoTickerData } from 'types/coinGeckoApi';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';

type TickerWithSparkline = CoinGeckoTickerData & {
  sparkline_in_7d?: { price: number[] };
};

type PaginatedCryptoTickersResult = {
  tickersData: TickerWithSparkline[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  vsCurrency: string;
};

const usePaginatedCryptoTickers = (
  initialPage: number = 1,
  limit: number = 25,
  initialVsCurrency: string = 'usd',
  filter: string = 'market_cap_desc' // Default to market_cap_desc
): PaginatedCryptoTickersResult => {
  const privateKey = getPrivateKey();
  const [tickersData, setTickersData] = useState<TickerWithSparkline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);

  const fetchTotalPages = useCallback(async () => {
    try {
      const totalCountResponse = await axios.get(
        'https://api.coingecko.com/api/v3/coins/list?include_platform=false',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': privateKey
          }
        }
      );

      const totalTickers = totalCountResponse.data.length;
      const calculatedTotalPages = Math.ceil(totalTickers / limit);
      setTotalPages(calculatedTotalPages);

      if (page > calculatedTotalPages) {
        setError('Requested page exceeds total available pages.');
        setPage(1);
      }
    } catch (err) {
      console.error('Error fetching total tickers count:', err);
      setError('Error fetching total tickers count');
    }
  }, [privateKey, limit, page]);

  const fetchCryptoData = useCallback(
    async (requestedPage: number) => {
      if (requestedPage > totalPages) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<TickerWithSparkline[]>(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: initialVsCurrency,
              order: filter,
              per_page: limit,
              page: requestedPage,
              sparkline: true
            },
            headers: {
              accept: 'application/json',
              'x-cg-demo-api-key': privateKey
            }
          }
        );

        setTickersData(response.data);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Error fetching crypto data');
      } finally {
        setLoading(false);
      }
    },
    [privateKey, initialVsCurrency, limit, totalPages, filter]
  );

  useEffect(() => {
    fetchTotalPages();
  }, [fetchTotalPages]);

  useEffect(() => {
    if (page <= totalPages && page >= 1) {
      fetchCryptoData(page);
    }
  }, [fetchCryptoData, page, totalPages]);

  const goToPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    } else if (newPage < 1) {
      setError('You are trying to access a page below the first page.');
    } else if (newPage > totalPages) {
      setError('You are trying to access a page beyond the last page.');
    }
  };

  return {
    tickersData,
    loading,
    error,
    currentPage: page,
    totalPages,
    goToPage,
    vsCurrency: initialVsCurrency
  };
};

export default usePaginatedCryptoTickers;
