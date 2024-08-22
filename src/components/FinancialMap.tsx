import React, { useMemo, useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';

const FinancialMap: React.FC = () => {
  const { itemsPerPage, cardsPerRow, setItemsPerPage, setCardsPerRow } =
    useScreenerDisplayPreferences();

  const params = useParams();
  const navigate = useNavigate();

  // Parse the page number from the URL
  const initialPage = parseInt(params.page as string, 10);
  const validInitialPage =
    !isNaN(initialPage) && initialPage > 0 ? initialPage : 1;

  const [currentPage, setCurrentPage] = useState<number>(validInitialPage);

  // Fetch data with the currentPage
  const { tickersData, error, loading, totalPages, goToPage, vsCurrency } =
    usePaginatedCryptoTickers(currentPage, itemsPerPage);

  const [filter, setFilter] = useState<string>('all');
  const favorites = useFavoritesStore((state) => state.favorites);

  // Define the cases and their corresponding actions
  console.log('Fetching data for page:', currentPage);
  const pageCases = {
    invalidNegativePage: () => {
      if (currentPage <= 1) {
        navigate(`/screener/page/1`, { replace: true });
      }
    },
    invalidOverMaxPage: () => {
      if (currentPage > totalPages) {
        console.log('passed');
        navigate(`/screener/page/1`, { replace: true });
      }
    },
    invalidPageFormat: () => {
      if (isNaN(currentPage)) {
        navigate(`/screener/page/1`, { replace: true });
      }
    }
  };

  // Execute the appropriate case based on the currentPage
  useEffect(() => {
    if (totalPages > 0) {
      Object.values(pageCases).forEach((caseHandler) => caseHandler());
    }
  }, [currentPage, totalPages, navigate]);

  // Filter tickers based on the selected filter
  const filteredTickers = useMemo(() => {
    return tickersData
      .filter((ticker) => {
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
      })
      .sort((a, b) => {
        switch (filter) {
          case 'gainers':
            return (
              b.price_change_percentage_24h - a.price_change_percentage_24h
            );
          case 'losers':
            return (
              a.price_change_percentage_24h - b.price_change_percentage_24h
            );
          case 'volume':
            return b.total_volume - a.total_volume;
          default:
            return 0;
        }
      });
  }, [tickersData, filter, favorites]);

  // Show a loading state
  if (loading) {
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
            vsCurrency={vsCurrency}
            sparkline_in_7d={ticker.sparkline_in_7d} // Pass historical data here
          />
        ))}
      </SimpleGrid>
      <Flex align="center" justify="center" my={rem(24)}>
        <Pagination
          value={currentPage}
          onChange={(page) => {
            setCurrentPage(page);
            goToPage(page);
            navigate('/screener/page/' + page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          total={totalPages}
          autoContrast
          color="light-dark(var(--mantine-color-dark-8), var(--mantine-color-teal-8))"
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
};

export default FinancialMap;
