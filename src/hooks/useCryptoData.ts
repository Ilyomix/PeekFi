import { useEffect, useState } from 'react';
import axios from 'axios';

const useCryptoData = (symbol: string) => {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const UPDATE_RATE = 1800000;

  useEffect(() => {
    if (!symbol) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=30m&limit=48`
        );
        setData(
          response.data.map(
            ([time, , , , close]: [
              number,
              string,
              string,
              string,
              string
            ]) => ({
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
    };

    fetchData();
    const intervalId = setInterval(fetchData, UPDATE_RATE); // Update every 15 mn
    return () => clearInterval(intervalId);
  }, [symbol]);

  return { data, loading, error };
};

export default useCryptoData;
