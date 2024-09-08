import React, { useState, useEffect } from 'react';
import { Flex, Pagination, rem } from '@mantine/core';
import usePaginatedCryptoData from 'hooks/usePaginatedCryptoTicker';
import TableView from 'components/Pages/Screener/ScreenerTable';
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowLeft,
  IconArrowRight
} from '@tabler/icons-react';
import DisplayPreferences from './DisplayPreferences';
import FilterComponent from './FilterScreenerTable';
import TableSkeleton from './TableSkeleton';
import PageTransition from 'components/App/PageTransition';
import GoToTopButton from 'components/App/GoToTopButton';

const FinancialMap: React.FC = () => {
  const { itemsPerPage, filter } = useScreenerDisplayPreferences();
  const params = useParams();
  const navigate = useNavigate();

  const initialPage = parseInt(params.page as string, 10);
  const validInitialPage =
    !isNaN(initialPage) && initialPage > 0 ? initialPage : 1;

  const [currentPage, setCurrentPage] = useState<number>(validInitialPage);
  const {
    tickersData,
    error,
    loading,
    fetching: fetched,
    totalPages,
    goToPage,
    vsCurrency
  } = usePaginatedCryptoData(currentPage, itemsPerPage, 'usd', filter);
  // Ensure current page is valid when totalPages changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
      navigate('/screener/page/1', { replace: true });
    }
  }, [currentPage, totalPages, navigate]);

  const resetPage = () => {
    goToPage(1);
    setCurrentPage(1);
  };

  const setTablePage = (page: number) => {
    setCurrentPage(page);
    goToPage(page);
    navigate('/screener/page/' + page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <PageTransition duration={0.5}>
      <div style={{ position: 'relative' }}>
        <Flex
          gap={14}
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'start', md: 'space-between' }}
          align={{ base: 'start', md: 'center' }}
          my={rem(14)}
        >
          <FilterComponent resetPage={resetPage} />
          <DisplayPreferences />
        </Flex>
        {fetched ? (
          <TableSkeleton itemsPerPage={itemsPerPage} />
        ) : (
          <>
            {' '}
            <TableView
              vsCurrency={vsCurrency}
              data={tickersData}
              loading={loading}
            ></TableView>
            {totalPages > 1 ? (
              <Flex align="center" justify="center" my={rem(14)} mt={rem(28)}>
                <Pagination
                  value={currentPage}
                  onChange={(page) => setTablePage(page)}
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
                />
              </Flex>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      <GoToTopButton />
    </PageTransition>
  );
};

export default FinancialMap;
