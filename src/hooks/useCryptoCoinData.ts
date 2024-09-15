import { useEffect, useState } from 'react';
import axios from 'axios';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey'; // Ensure this utility handles API key fetching correctly
import { L } from 'vitest/dist/reporters-yx5ZTtEV.js';

interface MarketData {
  current_price: { [key: string]: number };
  market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  high_24h: { [key: string]: number };
  low_24h: { [key: string]: number };
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: { [key: string]: number };
  ath_change_percentage: { [key: string]: number };
  atl: { [key: string]: number };
  atl_change_percentage: { [key: string]: number };
  market_cap_rank: number;
  // Add other fields as needed
}

interface CoinLinks {
  homepage: string[];
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name: string;
  facebook_username: string;
  bitcointalk_thread_identifier: string | null;
  telegram_channel_identifier: string;
  subreddit_url: string;
  repos_url: {
    github: string[];
    bitbucket: string[];
  };
}

interface DeveloperData {
  fork: number;
  stars: number;
  subscribers: number;
  total_issues: number;
  closed_issues: number;
  pull_requests_merged: number;
  pull_request_contributors: number;
  code_additions_deletions_4_weeks: {
    additions: number;
    deletions: number;
  };
  commit_count_4_weeks: number;
  last_4_weeks_commit_activity_series: number[];
}

interface CommunityData {
  facebook_likes: number | null;
  twitter_followers: number | null;
  reddit_average_posts_48h: number;
  reddit_average_comments_48h: number;
  reddit_subscribers: number;
  reddit_accounts_active_48h: number;
  telegram_channel_user_count: number | null;
}

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  description: { [key: string]: string };
  image: { thumb: string; small: string; large: string };
  market_data: MarketData;
  market_cap_rank: number;
  links: CoinLinks;
  developer_data: DeveloperData;
  community_data: CommunityData;
  // Add other fields as needed
}

interface UseCoinGeckoCoinDataResponse {
  coinData: CoinData | null;
  loading: boolean;
  error: string | null;
}

const useCoinGeckoCoinData = (
  id: string,
  vsCurrency: string = 'usd'
): UseCoinGeckoCoinDataResponse => {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      try {
        const privateKey = getPrivateKey();
        const url = `https://pro-api.coingecko.com/api/v3/coins/${id}`;
        const response = await axios.get(url, {
          headers: { 'x-cg-pro-api-key': privateKey },
          params: {
            localization: true,
            tickers: true,
            market_data: true,
            community_data: true,
            developer_data: true,
            sparkline: true
          }
        });
        setCoinData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch coin data:', err);
        setError('Failed to fetch coin data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, []);

  return { coinData, loading, error };
};

export default useCoinGeckoCoinData;
