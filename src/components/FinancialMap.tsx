import React, { useState, useEffect } from 'react';
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
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';
import { useNavigate, useParams } from 'react-router-dom';
import classes from 'assets/components/financialCard/index.module.css';
import {
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowLeft,
  IconArrowRight,
  IconGripHorizontal
} from '@tabler/icons-react';

const FinancialMap: React.FC = () => {
  const {
    itemsPerPage,
    cardsPerRow,
    setItemsPerPage,
    setCardsPerRow,
    setFilter,
    filter
  } = useScreenerDisplayPreferences();

  const params = useParams();
  const navigate = useNavigate();

  const initialPage = parseInt(params.page as string, 10);
  const validInitialPage =
    !isNaN(initialPage) && initialPage > 0 ? initialPage : 1;

  const [currentPage, setCurrentPage] = useState<number>(validInitialPage);

  const { tickersData, error, loading, totalPages, goToPage, vsCurrency } =
    usePaginatedCryptoTickers(currentPage, itemsPerPage, 'usd', filter);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      navigate(`/screener/page/1`, { replace: true });
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, navigate]);

  useEffect(() => {
    goToPage(currentPage); // Trigger fetch on filter or itemsPerPage change
  }, [currentPage, filter, goToPage, itemsPerPage]);

  if (loading) {
    return (
      <div>
        <Filters
          setFilter={setFilter}
          setItemsPerPage={setItemsPerPage}
          setCardsPerRow={setCardsPerRow}
          itemsPerPage={itemsPerPage}
          cardsPerRow={cardsPerRow}
          currentFilter={filter}
        />
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
      </div>
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
        currentFilter={filter}
      />
      <SimpleGrid cols={{ base: 1, xs: 2, md: cardsPerRow }}>
        {tickersData.map((ticker, index) => (
          <FinancialCard
            index={index}
            key={ticker.id}
            {...ticker}
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
          siblings={2}
          display="flex"
          boundaries={1}
          size="md"
          radius="xl"
          withControls
          withEdges
          nextIcon={IconArrowRight}
          previousIcon={IconArrowLeft}
          firstIcon={IconArrowBarToLeft}
          lastIcon={IconArrowBarToRight}
          dotsIcon={IconGripHorizontal}
        />
      </Flex>
    </div>
  );
};

export default FinancialMap;
