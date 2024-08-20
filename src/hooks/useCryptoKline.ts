import { useEffect, useState } from 'react';
import axios from 'axios';

export type CandleData = {
  x: number;
  open: number;
  high: number;
  low: number;
  y: number;
};

type useCryptoKLineResponse = {
  data: CandleData[];
  loading: boolean;
  error: string | null;
};

const useCryptoKLine = (
  symbol: string,
  interval: string = '30m',
  maxDataPoints: number = 100 // Limit the number of data points
): useCryptoKLineResponse => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processFetchedData = (rawData: any[]): CandleData[] =>
    rawData.map(
      ([time, open, high, low, close]: [
        number,
        string,
        string,
        string,
        string
      ]) => ({
        x: new Date(time).getTime(),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        y: parseFloat(close)
      })
    );

  const updateData = (newCandle: CandleData) => {
    setData((prevData) => {
      // Replace the existing candle or add the new one
      const updatedData = prevData.map((candle) =>
        candle.x === newCandle.x ? newCandle : candle
      );

      if (!updatedData.find((candle) => candle.x === newCandle.x)) {
        updatedData.push(newCandle);
      }

      // Maintain only the most recent maxDataPoints
      return updatedData.slice(-maxDataPoints);
    });
  };

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${maxDataPoints}`
        );
        setData(processFetchedData(response.data));
        setLoading(false);
      } catch {
        setError('Failed to fetch historical data');
        setLoading(false);
      }
    };

    fetchData();

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    );

    ws.onopen = () => setLoading(false);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message?.k) {
          const kline = message.k;
          const newCandle: CandleData = {
            x: new Date(kline.t).getTime(),
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            y: parseFloat(kline.c)
          };
          updateData(newCandle);
        }
      } catch {
        setError('Error processing WebSocket message');
      }
    };

    ws.onerror = () => setError('Failed to connect to WebSocket');

    ws.onclose = () => setLoading(false);

    return () => ws.close();
  }, [symbol, interval, maxDataPoints]);

  return { data, loading, error };
};

export default useCryptoKLine;
