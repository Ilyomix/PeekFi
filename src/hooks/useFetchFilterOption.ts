import { useState, useEffect } from 'react';
import axios from 'axios';
import { getPrivateKey } from 'utils/getCoinGeckoApiKey';

interface Category {
  id: string;
  name: string;
}

interface FilterOptions {
  categories: Category[];
}

const useFetchFilterOptions = () => {
  const privateKey = getPrivateKey();

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: []
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState<boolean>(false); // Cache flag to avoid unnecessary refetches

  useEffect(() => {
    if (cached) return; // Skip fetching if data is already cached

    const fetchFilters = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await axios.get(
          'https://pro-api.coingecko.com/api/v3/coins/categories?order=market_cap_change_24h_desc',
          {
            headers: {
              accept: 'application/json',
              'x-cg-pro-api-key': privateKey
            }
          }
        );

        setFilterOptions({
          categories: categoriesResponse.data
        });

        setCached(true); // Mark data as cached
      } catch (err) {
        setError('Failed to fetch filter options');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [privateKey, cached]);
  return { filterOptions, loading, error };
};

export default useFetchFilterOptions;
