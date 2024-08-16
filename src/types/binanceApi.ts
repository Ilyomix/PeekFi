export interface BinanceSymbolInfo {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  // Ajoute d'autres propriétés si nécessaire
}

export interface BinanceTickerData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // Previous day's close price
  c: string; // Current price
  Q: string; // Close trade's quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade ID
  n: number; // Total number of trades
}

export interface TickerData {
  name: string | null;
  price: string | null;
  lastPrice: string | null;
  symbol: string;
  priceChange: string | null;
  priceChangePercent: string | null;
  highPrice: string | null;
  lowPrice: string | null;
  timestamp: Date | null;
  error: string | null;
  loading: boolean;
  volume: string | null;
  quoteVolume: string | null;
  currencyPair: string | null;
  cryptoId: string | null;
}
