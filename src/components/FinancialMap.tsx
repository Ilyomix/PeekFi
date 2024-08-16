import { useMemo, useState, useEffect } from 'react';
import { SimpleGrid, Paper, Skeleton, rem, Flex, Group } from '@mantine/core';
import PageTransition from './PageTransition';
import useMultipleCryptoTickers from 'hooks/useCryptoTicker';
import assetSymbols from 'utils/assetsSymbols';
import FinancialCard from './FinancialCard';
import classes from 'assets/components/financialCard/index.module.css';

export function FinancialMap() {
  const { tickersData, error, hasFetched } =
    useMultipleCryptoTickers(assetSymbols);

  // const BATCH_SIZE = 4; // Customize the batch size
  // const [visibleBatches, setVisibleBatches] = useState(1);

  // useEffect(() => {
  //   if (hasFetched) {
  //     const interval = setInterval(() => {
  //       setVisibleBatches((prev) => prev + 1);
  //     }, 200); // Load new batch every 200ms

  //     return () => clearInterval(interval);
  //   }
  // }, [hasFetched]);

  const stats = useMemo(() => {
    return (
      Object.keys(tickersData)
        // .slice(0, BATCH_SIZE * visibleBatches)
        .map((symbol, index) => {
          const ticker = tickersData[symbol] || {};
          return <FinancialCard key={symbol} {...ticker} index={index} />;
        })
    );
  }, [tickersData]); // , visibleBatches]);

  if (!hasFetched) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {Array.from({ length: assetSymbols.length }).map((_, index) => (
          <PageTransition key={index}>
            <Paper
              shadow="md"
              p="md"
              radius="lg"
              className={classes.card}
              key={index}
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

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}
