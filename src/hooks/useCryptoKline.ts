// useCryptoKLine.tsx

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface CandleData {
  x: number; // Timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  y: number; // Close price
  volume: number;
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

const rangeMapping: {
  [key: string]: { interval: string; limit: number };
} = {
  '1D': { interval: '1m', limit: 1440 }, // 1 day of 1-minute data
  '1W': { interval: '15m', limit: 672 }, // 1 week of 15-minute data
  '1M': { interval: '1h', limit: 720 }, // 1 month of 1-hour data
  '3M': { interval: '4h', limit: 540 }, // 3 months of 4-hour data
  '6M': { interval: '12h', limit: 360 }, // 6 months of 12-hour data
  '1Y': { interval: '1d', limit: 365 }, // 1 year of daily data
  '5Y': { interval: '1w', limit: 260 }, // 5 years of weekly data
  Max: { interval: '1M', limit: 60 } // Max range (approx 5 years)
};

/**
 * Custom hook to fetch and manage cryptocurrency KLine data using Binance's API.
 * @param {string} symbol - The trading pair symbol (e.g., 'BTCUSDT').
 * @param {string} range - The time range for the data (e.g., '1D', '1W', etc.).
 * @returns {UseCryptoKLineResponse} - An object containing KLine data and related state.
 */
const useCryptoKLine = (
  symbol: string,
  range: string = '1D'
): UseCryptoKLineResponse => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openPrice, setOpenPrice] = useState<number | null>(null);
  const [deltaPercent, setDeltaPercent] = useState<number | null>(null);
  const [deltaPositive, setDeltaPositive] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [delta, setDelta] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { interval, limit } = rangeMapping[range];
        const url = `https://api.binance.com/api/v3/klines`;
        const params = {
          symbol: symbol.toUpperCase(),
          interval,
          limit
        };

        const response = await axios.get(url, { params });

        const fetchedData: CandleData[] = response.data.map(
          (kline: string[]) => ({
            x: kline[0],
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            y: parseFloat(kline[4]),
            volume: parseFloat(kline[5])
          })
        );

        setData(fetchedData);

        if (fetchedData.length > 0) {
          const firstCandle = fetchedData[0];
          const lastCandle = fetchedData[fetchedData.length - 1];
          setOpenPrice(firstCandle.open);
          setCurrentPrice(lastCandle.y);
          setDelta(lastCandle.y - firstCandle.open);
          setDeltaPercent(
            ((lastCandle.y - firstCandle.open) / firstCandle.open) * 100
          );
          setDeltaPositive(lastCandle.y > firstCandle.open);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch historical data:', err);
        setError('Failed to fetch historical data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();

    // Set up WebSocket for live updates
    const { interval } = rangeMapping[range];
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const kline = message.k;

        const updatedCandle: CandleData = {
          x: kline.t,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          y: parseFloat(kline.c),
          volume: parseFloat(kline.v)
        };

        setData((prevData) => {
          // Check if the candle already exists in the data
          const index = prevData.findIndex((c) => c.x === updatedCandle.x);

          if (index !== -1) {
            // Update the existing candle
            const newData = [...prevData];
            newData[index] = updatedCandle;
            return newData;
          } else {
            // Add the new candle
            return [...prevData.slice(1), updatedCandle]; // Keep the data array size consistent
          }
        });

        setCurrentPrice(updatedCandle.y);
        setDelta(updatedCandle.y - (openPrice || 0));
        setDeltaPercent(
          openPrice ? ((updatedCandle.y - openPrice) / openPrice) * 100 : 0
        );
        setDeltaPositive(updatedCandle.y > (openPrice || 0));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        setError('Error parsing data from WebSocket.');
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('WebSocket encountered an error.');
    };

    // Clean up the WebSocket connection when the component unmounts or dependencies change
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, range, openPrice]);

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
