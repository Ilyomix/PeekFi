import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CoinGeckoTickerData } from 'types/coinGeckoApi';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';

export type TickerWithSparkline = CoinGeckoTickerData & {
  sparkline_in_7d?: { price: number[] };
  circulating_supply: number;
  image: string; // Include image URL for the crypto icon
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap_rank: number; // Include rank in the data structure
  max_supply: number; // Include max supply in the data structure
};

type PaginatedCryptoDataResult = {
  tickersData: TickerWithSparkline[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  vsCurrency: string;
};

const usePaginatedCryptoData = (
  initialPage: number = 1,
  limit: number = 25,
  initialVsCurrency: string = 'usd',
  filter: string = 'market_cap_desc'
): PaginatedCryptoDataResult => {
  const privateKey = getPrivateKey();
  const [tickersData, setTickersData] = useState<TickerWithSparkline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [binanceData, setBinanceData] = useState<Record<string, any>>({});

  const fetchTotalPages = useCallback(async () => {
    try {
      const totalCountResponse = await axios.get(
        'https://pro-api.coingecko.com/api/v3/coins/list?include_platform=false',
        {
          headers: {
            accept: 'application/json',
            'x-cg-pro-api-key': privateKey
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
          `https://pro-api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: initialVsCurrency,
              order: filter,
              per_page: limit,
              page: requestedPage,
              sparkline: true,
              price_change_percentage: '1h,24h,7d'
            },
            headers: {
              accept: 'application/json',
              'x-cg-pro-api-key': privateKey
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

  const fetchBinanceData = useCallback(async () => {
    try {
      // Fetch all tickers from Binance
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/24hr`
      );

      const data = response.data.reduce(
        (acc: Record<string, any>, curr: any) => {
          acc[curr.symbol.toLowerCase()] = {
            price: parseFloat(curr.lastPrice),
            volume: parseFloat(curr.volume),
            priceChangePercent: parseFloat(curr.priceChangePercent)
          };
          return acc;
        },
        {}
      );

      setBinanceData(data);
    } catch (err) {
      console.error('Error fetching Binance data:', err);
      setError('Error fetching Binance data');
    }
  }, []);

  useEffect(() => {
    fetchTotalPages();
  }, [fetchTotalPages]);

  useEffect(() => {
    if (page <= totalPages && page >= 1) {
      fetchCryptoData(page);
    }
  }, [fetchCryptoData, page, totalPages]);

  useEffect(() => {
    fetchBinanceData(); // Fetch Binance data once when component mounts
    const intervalId = setInterval(() => {
      fetchBinanceData();
    }, 5000); // Refresh Binance data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [fetchBinanceData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCryptoData(page);
      setLoading(false);
    }, 60000); // Update every 60 seconds

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [fetchCryptoData, page]);

  const goToPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    } else if (newPage < 1) {
      setError('You are trying to access a page below the first page.');
    } else if (newPage > totalPages) {
      setError('You are trying to access a page beyond the last page.');
    }
  };

  // Merge Binance data with CoinGecko data
  const mergedData = tickersData.map((ticker) => {
    const symbol = ticker.symbol.toLowerCase() + 'usdt';
    const binanceTicker = binanceData[symbol] || {};

    return {
      ...ticker,
      current_price: binanceTicker.price || ticker.current_price,
      total_volume: ticker.total_volume,
      price_change_percentage_24h:
        binanceTicker.priceChangePercent || ticker.price_change_percentage_24h
      // Other fields like market_cap, circulating_supply etc. remain from CoinGecko
    };
  });

  return {
    tickersData: mergedData,
    loading,
    error,
    currentPage: page,
    totalPages,
    goToPage,
    vsCurrency: initialVsCurrency
  };
};

export default usePaginatedCryptoData;
