import { Flex, Text } from '@mantine/core';
import PageTransition from 'components/PageTransition';
import useCryptoTicker from 'hooks/useRealTimeCryptoTicker';
import { AnimatedCounter } from 'react-animated-counter';
import { useParams } from 'react-router-dom';
import { getNumberPrecision } from 'utils/getNumberPrecision';
const Pair: React.FC = () => {
  const params = useParams<{ pair: string }>();
  const { pair } = params;

  const { tickerData, loading, error } = useCryptoTicker(
    pair?.toLowerCase() as string
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Destructuring with default values
  const {
    symbol: tickerSymbol = 'Unknown',
    price = 'N/A',
    priceChange = 'N/A',
    priceChangePercent = 'N/A',
    highPrice = 'N/A',
    lowPrice = 'N/A',
    openPrice = 'N/A',
    prevClosePrice = 'N/A',
    quoteVolume = 'N/A',
    volume = 'N/A',
    lastPrice = 'N/A',
    currencyPair = 'UNKNOWN'
  } = tickerData || {};

  const renderCounter = (
    value: string | number,
    fontSize: string,
    decimalPrecision?: number,
    color?: string,
    valueMovementColor = true
  ) => (
    <AnimatedCounter
      fontSize={fontSize}
      includeCommas
      incrementColor={
        !valueMovementColor ? color : 'var(--mantine-color-teal-text)'
      }
      decrementColor={
        !valueMovementColor ? color : 'var(--mantine-color-red-text)'
      }
      value={Number(value)}
      decimalPrecision={decimalPrecision ?? getNumberPrecision(value, 2)}
      color={color}
    />
  );

  return (
    <PageTransition>
      <h1>{tickerSymbol}</h1>
      <Flex align="flex-end">
        <Text component="div" mt={-14}>
          {renderCounter(
            price,
            '140px',
            undefined,
            'var(--mantine-color-dark)'
          )}
        </Text>
      </Flex>
      <p>
        Change: {priceChange} ({priceChangePercent}%)
      </p>
      <p>High: {highPrice}</p>
      <p>Low: {lowPrice}</p>
      <p>Open: {openPrice}</p>
      <p>Prev Close: {prevClosePrice}</p>
      <p>Volume: {volume}</p>
      <p>Quote Volume: {quoteVolume}</p>
      <p>Last Price: {lastPrice}</p>
      <p>Currency Pair: {currencyPair}</p>
    </PageTransition>
  );
};

export default Pair;
