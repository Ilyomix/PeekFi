import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface CryptoDataPoint {
  x: string;
  y: number;
}

const useCryptoData = (symbol: string) => {
  const [data, setData] = useState<CryptoDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const UPDATE_RATE = 1800000;

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    try {
      const response = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=30m&limit=48`
      );
      setData(
        response.data.map(
          ([time, , , , close]: [number, string, string, string, string]) => ({
            x: new Date(time).toLocaleTimeString(),
            y: parseFloat(close)
          })
        )
      );
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, UPDATE_RATE);
    return () => clearInterval(intervalId);
  }, [fetchData, UPDATE_RATE]);

  return { data, loading, error };
};

export default useCryptoData;
