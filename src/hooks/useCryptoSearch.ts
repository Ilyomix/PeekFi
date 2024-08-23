import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';
import throttle from 'lodash/throttle';

export interface CryptoSearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  current_price?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
  };
}

interface CoinMarketData {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export const useCryptoSearch = () => {
  const privateKey = getPrivateKey();

  const [results, setResults] = useState<CryptoSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    try {
      const trendingResponse = await axios.get<{ coins: TrendingCoin[] }>(
        'https://api.coingecko.com/api/v3/search/trending',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': privateKey
          }
        }
      );

      const trendingCoins = trendingResponse.data.coins.map((item) => ({
        id: item.item.id,
        name: item.item.name,
        symbol: item.item.symbol,
        market_cap_rank: item.item.market_cap_rank,
        thumb: item.item.thumb
      }));

      const coinIds = trendingCoins.map((coin) => coin.id).join(',');

      const priceResponse = await axios.get<CoinMarketData[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': privateKey
          },
          params: {
            vs_currency: 'usd',
            ids: coinIds
          }
        }
      );

      const mergedResults: CryptoSearchResult[] = trendingCoins.map((coin) => {
        const priceData = priceResponse.data.find(
          (item) => item.id === coin.id
        );
        return {
          ...coin,
          current_price: priceData?.current_price,
          price_change_percentage_24h: priceData?.price_change_percentage_24h,
          total_volume: priceData?.total_volume
        };
      });

      setResults(mergedResults);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    } finally {
      setLoading(false);
    }
  }, [privateKey]);

  const search = useCallback(
    throttle(async (query: string) => {
      setLoading(true);

      if (!query) {
        await fetchTrending();
        return;
      }

      try {
        const searchResponse = await axios.get<{ coins: CryptoSearchResult[] }>(
          'https://api.coingecko.com/api/v3/search',
          {
            headers: {
              accept: 'application/json',
              'x-cg-demo-api-key': privateKey
            },
            params: { query }
          }
        );

        const coins = searchResponse.data.coins.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          market_cap_rank: coin.market_cap_rank,
          thumb: coin.thumb
        }));

        if (coins.length === 0) {
          setResults([]);
          return;
        }

        const coinIds = coins.map((coin) => coin.id).join(',');

        const priceResponse = await axios.get<CoinMarketData[]>(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            headers: {
              accept: 'application/json',
              'x-cg-demo-api-key': privateKey
            },
            params: {
              vs_currency: 'usd',
              ids: coinIds
            }
          }
        );

        const mergedResults: CryptoSearchResult[] = coins.map((coin) => {
          const priceData = priceResponse.data.find(
            (item) => item.id === coin.id
          );
          return {
            ...coin,
            current_price: priceData?.current_price,
            price_change_percentage_24h: priceData?.price_change_percentage_24h,
            total_volume: priceData?.total_volume
          };
        });

        setResults(mergedResults);
      } catch (error) {
        console.error('Error fetching crypto search results:', error);
      } finally {
        setLoading(false);
      }
    }, 200),
    [fetchTrending, privateKey]
  );

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return { results, search, loading };
};
