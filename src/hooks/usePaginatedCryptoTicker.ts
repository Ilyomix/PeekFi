import { useState, useEffect } from 'react';
import axios from 'axios';
import { TickerData } from 'types/binanceApi';
import assetSymbols from 'utils/assetsSymbols';
const usePaginatedCryptoTickers = (
  start: number = 0,
  limit: number = 10,
  interval: number = 5000
) => {
  const [tickersData, setTickersData] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchTotalSymbols = async () => {
      setLoading(true);
      setError(null);

      try {
        // Récupération de tous les symboles disponibles via l'API exchangeInfo
        // const response = await axios.get(
        //   `https://api.binance.com/api/v3/ticker/24hr?symbols=[${assetSymbols}]`
        // );
        // const symbols = response.data.symbols;

        setTotalPages(Math.ceil(assetSymbols.length / limit));
      } catch (err) {
        console.error('Error fetching total symbols:', err);
        setError('Error fetching total symbols');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalSymbols();
  }, [limit]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      setError(null);

      try {
        // URL de l'API Binance avec pagination via limit et start
        const symbolParams = assetSymbols
          .map((symbol) => `"${symbol.toUpperCase()}"`)
          .join(',');
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbolParams}]`;

        const response = await axios.get(url);
        const data = response.data;

        const formattedData: TickerData[] = data.map((ticker: TickerData) => {
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

          return {
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

        setTickersData(formattedData.slice(start, start + limit));
        setHasFetched(true);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Error fetching crypto data');
        setTickersData([]);
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();

    const intervalId = setInterval(fetchCryptoData, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [start, limit, interval]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    tickersData,
    loading,
    error,
    hasFetched,
    currentPage,
    totalPages,
    goToPage
  };
};

export default usePaginatedCryptoTickers;
