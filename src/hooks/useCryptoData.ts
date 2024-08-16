import { useEffect, useState } from 'react';
import axios from 'axios';

const useCryptoData = (symbol: string) => {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=60`
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
    const intervalId = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, [symbol]);

  return { data, loading, error };
};

export default useCryptoData;
