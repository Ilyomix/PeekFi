import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';
import { CoinGeckoTickerData } from 'types/coinGeckoApi';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';

type UsePaginatedCryptoTickersResult = {
  tickersData: CoinGeckoTickerData[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  vs_currency: string;
};

const usePaginatedCryptoTickers = (
  initialPage: number = 1,
  limit: number = 25,
  interval: number = 60000,
  vs_currency: string = 'usd'
): UsePaginatedCryptoTickersResult => {
  const privateKey = getPrivateKey();
  const [tickersData, setTickersData] = useState<CoinGeckoTickerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);

  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: tickersData }: AxiosResponse<CoinGeckoTickerData[]> =
        await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency,
            order: 'market_cap_desc',
            per_page: limit,
            page
          },
          headers: {
            Authorization: `Bearer ${privateKey}`
          }
        });

      const { data: allCoinsData }: AxiosResponse<{ id: string }[]> =
        await axios.get('https://api.coingecko.com/api/v3/coins/list');
      const totalItems: number = allCoinsData.length;

      setTickersData(
        tickersData.map((item, index) => ({
          ...item,
          rank: index + 1 + (page - 1) * limit
        }))
      );
      setTotalPages(Math.ceil(totalItems / limit));
      setHasFetched(true);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Error fetching crypto data');
      setTickersData([]);
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }, [page, limit, vs_currency, privateKey]);

  useEffect(() => {
    fetchCryptoData();
    const intervalId = setInterval(fetchCryptoData, interval);
    return () => clearInterval(intervalId);
  }, [fetchCryptoData, interval]);

  const goToPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setHasFetched(false);
      setTickersData([]);
      setPage(newPage);
    }
  };

  return {
    tickersData,
    loading,
    error,
    hasFetched,
    currentPage: page,
    totalPages,
    goToPage,
    vs_currency
  };
};

export default usePaginatedCryptoTickers;
