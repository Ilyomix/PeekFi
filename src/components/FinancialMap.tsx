import { useMemo, useState } from 'react';
import {
  SimpleGrid,
  Paper,
  Skeleton,
  Flex,
  Pagination,
  rem
} from '@mantine/core';
import PageTransition from 'components/PageTransition';
import usePaginatedCryptoTickers from 'hooks/usePaginatedCryptoTicker';
import FinancialCard from 'components/FinancialCard';
import Filters from 'components/Filters';
import { useFavoritesStore } from 'stores/useFavoritesStore';
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';
import classes from 'assets/components/financialCard/index.module.css';

export function FinancialMap() {
  const { itemsPerPage, cardsPerRow, setItemsPerPage, setCardsPerRow } =
    useScreenerDisplayPreferences();

  const [currentPage, setCurrentPage] = useState(1);
  const { tickersData, error, hasFetched, totalPages, goToPage, vs_currency } =
    usePaginatedCryptoTickers((currentPage - 1) * itemsPerPage, itemsPerPage);

  const [filter, setFilter] = useState<string>('all');
  const favorites = useFavoritesStore((state) => state.favorites);

  // Filtre les tickers en fonction du filtre sélectionné
  const filteredTickers = useMemo(() => {
    const filtered = tickersData.filter((ticker) => {
      switch (filter) {
        case 'favorites':
          return favorites.includes(ticker.symbol.toUpperCase());
        case 'gainers':
          return ticker.price_change_percentage_24h > 0;
        case 'losers':
          return ticker.price_change_percentage_24h < 0;
        case 'volume':
          return ticker.total_volume > 0;
        default:
          return true;
      }
    });

    return filtered.sort((a, b) => {
      switch (filter) {
        case 'gainers':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'losers':
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case 'volume':
          return b.total_volume - a.total_volume;
        default:
          return 0;
      }
    });
  }, [tickersData, filter, favorites]);

  // Afficher des squelettes de chargement si les données ne sont pas encore récupérées
  if (!hasFetched) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, md: cardsPerRow }}>
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

  // Afficher un message d'erreur si les données n'ont pas pu être récupérées
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Filters
        setFilter={setFilter}
        setItemsPerPage={setItemsPerPage}
        setCardsPerRow={setCardsPerRow}
        itemsPerPage={itemsPerPage}
        cardsPerRow={cardsPerRow}
      />
      <SimpleGrid cols={{ base: 1, xs: 2, md: cardsPerRow }}>
        {filteredTickers.map((ticker, index) => (
          <FinancialCard
            key={ticker.id}
            {...ticker}
            index={index}
            vsCurrency={vs_currency}
          />
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
