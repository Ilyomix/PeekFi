// Types for CoinMarketCap API responses

export interface CoinMarketCapTickerData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  price_usd: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap_usd: number;
}

export interface CoinMarketCapGlobalData {
  active_cryptocurrencies: number;
  active_market_pairs: number;
  active_exchanges: number;
  total_market_cap_usd: number;
  total_24h_volume_usd: number;
}

export interface CoinMarketCapPaginatedResponse<T> {
  data: T[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
}
