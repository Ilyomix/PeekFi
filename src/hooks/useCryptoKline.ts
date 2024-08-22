import { useEffect, useState, useCallback, useMemo } from 'react';
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

type RawCandleData = [number, string, string, string, string];

const useCryptoKLine = (
  symbol: string,
  interval: string = '30m',
  maxDataPoints: number = 100
): useCryptoKLineResponse => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processFetchedData = useCallback(
    (rawData: RawCandleData[]): CandleData[] =>
      rawData.map(([time, open, high, low, close]) => ({
        x: new Date(time).getTime(),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        y: parseFloat(close)
      })),
    []
  );

  const updateData = useCallback(
    (newCandle: CandleData) => {
      setData((prevData) => {
        const candleIndex = prevData.findIndex(
          (candle) => candle.x === newCandle.x
        );

        if (candleIndex !== -1) {
          const updatedData = [...prevData];
          updatedData[candleIndex] = newCandle;
          return updatedData;
        }

        return [...prevData, newCandle].slice(-maxDataPoints);
      });
    },
    [maxDataPoints]
  );

  useEffect(() => {
    if (!symbol) return;

    let ws: WebSocket;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<RawCandleData[]>(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${maxDataPoints}`
        );
        setData(processFetchedData(response.data));
      } catch {
        setError('Failed to fetch historical data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const createWebSocket = () => {
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
      );

      ws.onopen = () => setLoading(false);

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message?.k) {
            const kline = message.k;
            const newCandle: CandleData = {
              x: kline.t,
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
    };

    createWebSocket();

    return () => ws && ws.close();
  }, [symbol, interval, maxDataPoints, processFetchedData, updateData]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};

export default useCryptoKLine;
