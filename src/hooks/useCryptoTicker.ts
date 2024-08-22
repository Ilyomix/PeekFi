import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TickerData } from 'types/binanceApi';

const useMultipleCryptoTickers = (
  symbols: string[],
  interval: number = 5000
) => {
  const [tickersData, setTickersData] = useState<Record<string, TickerData>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const formatTickerData = (data: TickerData[]): Record<string, TickerData> =>
    data.reduce(
      (
        acc,
        {
          symbol,
          lastPrice,
          priceChange,
          priceChangePercent,
          highPrice,
          lowPrice,
          openPrice,
          prevClosePrice,
          quoteVolume,
          volume
        }
      ) => {
        acc[symbol.toLowerCase()] = {
          name: symbol.replace(/USDT|USD|EUR|GBP|AUD|JPY|TRY/g, ''),
          price: lastPrice,
          priceChange,
          priceChangePercent,
          highPrice,
          lowPrice,
          openPrice,
          prevClosePrice,
          lastPrice,
          symbol,
          quoteVolume,
          volume,
          cryptoId: symbol,
          currencyPair:
            symbol.match(/USDT|USD|EUR|GBP|AUD|JPY|TRY/)?.[0] || 'UNKNOWN',
          timestamp: new Date(),
          loading: false,
          error: null
        };
        return acc;
      },
      {} as Record<string, TickerData>
    );

  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols
        .map((s) => `"${s.toUpperCase()}"`)
        .join(',')}]`;
      const { data } = await axios.get(url);

      setTickersData(formatTickerData(data));
      setHasFetched(true);
    } catch {
      setError('Error fetching crypto data');
      setTickersData({});
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    fetchCryptoData();
    const intervalId = setInterval(fetchCryptoData, interval);
    return () => clearInterval(intervalId);
  }, [fetchCryptoData, interval]);

  return { tickersData, loading, error, hasFetched };
};

export default useMultipleCryptoTickers;
