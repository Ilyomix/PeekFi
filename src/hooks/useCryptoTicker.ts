import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface TickerData {
  name: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  prevClosePrice: number;
  lastPrice: number;
  symbol: string;
  quoteVolume: number;
  volume: number;
  cryptoId: string;
  currencyPair: string;
  timestamp: Date;
  loading: boolean;
  error: string | null;
}

interface RawTickerData {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  prevClosePrice: number;
  quoteVolume: number;
  volume: number;
}

/**
 * Custom hook to fetch and manage cryptocurrency ticker data.
 * @param {string[]} symbols - Array of cryptocurrency symbols to fetch data for.
 * @returns {object} - An object containing ticker data, loading state, error state, and a refetch function.
 */
const useCryptoTicker = (symbols: string[]) => {
  const [tickersData, setTickersData] = useState<Record<string, TickerData>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  /**
   * Formats the raw ticker data from the API response.
   * @param {RawTickerData[]} data - Raw data from the API response.
   * @returns {Record<string, TickerData>} - Formatted ticker data.
   */
  const formatTickerData = (
    data: RawTickerData[]
  ): Record<string, TickerData> => {
    return data.reduce(
      (acc, ticker) => {
        const {
          symbol,
          lastPrice,
          priceChange,
          priceChangePercent,
          highPrice,
          lowPrice,
          openPrice,
          prevClosePrice,
          quoteVolume,
          volume
        } = ticker;

        acc[symbol.toLowerCase()] = {
          name: symbol.replace(/USDT|USD|EUR|GBP|AUD|JPY|TRY/g, ''),
          price: lastPrice,
          priceChange,
          priceChangePercent,
          highPrice,
          lowPrice,
          openPrice,
          prevClosePrice,
          lastPrice,
          symbol,
          quoteVolume,
          volume,
          cryptoId: symbol,
          currencyPair:
            symbol.match(/USDT|USD|EUR|GBP|AUD|JPY|TRY/)?.[0] || 'UNKNOWN',
          timestamp: new Date(),
          loading: false,
          error: null
        };
        return acc;
      },
      {} as Record<string, TickerData>
    );
  };

  /**
   * Fetches cryptocurrency data from the API.
   */
  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols
        .map((s) => `"${s.toUpperCase()}"`)
        .join(',')}]`;
      const { data } = await axios.get<RawTickerData[]>(url);

      setTickersData(formatTickerData(data));
      setHasFetched(true);
    } catch {
      setError('Error fetching crypto data');
      setTickersData({});
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    if (!hasFetched) {
      fetchCryptoData();
    }
  }, [fetchCryptoData, hasFetched]);

  return { tickersData, loading, error, refetch: fetchCryptoData };
};

export default useCryptoTicker;
