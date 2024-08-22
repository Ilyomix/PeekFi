import { useState, useEffect } from 'react';

type TickerData = {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  openPrice: string;
  prevClosePrice: string;
  quoteVolume: string;
  volume: string;
  lastPrice: string;
  currencyPair: string;
  timestamp: Date;
};

type UseCryptoTickerReturn = {
  tickerData: TickerData | null;
  loading: boolean;
  error: string | null;
};

const WEBSOCKET_URL = 'wss://stream.binance.com:9443/ws';

const useCryptoTicker = (symbol: string): UseCryptoTickerReturn => {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WEBSOCKET_URL}/${symbol.toLowerCase()}@ticker`);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setLoading(true);
    };

    ws.onmessage = ({ data }) => {
      try {
        const {
          s: symbol,
          c: price,
          p: priceChange,
          P: priceChangePercent,
          h: highPrice,
          l: lowPrice,
          o: openPrice,
          x: prevClosePrice,
          q: quoteVolume,
          v: volume
        } = JSON.parse(data);

        setTickerData({
          symbol,
          price,
          priceChange,
          priceChangePercent,
          highPrice,
          lowPrice,
          openPrice,
          prevClosePrice,
          quoteVolume,
          volume,
          lastPrice: price,
          currencyPair:
            symbol.match(/USDT|USD|EUR|GBP|AUD|JPY|TRY/)?.[0] || 'UNKNOWN',
          timestamp: new Date()
        });
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
        setError('Error parsing WebSocket data');
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket error');
      setLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return { tickerData, loading, error };
};

export default useCryptoTicker;
