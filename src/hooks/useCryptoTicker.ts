import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      setError(null);

      try {
        const symbolParams = symbols
          .map((symbol) => `"${symbol.toUpperCase()}"`)
          .join(',');
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbolParams}]`;

        const response = await axios.get(url);
        const data = response.data;

        const newTickersData: Record<string, TickerData> = {};

        data.forEach((ticker: TickerData) => {
          const {
            symbol,
            lastPrice,
            priceChange,
            priceChangePercent,
            highPrice,
            lowPrice,
            quoteVolume,
            volume,
            openPrice,
            prevClosePrice
          } = ticker;

          newTickersData[symbol.toLowerCase()] = {
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
        });

        setTickersData(newTickersData);
        setHasFetched(true); // Mark as fetched once the data is loaded
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Error fetching crypto data');
        setTickersData({});
        setHasFetched(true); // Mark as fetched even if there is an error
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData(); // Initial fetch

    const intervalId = setInterval(fetchCryptoData, interval);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [symbols, interval]);

  return { tickersData, loading, error, hasFetched };
};

export default useMultipleCryptoTickers;
