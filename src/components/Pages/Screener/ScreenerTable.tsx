import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Table,
  Text,
  Avatar,
  Flex,
  Progress,
  ScrollArea,
  Paper
} from '@mantine/core';
import { TickerWithSparkline } from 'hooks/usePaginatedCryptoTicker';
import SparklineChart from 'components/Pages/Screener/SparklineChart';
import { useNavigate } from 'react-router-dom';
import {
  IconTriangleFilled,
  IconTriangleInvertedFilled,
  IconCaretUpFilled,
  IconCaretDownFilled,
  IconMinus
} from '@tabler/icons-react';
import classes from 'assets/app/screener.module.css';
import PriceCell from './PriceCell';
import PageTransition from 'components/App/PageTransition';

// Mapping currency symbols
const currencySymbols: Record<string, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  jpy: '¥'
};

// Helper function to get the currency symbol
const getCurrencySymbol = (currency: string) =>
  currencySymbols[currency.toLowerCase()] || currency.toUpperCase();

interface TableViewProps {
  data: TickerWithSparkline[];
  vsCurrency: string;
}

const TableView: React.FC<TableViewProps> = ({ data, vsCurrency }) => {
  const navigate = useNavigate();
  const currencySymbol = getCurrencySymbol(vsCurrency);

  // Store previous prices for comparison
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>(
    {}
  );
  const [sortedDataBy, setSortedDataBy] = useState<
    Record<string, 'asc' | 'desc' | ''>
  >({});

  // Store the previous prices when data changes
  useEffect(() => {
    const newPrices = Object.fromEntries(
      data.map((ticker) => [ticker.id, ticker.current_price])
    );
    setPreviousPrices(newPrices);
  }, [data]);

  // Handle click to navigate
  const handleClick = useCallback(
    (id: string) => navigate(`/pair/${id}`, { replace: true }),
    [navigate]
  );

  // Memoize the sorting function to avoid re-creation
  const handleSort = useCallback((dataKey: string) => {
    setSortedDataBy((current) => {
      const currentDirection = current[dataKey] || '';
      const directions: Record<string, 'asc' | 'desc' | ''> = {
        '': 'asc',
        asc: 'desc',
        desc: ''
      };
      return { [dataKey]: directions[currentDirection] };
    });
  }, []);

  // Helper function to render percentage values with color coding and triangles
  const renderPercentage = useCallback((value?: number) => {
    if (value === undefined) return 'N/A';
    const displayValue = value ? value.toFixed(2) : '0.00';
    const color =
      value > 0
        ? 'var(--mantine-color-teal-6)'
        : value < 0
          ? 'var(--mantine-color-red-6)'
          : 'var(--mantine-color-gray-text)';

    return (
      <Flex align="center" gap={6} c={color} className={classes.percentageText}>
        {value > 0 && <IconTriangleFilled size={10} />}
        {value < 0 && <IconTriangleInvertedFilled size={10} />} {displayValue}%
      </Flex>
    );
  }, []);

  // Helper function to render circulating supply and its percentage
  const renderCirculatingSupply = useCallback(
    (circulatingSupply: number, maxSupply: number | null) => {
      if (!circulatingSupply) return '';
      if (!maxSupply) return circulatingSupply.toLocaleString();

      const percentage = (circulatingSupply / maxSupply) * 100;
      return (
        <Flex direction="column" align="flex-end" w="100%">
          <Text fz={14}>{circulatingSupply.toLocaleString()}</Text>
          <Progress
            value={percentage}
            color="teal"
            mt={4}
            size="xs"
            className={classes.supplyProgress}
          />
        </Flex>
      );
    },
    []
  );

  // Table Headers with sorting indicators
  const headers = [
    { label: '#', sortKey: 'market_cap_rank' },
    { label: 'Name', sortKey: 'name' },
    { label: 'Price', sortKey: 'current_price' },
    { label: '1h %', sortKey: 'price_change_percentage_1h_in_currency' },
    { label: '24h %', sortKey: 'price_change_percentage_24h' },
    { label: '7d %', sortKey: 'price_change_percentage_7d_in_currency' },
    { label: 'Market Cap', sortKey: 'market_cap' },
    { label: 'Volume (24H)', sortKey: 'total_volume' },
    { label: 'Circulating Supply', sortKey: 'circulating_supply' },
    { label: 'Chart 1w', sortKey: '' } // No sort for Chart
  ];

  // Render table rows with memoized and sorted data
  const sortedData = useMemo(() => {
    const [key, direction] = Object.entries(sortedDataBy)[0] || [];
    if (!key || !direction) return data;

    return [...data].sort((a, b) => {
      const valA = a[key as keyof TickerWithSparkline];
      const valB = b[key as keyof TickerWithSparkline];
      const compare = (valA ?? 0) > (valB ?? 0) ? 1 : -1;
      return direction === 'asc' ? compare : -compare;
    });
  }, [data, sortedDataBy]);

  return (
    <Paper shadow="lg" radius="lg">
      <ScrollArea>
        <Table
          highlightOnHover
          withRowBorders
          verticalSpacing="md"
          horizontalSpacing="lg"
          className={classes.tableContainer}
        >
          <Table.Thead>
            <Table.Tr>
              {headers.map(({ label, sortKey }) => (
                <Table.Th
                  key={label}
                  onClick={sortKey ? () => handleSort(sortKey) : undefined} // Disable sort on 'Chart 1w'
                  className={classes.tableCell}
                >
                  <Flex align="center" className={classes.tableHeaderCell}>
                    {sortedDataBy[sortKey] === 'asc' && (
                      <IconCaretUpFilled size={14} />
                    )}
                    {sortedDataBy[sortKey] === 'desc' && (
                      <IconCaretDownFilled size={14} />
                    )}
                    {label}
                  </Flex>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.map((ticker) => (
              <Table.Tr
                key={ticker.id}
                className={classes.tableCell}
                onClick={() => handleClick(ticker.id)}
                style={{ cursor: 'pointer', textAlign: 'left' }}
              >
                <Table.Td>
                  {ticker.market_cap_rank?.toLocaleString() || 'N/A'}
                </Table.Td>
                <Table.Td>
                  <Flex w={{ base: '150px', md: '250px' }} align="center">
                    <PageTransition>
                      <Avatar
                        mr={14}
                        src={ticker.image}
                        alt={ticker.name}
                        size="md"
                        p={6}
                      />
                    </PageTransition>
                    <Flex direction="column">
                      <Text title={ticker.name} style={{ textWrap: 'wrap' }}>
                        {ticker.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: '16px',
                          color: 'var(--mantine-color-gray-text)'
                        }}
                      >
                        {ticker.symbol.toUpperCase()}
                      </Text>
                    </Flex>
                  </Flex>
                </Table.Td>
                <Table.Td>
                  <PriceCell
                    value={ticker.current_price || 0}
                    previousValue={previousPrices[ticker.id] || 0}
                    currencySymbol={currencySymbol}
                  />
                </Table.Td>
                <Table.Td>
                  {renderPercentage(
                    ticker.price_change_percentage_1h_in_currency
                  )}
                </Table.Td>
                <Table.Td>
                  {renderPercentage(ticker.price_change_percentage_24h)}
                </Table.Td>
                <Table.Td>
                  {renderPercentage(
                    ticker.price_change_percentage_7d_in_currency
                  )}
                </Table.Td>
                <Table.Td>
                  {(ticker.market_cap || 0).toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}{' '}
                  {currencySymbol}
                </Table.Td>
                <Table.Td>
                  {(ticker.total_volume || 0).toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}{' '}
                  {currencySymbol}
                  <Text className={classes.dimmedText}>
                    {ticker.total_volume ? (
                      <>
                        {(
                          ticker.total_volume / ticker.current_price
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2
                        })}{' '}
                        {ticker.symbol.toUpperCase()}
                      </>
                    ) : (
                      ''
                    )}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  {renderCirculatingSupply(
                    ticker.circulating_supply,
                    ticker.max_supply
                  )}
                </Table.Td>
                <Table.Td>
                  <SparklineChart
                    delta={
                      ticker.price_change_percentage_7d_in_currency?.toString() ||
                      ''
                    }
                    sparkline={ticker.sparkline_in_7d?.price ?? []}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};

export default React.memo(TableView);
