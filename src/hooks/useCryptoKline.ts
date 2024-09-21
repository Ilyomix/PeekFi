// useCryptoKLine.tsx

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';

interface CandleData {
  x: number; // Timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  y: number; // Close price
  volume: number;
  marketCap?: number;
}

interface UseCryptoKLineResponse {
  data: CandleData[];
  loading: boolean;
  error: string | null;
  openPrice: number | null;
  delta: number | null;
  deltaPercent: number | null;
  deltaPositive: boolean;
  currentPrice: number | null;
}

const MAX_DATA_POINTS = 400;

const rangeMapping: {
  [key: string]: { days: string; granularity: number };
} = {
  '1D': { days: '1', granularity: 60 * 60 * 1000 }, // 1-hour granularity
  '1W': { days: '7', granularity: 4 * 60 * 60 * 1000 }, // 4-hour granularity
  '1M': { days: '30', granularity: 12 * 60 * 60 * 1000 }, // 12-hour granularity
  '3M': { days: '90', granularity: 1 * 24 * 60 * 60 * 1000 }, // 1-day granularity
  '6M': { days: '180', granularity: 2 * 24 * 60 * 60 * 1000 }, // 2-day granularity
  '1Y': { days: '365', granularity: 4 * 24 * 60 * 60 * 1000 }, // 4-day granularity
  '5Y': { days: '1825', granularity: 1 * 7 * 24 * 60 * 60 * 1000 }, // 1-week granularity
  MAX: { days: 'max', granularity: 30 * 24 * 60 * 60 * 1000 } // 1-month granularity
};

/**
 * Samples the data to a maximum number of points to optimize performance.
 * @param {CandleData[]} data - The full dataset.
 * @param {number} maxPoints - The maximum number of data points.
 * @returns {CandleData[]} - The sampled dataset.
 */
const sampleData = (data: CandleData[], maxPoints: number): CandleData[] => {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil((data.length - 2) / (maxPoints - 2));
  return data.filter(
    (_, index) => index === 0 || index === data.length - 1 || index % step === 0
  );
};

const privateKey = getPrivateKey();

/**
 * Fetches market chart data from the CoinGecko API.
 * @param {string} id - The CoinGecko ID of the cryptocurrency.
 * @param {string} vsCurrency - The currency to compare against, e.g., 'usd'.
 * @param {string} days - The number of days for the chart data.
 * @returns {Promise<CandleData[]>} - An array of CandleData.
 */
const fetchCoinGeckoMarketChartData = async (
  id: string,
  vsCurrency: string,
  days: string
): Promise<CandleData[]> => {
  const url = `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart`;
  const response = await axios.get(url, {
    params: { vs_currency: vsCurrency, days: days },
    headers: {
      accept: 'application/json',
      'x-cg-pro-api-key': privateKey
    }
  });

  // Combine the data points
  const prices = response.data.prices;
  const marketCaps = response.data.market_caps;
  const totalVolumes = response.data.total_volumes;

  return prices.map((price: [number, number], index: number) => ({
    x: price[0],
    open: price[1],
    high: price[1],
    low: price[1],
    y: price[1],
    volume: totalVolumes[index]?.[1] || 0,
    marketCap: marketCaps[index]?.[1] || 0
  }));
};

/**
 * Custom hook to fetch and manage cryptocurrency KLine data using CoinGecko API.
 * @param {string} id - The CoinGecko ID of the cryptocurrency.
 * @param {string} vsCurrency - The currency to compare against, e.g., 'usd'.
 * @param {string} range - The time range for the data (e.g., '1D', '1W', etc.).
 * @returns {UseCryptoKLineResponse} - An object containing KLine data and related state.
 */
const useCryptoKLine = (
  id: string,
  vsCurrency: string = 'usd',
  range: string = '1D'
): UseCryptoKLineResponse => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Initial loading state
  const [error, setError] = useState<string | null>(null);
  const [openPrice, setOpenPrice] = useState<number | null>(null);
  const [deltaPercent, setDeltaPercent] = useState<number | null>(null);
  const [deltaPositive, setDeltaPositive] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [delta, setDelta] = useState<number | null>(null);

  /**
   * Fetches historical data and updates the state.
   */
  const fetchHistoricalData = useCallback(
    async (hideLoading?: boolean) => {
      setLoading(hideLoading ? false : true);
      setError(null);

      // Normalize the range value to uppercase
      const normalizedRange = range.toUpperCase();
      // Get the mapping for the given range
      const mapping = rangeMapping[normalizedRange];
      if (!mapping) {
        setError(`Invalid range: ${range}`);
        setLoading(false);
        return;
      }

      const { days } = mapping;

      try {
        const fetchedData = await fetchCoinGeckoMarketChartData(
          id,
          vsCurrency,
          days
        );
        const sampledData = sampleData(fetchedData, MAX_DATA_POINTS);
        setData(sampledData); // Replace old data with new fetched data

        if (sampledData.length > 0) {
          const firstCandle = sampledData[0];
          const lastCandle = sampledData[sampledData.length - 1];
          setOpenPrice(firstCandle.open);
          setCurrentPrice(lastCandle.y);
          setDelta(lastCandle.y - firstCandle.open);
          setDeltaPercent(
            ((lastCandle.y - firstCandle.open) / firstCandle.open) * 100
          );
          setDeltaPositive(lastCandle.y > firstCandle.open);
        }

        setError(null); // Reset error on success
      } catch (err) {
        console.error('Failed to fetch historical data:', err);
        setError('Failed to fetch historical data.');
      } finally {
        setLoading(false);
      }
    },
    [id, vsCurrency, range]
  );

  useEffect(() => {
    fetchHistoricalData();

    // Set up interval for data refresh (e.g., every 60 seconds)
    const interval = setInterval(() => {
      fetchHistoricalData(true);
    }, 5000); // Refresh every 60 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [fetchHistoricalData]);

  return {
    data,
    loading,
    error,
    openPrice,
    delta,
    deltaPercent,
    deltaPositive,
    currentPrice
  };
};

export default useCryptoKLine;
