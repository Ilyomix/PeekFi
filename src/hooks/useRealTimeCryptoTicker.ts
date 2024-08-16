import { useState, useEffect } from 'react';

// Define the type for ticker data
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
  loading: boolean;
  error: string | null;
};

// Define the WebSocket URL for Binance
const WEBSOCKET_URL = 'wss://stream.binance.com:9443/ws';

const useCryptoTicker = (symbol: string) => {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WEBSOCKET_URL}/${symbol.toLowerCase()}@ticker`);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setLoading(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const updatedTickerData: TickerData = {
          symbol: data.s,
          price: data.c,
          priceChange: data.p,
          priceChangePercent: data.P,
          highPrice: data.h,
          lowPrice: data.l,
          openPrice: data.o,
          prevClosePrice: data.x,
          quoteVolume: data.q,
          volume: data.v,
          lastPrice: data.c,
          currencyPair:
            data.s.match(/USDT|USD|EUR|GBP|AUD|JPY|TRY/)?.[0] || 'UNKNOWN',
          timestamp: new Date(),
          loading: false,
          error: null
        };

        setTickerData(updatedTickerData);
        setLoading(false);
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

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [symbol]);

  return { tickerData, loading, error };
};

export default useCryptoTicker;
