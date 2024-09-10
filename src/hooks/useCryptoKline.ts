import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';

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

// Max number of data points to display
const MAX_DATA_POINTS = 375;

const rangeMapping: Record<
  string,
  {
    days: string;
    binanceInterval: string;
    granularity: number;
  }
> = {
  '1D': {
    days: '1',
    binanceInterval: '1m',
    granularity: 60 * 1000
  },
  '1W': {
    days: '7',
    binanceInterval: '15m',
    granularity: 15 * 60 * 1000
  },
  '1M': {
    days: '30',
    binanceInterval: '1h',
    granularity: 60 * 60 * 1000
  },
  '3M': {
    days: '90',
    binanceInterval: '4h',
    granularity: 4 * 60 * 60 * 1000
  },
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

// Function to sample the data and ensure the first and last points are always kept
const sampleData = (data: CandleData[], maxPoints: number): CandleData[] => {
  if (data.length <= maxPoints) return data;

  const step = Math.ceil((data.length - 2) / (maxPoints - 2));

  const sampledData = data.filter((_, index) => {
    return index === 0 || index === data.length - 1 || index % step === 0;
  });

  return sampledData;
};

const fetchCoinGeckoMarketChartData = async (
  id: string,
  vsCurrency: string,
  days: string
): Promise<CandleData[]> => {
  const privateKey = getPrivateKey();
  const response = await axios.get(
    `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart`,
    {
      headers: {
        accept: 'application/json',
        'x-cg-pro-api-key': privateKey
      },
      params: {
        vs_currency: vsCurrency,
        days: days
      }
    }
  );

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

const fetchCoinGeckoSymbol = async (id: string): Promise<string> => {
  const privateKey = getPrivateKey();
  const response = await axios.get(
    `https://pro-api.coingecko.com/api/v3/coins/${id}`,
    {
      headers: {
        accept: 'application/json',
        'x-cg-pro-api-key': privateKey
      },
      params: {
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    }
  );
  return response.data.symbol.toUpperCase();
};

const fetchBinanceSymbols = async (): Promise<Set<string>> => {
  const response = await axios.get(
    'https://api.binance.com/api/v3/exchangeInfo'
  );
  return new Set(
    response.data.symbols.map((symbol: { symbol: string }) => symbol.symbol)
  );
};

const findBinancePair = (
  symbol: string,
  vsCurrency: string,
  binanceSymbols: Set<string>
): string | null => {
  const directPair = `${symbol}${vsCurrency}`.toUpperCase();
  const usdtPair = `${symbol}USDT`.toUpperCase();

  return binanceSymbols.has(directPair)
    ? directPair
    : binanceSymbols.has(usdtPair)
      ? usdtPair
      : null;
};

const useCryptoKLine = (
  id: string,
  vsCurrency: string = 'usd',
  range: string = '1D'
): UseCryptoKLineResponse => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openPrice, setOpenPrice] = useState<number | null>(0);
  const [deltaPercent, setDeltaPercent] = useState<number | null>(0);
  const [deltaPositive, setDeltaPositive] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(0);
  const [delta, setDelta] = useState<number | null>(0);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    try {
      const { days } = rangeMapping[range];
      const fetchedData = await fetchCoinGeckoMarketChartData(
        id,
        vsCurrency,
        days
      );

      if (fetchedData.length > 1) {
        const sampledData = sampleData(fetchedData, MAX_DATA_POINTS);
        const firstCandleOpenPrice = sampledData[0]?.open ?? null;
        setOpenPrice(firstCandleOpenPrice);
        const currentPrice = sampledData[sampledData.length - 1]?.y ?? null;
        setDeltaPercent((currentPrice / firstCandleOpenPrice - 1) * 100);
        setDeltaPositive(currentPrice > firstCandleOpenPrice);
        setCurrentPrice(currentPrice);
        if (firstCandleOpenPrice !== null && currentPrice !== null) {
          setDelta(currentPrice - firstCandleOpenPrice);
        }

        setData(sampledData);
        setError(null);
      } else {
        setError('Insufficient data fetched from CoinGecko.');
      }
    } catch (err) {
      console.error('Failed to fetch historical data from CoinGecko:', err);
      setError('Failed to fetch historical data from CoinGecko.');
    } finally {
      setLoading(false);
    }
  }, [id, vsCurrency, range]);

  const initializeWebSocket = useCallback(
    (pair: string) => {
      if (wsRef.current) wsRef.current.close();

      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@kline_${
          rangeMapping[range].binanceInterval
        }`
      );

      ws.onopen = () => console.log('WebSocket connection established.');

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const kline = message.k;
        const newCandle: CandleData = {
          x: kline.t,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          y: parseFloat(kline.c)
        };

        setData((prevData) => {
          if (prevData.length === 0) return [newCandle];

          const lastCandle = prevData[prevData.length - 1];
          const { granularity } = rangeMapping[range];

          if (newCandle.x - lastCandle.x >= granularity) {
            const updatedData = [...prevData, newCandle];
            const sampledData = sampleData(updatedData, MAX_DATA_POINTS);

            const firstCandleOpenPrice = sampledData[0]?.open ?? null;
            setOpenPrice(firstCandleOpenPrice);

            const currentPrice = sampledData[sampledData.length - 1]?.y ?? null;
            if (firstCandleOpenPrice !== null && currentPrice !== null) {
              setDelta(currentPrice - firstCandleOpenPrice);
            }

            return sampledData;
          } else {
            lastCandle.high = Math.max(lastCandle.high, newCandle.high);
            lastCandle.low = Math.min(lastCandle.low, newCandle.low);
            lastCandle.y = newCandle.y;
            return [...prevData];
          }
        });
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('WebSocket connection error. Falling back to CoinGecko API.');
        ws.close();
      };

      ws.onclose = (event) => {
        console.warn(
          `WebSocket closed (code: ${event.code}, reason: ${
            event.reason || 'no reason'
          }).`
        );
        if (event.code !== 1000) {
          setError(
            'WebSocket connection closed unexpectedly. Falling back to CoinGecko API.'
          );
          fetchHistoricalData();
        }
      };

      wsRef.current = ws;
    },
    [range, fetchHistoricalData]
  );

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const [symbol, binanceSymbols] = await Promise.all([
          fetchCoinGeckoSymbol(id),
          fetchBinanceSymbols()
        ]);
        const pair = findBinancePair(symbol, vsCurrency, binanceSymbols);

        if (pair) {
          await fetchHistoricalData();
          initializeWebSocket(pair); // Now calling WebSocket initialization
        } else {
          console.warn(
            `Trading pair not found on Binance for ${symbol}${vsCurrency}. Fetching from CoinGecko.`
          );
          await fetchHistoricalData();
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize data.');
      } finally {
        setLoading(false);
      }
    };

    initialize();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [id, vsCurrency, range, fetchHistoricalData, initializeWebSocket]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      openPrice,
      delta,
      deltaPercent,
      deltaPositive,
      currentPrice
    }),
    [
      data,
      loading,
      error,
      openPrice,
      delta,
      deltaPercent,
      deltaPositive,
      currentPrice
    ]
  );
};

export default useCryptoKLine;
