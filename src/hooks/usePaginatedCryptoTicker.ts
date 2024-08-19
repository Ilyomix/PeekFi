import { useState, useEffect } from 'react';
import axios from 'axios';
import { CoinGeckoTickerData } from 'types/coinGeckoApi';

const usePaginatedCryptoTickers = (
  page: number = 1,
  limit: number = 25,
  interval: number = 60000,
  vs_currency: string = 'usd'
) => {
  const [tickersData, setTickersData] = useState<CoinGeckoTickerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://api.coingecko.com/api/v3/coins/markets`;
        const response = await axios.get(url, {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_rank_desc',
            per_page: limit,
            page: page
          }
        });

        const data = response.data as CoinGeckoTickerData[];
        setTickersData(data);
        setTotalPages(Math.ceil(1000 / limit)); // Estimation, CoinGecko ne donne pas le nombre total d'élémentssetHasFetched(true);
        setHasFetched(true);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Error fetching crypto data');
        setTickersData([]);
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();

    const intervalId = setInterval(fetchCryptoData, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [page, limit, interval]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setHasFetched(false);
      setTickersData([]); // Clear current data before fetching new page
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
