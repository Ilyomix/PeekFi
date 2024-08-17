import { useMemo, useState } from 'react';
import { SimpleGrid, Paper, Skeleton, Flex, Pagination, rem } from '@mantine/core';
import PageTransition from 'components/PageTransition';
import usePaginatedCryptoTickers from 'hooks/usePaginatedCryptoTicker';
import FinancialCard from 'components/FinancialCard';
import Filters from 'components/Filters';
import { useFavoritesStore } from 'stores/useFavoritesStore'; // Import Favorites store
import classes from 'assets/components/financialCard/index.module.css';

export function FinancialMap() {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const { tickersData, error, hasFetched, totalPages, goToPage } =
    usePaginatedCryptoTickers((currentPage - 1) * itemsPerPage, itemsPerPage);

  const [filter, setFilter] = useState<string>('all');
  const favorites = useFavoritesStore((state) => state.favorites);

  // Filter tickers based on the selected filter
  const filteredTickers = useMemo(() => {
    const filtered = tickersData.filter((ticker) => {
      switch (filter) {
        case 'favorites':
          return favorites.includes(ticker.symbol.toUpperCase());
        case 'gainers':
          return Number(ticker.priceChangePercent) > 0;
        case 'losers':
          return Number(ticker.priceChangePercent) < 0;
        case 'volume':
          return Number(ticker.quoteVolume) > 0;
        default:
          return true;
      }
    });

    return filtered.sort((a, b) => {
      switch (filter) {
        case 'gainers':
          return Number(b.priceChangePercent) - Number(a.priceChangePercent);
        case 'losers':
          return Number(a.priceChangePercent) - Number(b.priceChangePercent);
        case 'volume':
          return Number(b.quoteVolume) - Number(a.quoteVolume);
        default:
          return 0;
      }
    });
  }, [tickersData, filter, favorites]);

  // Show loading skeletons if data has not been fetched yet
  if (!hasFetched) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <PageTransition key={index}>
            <Paper
              shadow="md"
              p="md"
              radius="lg"
              className={classes.card}
              h={220.5}
              pos="relative"
            >
              <Flex
                h="100%"
                justify="space-between"
                align="start"
                direction="column"
                gap={14}
              >
                <Skeleton radius={10} h={14} w="50%" />
                <Skeleton radius={10} h={7} w="36%" />
                <Skeleton radius={10} h={60} />
                <Skeleton radius={10} h={14} w="50%" />
                <Flex w="100%" gap={4} justify="space-between">
                  <Skeleton radius={10} h={7} w="33%" />
                  <Skeleton radius={10} h={7} w="33%" />
                </Flex>
                <Flex w="100%" gap={4} justify="space-between">
                  <Skeleton radius={10} h={7} w="33%" />
                  <Skeleton radius={10} h={7} w="33%" />
                </Flex>
              </Flex>
            </Paper>
          </PageTransition>
        ))}
      </SimpleGrid>
    );
  }

  // Display error message if data fetch fails
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Filters setFilter={setFilter} /> {/* Add Filters component */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {filteredTickers.map((ticker, index) => (
          <FinancialCard key={ticker.symbol} {...ticker} index={index} />
        ))}
      </SimpleGrid>
      <Flex align="center" justify="center" my={rem(24)}>
        <Pagination
          value={currentPage}
          onChange={(page) => {
            setCurrentPage(page);
            goToPage(page);
          }}
          total={totalPages}
          autoContrast
          color="light-dark(var(--mantine-color-dark-8), var(--mantine-color-yellow-8))"
          variant="light"
          siblings={1}
          boundaries={1}
          size="md"
          radius="xl"
          withControls
          withEdges
        />
      </Flex>
    </div>
  );
}
