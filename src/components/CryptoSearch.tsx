import React, { useState, useEffect } from 'react';
import { Spotlight, SpotlightActionData } from '@mantine/spotlight';
import { useCryptoSearch, CryptoSearchResult } from 'hooks/useCryptoSearch';
import {
  IconSearch,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Text, rem, Loader, Flex } from '@mantine/core';
import '@mantine/spotlight/styles.css';
import { useDebouncedValue } from '@mantine/hooks';

const CryptoSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedValueQuery] = useDebouncedValue(query, 200);
  const [internalLoading, setInternalLoading] = useState(false);
  const { results, search, loading } = useCryptoSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedValueQuery || debouncedValueQuery === '') {
      setInternalLoading(true);
      search(debouncedValueQuery).finally(() => {
        setInternalLoading(false);
      });
    }
  }, [debouncedValueQuery, search]);

  const isLoading = loading || internalLoading;

  const actions: SpotlightActionData[] = results.map(
    (coin: CryptoSearchResult) => {
      const priceChangeColor =
        Number(coin.price_change_percentage_24h) < 0
          ? 'var(--mantine-color-red-5)'
          : 'var(--mantine-color-teal-5)';
      const PriceChangeIcon =
        Number(coin.price_change_percentage_24h) < 0
          ? IconArrowDownRight
          : IconArrowUpRight;

      return {
        group: !query && !isLoading ? '🔥 Trending coins' : '🔎 Search results',
        id: coin.id,
        onClick: () => navigate(`/pair/${coin.symbol}usdt`),
        dimmedSections: false,
        keywords: results.map((result) => result.name),
        leftSection: (
          <Flex align="center" gap={12}>
            <Avatar
              src={coin.thumb}
              alt={`${coin.symbol} icon`}
              size={24}
              ml={14}
              my={12}
            />
            <Text fw={600}>{`${
              coin.name
            } (${coin.symbol.toUpperCase()})`}</Text>
          </Flex>
        ),
        rightSection: (
          <Flex
            gap={3}
            direction="column"
            align="end"
            justify="start"
            mx={rem(14)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: rem(8)
              }}
            >
              <Text component="div" size={rem(15)} fw={500} lh={0} mt={0}>
                ${coin.current_price?.toFixed(2) ?? 'N/A'}
              </Text>
              <Text
                component="div"
                size={rem(12)}
                c={priceChangeColor}
                lh={1}
                style={{ transform: 'translateY(0px)' }}
              >
                {coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
              </Text>
              <PriceChangeIcon
                style={{ lineHeight: 0 }}
                size={16}
                color={priceChangeColor}
              />
            </div>
          </Flex>
        )
      };
    }
  );

  return (
    <Spotlight
      actions={actions}
      radius="lg"
      style={{ border: 'none' }}
      shortcut={['mod + k']}
      searchProps={{
        leftSection: (
          <IconSearch
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        ),
        placeholder: 'Search...',
        rightSection: isLoading ? (
          <Loader type="dots" size="sm" color="teal.6" />
        ) : null
      }}
      variant="dark"
      nothingFound={isLoading ? 'Searching ...' : 'No matches found'}
      onQueryChange={(q) => {
        setQuery(q);
        if (q === '') {
          search(''); // Explicitly call search with an empty string to fetch trending results
        }
      }}
      limit={5}
    />
  );
};

export default CryptoSearch;
