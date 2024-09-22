import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';

interface MarketData {
  current_price: Record<string, number>;
  price_change_percentage_24h: number;
  price_change_24h: number;
  total_volume: Record<string, number>;
}

interface CryptoInfo {
  id: string;
  symbol: string;
  name: string;
  image: {
    small: string;
  };
  description: {
    en: string;
  };
  market_data: MarketData;
}

interface UseCryptoInfoResponse {
  data: CryptoInfo | null;
  loading: boolean;
  error: string | null;
}

const fetchCoinGeckoData = async (id: string): Promise<CryptoInfo> => {
  const privateKey = getPrivateKey();
  const response = await axios.get<CryptoInfo>(
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
  return response.data;
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

const useCryptoInfo = (
  id: string,
  vsCurrency: string = 'usd'
): UseCryptoInfoResponse => {
  const [data, setData] = useState<CryptoInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchCryptoInfo = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchCoinGeckoData(id);
      setData(fetchedData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data from CoinGecko:', err);
      setError('Failed to fetch data from CoinGecko.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const initializeWebSocket = useCallback(
    (pair: string) => {
      if (wsRef.current) wsRef.current.close();

      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@ticker`
      );

      ws.onopen = () => console.log('WebSocket connection established.');

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setData((prevData) => {
          if (prevData) {
            return {
              ...prevData,
              market_data: {
                ...prevData.market_data,
                current_price: {
                  ...prevData.market_data.current_price,
                  [vsCurrency]: parseFloat(message.c)
                },
                price_change_24h: parseFloat(message.p),
                price_change_percentage_24h: parseFloat(message.P)
              }
            };
          }
          return prevData;
        });
      };

      ws.onerror = (err) => {
        console.warn('WebSocket error:', err);
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
          fetchCryptoInfo();
        }
      };

      wsRef.current = ws;
    },
    [vsCurrency, fetchCryptoInfo]
  );

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const [cryptoData, binanceSymbols] = await Promise.all([
          fetchCoinGeckoData(id),
          fetchBinanceSymbols()
        ]);
        const symbol = cryptoData.symbol.toUpperCase();
        const pair = findBinancePair(symbol, vsCurrency, binanceSymbols);

        if (pair) {
          setData(cryptoData);
          initializeWebSocket(pair);
        } else {
          console.warn(
            `Trading pair not found on Binance for ${symbol}${vsCurrency}. Using CoinGecko data only.`
          );
          setData(cryptoData);
        }
      } catch (err) {
        console.warn('Initialization error:', err);
        setError('Failed to initialize data. Using CoinGecko only.');
        await fetchCryptoInfo();
      } finally {
        setLoading(false);
      }
    };

    initialize();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent onclose from triggering reconnection logic
        wsRef.current.close();
      }
    };
  }, [id, vsCurrency, fetchCryptoInfo, initializeWebSocket]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};

export default useCryptoInfo;
