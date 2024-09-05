import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CoinGeckoTickerData } from 'types/coinGeckoApi';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';

/**
 * Extended type for CoinGeckoTickerData, adding sparkline and supply details.
 */
export type TickerWithSparkline = CoinGeckoTickerData & {
  sparkline_in_7d?: { price: number[] };
  circulating_supply: number;
  image: string;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap_rank: number;
  max_supply: number;
};

/**
 * Type for Binance ticker data structure.
 */
interface BinanceTickerData {
  price: number;
  volume: number;
  priceChangePercent: number;
}

type PaginatedCryptoDataResult = {
  tickersData: TickerWithSparkline[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  vsCurrency: string;
};

/**
 * Custom hook to fetch paginated cryptocurrency data from CoinGecko API and merge it with Binance data.
 *
 * @param {number} initialPage - The initial page to load
 * @param {number} limit - Number of items per page
 * @param {string} initialVsCurrency - The currency to compare cryptocurrencies (default: 'usd')
 * @param {string} filter - The sorting order for the results (e.g. market_cap_desc)
 * @returns {PaginatedCryptoDataResult} - Paginated result with loading state, error, and data
 */
const usePaginatedCryptoData = (
  initialPage: number = 1,
  limit: number = 20,
  initialVsCurrency: string = 'usd',
  filter: string = 'market_cap_desc'
): PaginatedCryptoDataResult => {
  const privateKey = getPrivateKey();
  const { categoryFilter } = useScreenerDisplayPreferences();

  // State declarations
  const [tickersData, setTickersData] = useState<TickerWithSparkline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [binanceData, setBinanceData] = useState<
    Record<string, BinanceTickerData>
  >({});

  /**
   * Fetches the total number of pages based on the total count of tickers available.
   */
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

  /**
   * Fetches cryptocurrency data for a specific page using CoinGecko API.
   * Automatically applies the selected filters and currency.
   *
   * @param {number} requestedPage - The page number to request
   */
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
              status: 'active',
              price_change_percentage: '1h,24h,7d',
              category: categoryFilter || undefined
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
    [totalPages, initialVsCurrency, filter, limit, categoryFilter, privateKey]
  );

  /**
   * Fetches ticker data from Binance API and merges it with the CoinGecko data.
   * Used for real-time price updates.
   */
  const fetchBinanceData = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://api.binance.com/api/v3/ticker/24hr'
      );

      const data: Record<string, BinanceTickerData> = response.data.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: Record<string, BinanceTickerData>, curr: any) => {
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

  // Fetch total pages on initial mount
  useEffect(() => {
    fetchTotalPages();
  }, [fetchTotalPages]);

  // Fetch cryptocurrency data when the page or filter changes
  useEffect(() => {
    if (page <= totalPages && page >= 1) {
      fetchCryptoData(page);
    }
  }, [fetchCryptoData, page, totalPages]);

  // Fetch Binance data every 5 seconds
  useEffect(() => {
    fetchBinanceData();
    const intervalId = setInterval(fetchBinanceData, 5000);

    return () => clearInterval(intervalId);
  }, [fetchBinanceData]);

  // Refresh CoinGecko data every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCryptoData(page);
      setLoading(false);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [fetchCryptoData, page]);

  /**
   * Go to a specific page, ensuring the page is within the valid range.
   *
   * @param {number} newPage - The page number to navigate to
   */
  const goToPage = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    } else if (newPage < 1) {
      setError('You are trying to access a page below the first page.');
    } else if (newPage > totalPages) {
      setError('You are trying to access a page beyond the last page.');
    }
  };

  /**
   * Merge Binance real-time data with the CoinGecko data.
   * Binance data overrides the prices from CoinGecko.
   */
  const mergedData = tickersData.map((ticker) => {
    const symbol = ticker.symbol.toLowerCase() + 'usdt';
    const binanceTicker = binanceData[symbol] || {};

    return {
      ...ticker,
      current_price: binanceTicker.price || ticker.current_price,
      total_volume: ticker.total_volume,
      price_change_percentage_24h:
        binanceTicker.priceChangePercent || ticker.price_change_percentage_24h
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
