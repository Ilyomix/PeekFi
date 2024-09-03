import React, { useState, useEffect } from 'react';
import { Flex, Pagination, rem } from '@mantine/core';
import usePaginatedCryptoData from 'hooks/usePaginatedCryptoTicker';
import Filters from 'components/Pages/Screener/Filters';
import TableSkeleton from 'components/Pages/Screener/TableSkeleton';
import TableView from 'components/Pages/Screener/ScreenerTable';
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowLeft,
  IconArrowRight
} from '@tabler/icons-react';

const FinancialMap: React.FC = () => {
  const { itemsPerPage, setItemsPerPage, setFilter, filter } =
    useScreenerDisplayPreferences();
  const params = useParams();
  const navigate = useNavigate();

  const initialPage = parseInt(params.page as string, 10);
  const validInitialPage =
    !isNaN(initialPage) && initialPage > 0 ? initialPage : 1;

  const [currentPage, setCurrentPage] = useState<number>(validInitialPage);

  const { tickersData, error, loading, totalPages, goToPage, vsCurrency } =
    usePaginatedCryptoData(currentPage, itemsPerPage, 'usd', filter);

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
          itemsPerPage={itemsPerPage}
          currentFilter={filter}
        />
        <TableSkeleton rows={10} columns={9} />{' '}
        {/* Adjust rows/columns as needed */}
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <TableView
        vsCurrency={vsCurrency}
        data={tickersData}
        filter={filter}
        setFilter={setFilter}
      >
        <Filters
          setFilter={setFilter}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
          currentFilter={filter}
        />
      </TableView>
      <Flex align="center" justify="center" my={rem(14)} mt={rem(28)}>
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
        />
      </Flex>
    </div>
  );
};

export default FinancialMap;