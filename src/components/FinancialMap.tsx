import { SimpleGrid } from '@mantine/core';
import PageTransition from './PageTransition';
import useMultipleCryptoTickers from 'hooks/useCryptoTicker';
import assetSymbols from 'utils/assetsSymbols';
import FinancialCard from './FinancialCard';

export function FinancialMap() {
  const { tickersData } = useMultipleCryptoTickers(assetSymbols);

  const stats = Object.keys(tickersData).map((symbol, index) => {
    const ticker = tickersData[symbol] || {};

    return (
      <PageTransition key={index}>
        <FinancialCard {...ticker} index={index} />
      </PageTransition>
    );
  });

  return (
    <div>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}
