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

  useEffect(() => {
    // Declare intervalId with let if it needs to be reassigned
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
            volume
          } = ticker;

          newTickersData[symbol.toLowerCase()] = {
            name: symbol,
            price: lastPrice,
            priceChange,
            priceChangePercent,
            highPrice,
            lowPrice,
            lastPrice,
            symbol,
            quoteVolume,
            volume,
            cryptoId: symbol,
            currencyPair:
              symbol.match(/USDT|BUSD|USD|EUR|GBP|AUD|JPY/)?.[0] || 'UNKNOWN',
            timestamp: new Date(),
            loading: false,
            error: null
          };
        });

        setTickersData(newTickersData);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Error fetching crypto data');
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

  return { tickersData, loading, error };
};

export default useMultipleCryptoTickers;
