import React, { useCallback, useState, useEffect } from 'react';
import { Table, Text, Avatar, Flex, Progress, ScrollArea } from '@mantine/core';
import { TickerWithSparkline } from 'hooks/usePaginatedCryptoTicker';
import SparklineChart from 'components/Pages/Screener/SparklineChart';
import { useNavigate } from 'react-router-dom';
import classes from 'assets/app/screener.module.css';
import PriceCell from './PriceCell'; // Import the PriceCell component

const currencySymbols: Record<string, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  jpy: '¥'
  // Add other currencies as needed
};

const getCurrencySymbol = (currency: string) =>
  currencySymbols[currency.toLowerCase()] || currency.toUpperCase();

interface TableViewProps {
  data: TickerWithSparkline[];
  vsCurrency: string;
}

const TableView: React.FC<TableViewProps> = ({ data, vsCurrency }) => {
  const navigate = useNavigate();
  const currencySymbol = getCurrencySymbol(vsCurrency);

  // State to store previous prices for comparison
  const [previousPrices, setPreviousPrices] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    // Update previous prices when data changes
    const newPrices: { [key: string]: number } = {};
    data.forEach((ticker) => {
      newPrices[ticker.id] = ticker.current_price;
    });
    setPreviousPrices(newPrices);
  }, [data]);

  const handleClick = useCallback(
    (id: string, symbol: string) => {
      if (symbol) navigate(`/pair/${id}`, { replace: true });
    },
    [navigate]
  );

  const renderPercentage = (value: number | undefined) => {
    const displayValue = value ? value.toFixed(2) : '0.00';
    const color =
      value !== undefined && value > 0
        ? 'var(--mantine-color-teal-6)'
        : value !== undefined && value < 0
          ? 'var(--mantine-color-red-6)'
          : 'var(--mantine-color-gray-text)';
    return (
      <Text c={color} className={classes.percentageText}>
        {displayValue}%
      </Text>
    );
  };

  const renderCirculatingSupply = (
    circulatingSupply: number,
    maxSupply: number | null
  ) => {
    if (!maxSupply || !circulatingSupply)
      return circulatingSupply
        ? circulatingSupply.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })
        : 'N/A';
    const percentage = (circulatingSupply / maxSupply) * 100;
    return (
      <Flex direction="column" align="flex-end" w="100%">
        <Text fz={14}>
          {circulatingSupply && circulatingSupply.toLocaleString()}
        </Text>
        <Progress
          value={percentage}
          color="teal"
          mt={4}
          size="xs"
          className={classes.supplyProgress}
        />
      </Flex>
    );
  };

  return (
    <div>
      <ScrollArea>
        <Table
          highlightOnHover
          highlightOnHoverColor="rgba(255, 255, 255, 0.1)"
          withRowBorders
          verticalSpacing="md"
          horizontalSpacing="lg"
          className={classes.tableContainer}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={classes.tableCell}>#</Table.Th>
              <Table.Th className={classes.tableCell}>Name</Table.Th>
              <Table.Th className={classes.tableCell}>Price</Table.Th>
              <Table.Th className={classes.tableCell}>1h %</Table.Th>
              <Table.Th className={classes.tableCell}>24h %</Table.Th>
              <Table.Th className={classes.tableCell}>7d %</Table.Th>
              <Table.Th className={classes.tableCell}>Market Cap</Table.Th>
              <Table.Th className={classes.tableCell}>Volume (24H)</Table.Th>
              <Table.Th className={classes.tableCell}>
                Circulating Supply
              </Table.Th>
              <Table.Th className={classes.tableCell}>Chart 1w</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((ticker) => (
              <Table.Tr
                key={ticker.id}
                className={classes.tableCell}
                style={{ cursor: 'pointer', textAlign: 'left' }}
                onClick={() => handleClick(ticker.id, ticker.symbol)}
              >
                <Table.Td>
                  {ticker.market_cap_rank
                    ? ticker.market_cap_rank.toLocaleString()
                    : 'N/A'}
                </Table.Td>
                <Table.Td>
                  <Flex w={{ base: '150px', md: '250px' }} align="center">
                    <Avatar
                      mr={14}
                      src={ticker.image}
                      alt={ticker.name}
                      size="sm"
                    />
                    <Flex
                      justify="center"
                      align={{ base: 'start', sm: 'center' }}
                      gap={{ base: '', sm: 'xs' }}
                      direction={{ base: 'column', sm: 'row' }}
                    >
                      <Text
                        component="p"
                        title={ticker.name}
                        style={{
                          whiteSpaceCollapse: 'collapse',
                          textWrap: 'wrap'
                        }}
                      >
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
                    value={
                      ticker.current_price !== undefined
                        ? ticker.current_price
                        : 0
                    }
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
                  {ticker.market_cap ? (
                    <Text lineClamp={1} fz={14} truncate="end">
                      {(ticker.market_cap !== undefined
                        ? ticker.current_price * ticker.circulating_supply
                        : 0
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })}{' '}
                      {currencySymbol}
                    </Text>
                  ) : (
                    'N/A'
                  )}
                </Table.Td>
                <Table.Td>
                  {ticker.total_volume ? (
                    <span>
                      {(ticker.total_volume !== undefined
                        ? ticker.total_volume
                        : 0
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })}{' '}
                      {currencySymbol}
                    </span>
                  ) : (
                    ''
                  )}
                  {ticker.total_volume && ticker.current_price ? (
                    <Text className={classes.dimmedText}>
                      {(ticker.total_volume !== undefined
                        ? Number(
                            (
                              ticker.total_volume / ticker.current_price
                            ).toFixed(2)
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2
                          })
                        : 0
                      ).toLocaleString()}{' '}
                      {ticker.symbol.toUpperCase()}
                    </Text>
                  ) : (
                    'N/A'
                  )}
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
    </div>
  );
};

export default TableView;
