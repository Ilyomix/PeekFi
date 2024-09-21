// useCryptoTicker.tsx

import { useState, useEffect, useRef } from 'react';

interface TickerData {
  name: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  prevClosePrice: number;
  lastPrice: number;
  symbol: string;
  quoteVolume: number;
  volume: number;
  cryptoId: string;
  currencyPair: string;
  timestamp: Date;
}

interface UseCryptoTickerReturn {
  tickersData: Record<string, TickerData>;
  error: string | null;
}

/**
 * Custom hook to fetch and manage real-time cryptocurrency ticker data using WebSocket streams.
 * @param {string[]} symbols - Array of cryptocurrency symbols to fetch data for (e.g., ['BTCUSDT', 'ETHUSDT']).
 * @returns {object} - An object containing ticker data and an error state.
 */
const useCryptoTicker = (symbols: string[]): UseCryptoTickerReturn => {
  const [tickersData, setTickersData] = useState<Record<string, TickerData>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // If no symbols are provided, do nothing
    if (symbols.length === 0) return;

    // Build the stream query parameter by joining all symbols
    const streams = symbols
      .map((symbol) => `${symbol.toLowerCase()}@ticker`)
      .join('/');

    // Construct the WebSocket URL
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    // Handle incoming messages from the WebSocket
    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        const data = response.data;

        if (data && data.e === '24hrTicker') {
          const {
            s: symbol,
            c: lastPrice,
            p: priceChange,
            P: priceChangePercent,
            h: highPrice,
            l: lowPrice,
            o: openPrice,
            x: prevClosePrice,
            q: quoteVolume,
            v: volume
          } = data;

          const tickerData: TickerData = {
            name: symbol.replace(/USDT|USD|EUR|GBP|AUD|JPY|TRY/g, ''),
            price: parseFloat(lastPrice),
            priceChange: parseFloat(priceChange),
            priceChangePercent: parseFloat(priceChangePercent),
            highPrice: parseFloat(highPrice),
            lowPrice: parseFloat(lowPrice),
            openPrice: parseFloat(openPrice),
            prevClosePrice: parseFloat(prevClosePrice),
            lastPrice: parseFloat(lastPrice),
            symbol,
            quoteVolume: parseFloat(quoteVolume),
            volume: parseFloat(volume),
            cryptoId: symbol,
            currencyPair:
              symbol.match(/USDT|USD|EUR|GBP|AUD|JPY|TRY/)?.[0] || 'UNKNOWN',
            timestamp: new Date()
          };

          // Update the state with the new ticker data
          setTickersData((prevData) => ({
            ...prevData,
            [symbol.toLowerCase()]: tickerData
          }));
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Error parsing data from WebSocket.');
      }
    };

    // Handle WebSocket errors
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('WebSocket encountered an error.');
    };

    // Clean up the WebSocket connection when the component unmounts or symbols change
    return () => {
      ws.close();
    };
  }, [symbols]);

  return { tickersData, error };
};

export default useCryptoTicker;
