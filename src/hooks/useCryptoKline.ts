import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey'; // Assuming this utility properly handles API key fetching

export interface CandleData {
  x: number; // Timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  y: number; // Close price
  marketCap?: number;
  volume?: number;
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
  [key: string]: { days: string; binanceInterval: string; granularity: number };
} = {
  '1D': { days: '1', binanceInterval: '1m', granularity: 60 * 1000 },
  '1W': { days: '7', binanceInterval: '15m', granularity: 15 * 60 * 1000 },
  '1M': { days: '30', binanceInterval: '1h', granularity: 60 * 60 * 1000 },
  '3M': { days: '90', binanceInterval: '4h', granularity: 4 * 60 * 60 * 1000 },
  '1Y': {
    days: '365',
    binanceInterval: '1d',
    granularity: 24 * 60 * 60 * 1000
  },
  '5Y': {
    days: '1825',
    binanceInterval: '1w',
    granularity: 7 * 24 * 60 * 60 * 1000
  },
  Max: {
    days: 'max',
    binanceInterval: '1M',
    granularity: 30 * 24 * 60 * 60 * 1000
  }
};

const sampleData = (data: CandleData[], maxPoints: number): CandleData[] => {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil((data.length - 2) / (maxPoints - 2));
  return data.filter(
    (_, index) => index === 0 || index === data.length - 1 || index % step === 0
  );
};

const fetchCoinGeckoMarketChartData = async (
  id: string,
  vsCurrency: string,
  days: string
): Promise<CandleData[]> => {
  const privateKey = getPrivateKey();
  const url = `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart`;
  const response = await axios.get(url, {
    headers: { 'x-cg-pro-api-key': privateKey },
    params: { vs_currency: vsCurrency, days: days }
  });
  return response.data.prices.map((price: [number, number], index: number) => ({
    x: price[0],
    open: price[1],
    high: price[1],
    low: price[1],
    y: price[1],
    marketCap: response.data.market_caps[index]?.[1],
    volume: response.data.total_volumes[index]?.[1]
  }));
};

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

  const fetchHistoricalData = useCallback(
    async (isInitialFetch: boolean) => {
      if (isInitialFetch) {
        setLoading(true); // Trigger loading only for initial fetch or range change
      }

      try {
        const fetchedData = await fetchCoinGeckoMarketChartData(
          id,
          vsCurrency,
          rangeMapping[range].days
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
        if (isInitialFetch) {
          setLoading(false); // Stop loading after initial fetch or range change
        }
      }
    },
    [id, vsCurrency, range]
  );

  useEffect(() => {
    fetchHistoricalData(true); // Initial fetch with loading set

    const intervalDuration =
      rangeMapping[range].granularity > 3600000
        ? 3600000
        : rangeMapping[range].granularity; // Set up long-polling

    // Set up long-polling
    const interval = setInterval(() => {
      fetchHistoricalData(false); // Fetch data during polling without setting loading
    }, intervalDuration);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [fetchHistoricalData, range]);

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
