import { Paper, Flex } from '@mantine/core';
import PageTransition from 'components/PageTransition';
import useCryptoTicker from 'hooks/useRealTimeCryptoTicker';
import { useParams } from 'react-router-dom';
import { AnimatedTickerDisplay } from 'components/AnimatedTickerDisplay';
import { ShaderGradientWithTransition } from 'components/ShaderGradientWithTransition';
import { TickerSymbol } from 'components/TickerSymbol';
import { LoadingErrorDisplay } from 'components/LoadingErrorDisplay';
import AreaChart from 'components/AreaChart';
import classes from 'assets/app/pair.module.css';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';

/**
 * Retourne l'icône appropriée en fonction de la variation du prix.
 */
export const getDiffIcon = (value: number | string) => {
  return Number(value) > 0 ? IconArrowUpRight : IconArrowDownRight;
};

const Pair: React.FC = () => {
  const { pair } = useParams<{ pair: string }>();

  const { tickerData, loading, error } = useCryptoTicker(
    pair?.toLowerCase() || ''
  );

  const {
    symbol: tickerSymbol = 'Unknown',
    priceChange = '0',
    openPrice = '0',
    priceChangePercent = '0',
    price = '0'
  } = tickerData || {};

  return (
    <PageTransition>
      <Paper
        shadow="xl"
        radius="xl"
        bg="dark"
        style={{
          background: 'transparent',
          position: 'relative'
        }}
        className={classes['ticker-wrapper']}
      >
        {/* <LoadingErrorDisplay loading={loading} error={error} /> */}
        {!loading && !error && (
          <>
            {priceChangePercent && (
              <ShaderGradientWithTransition
                priceChangePercent={priceChangePercent}
              />
            )}
            <Flex align="flex-start" direction="column">
              <TickerSymbol tickerSymbol={tickerSymbol} />
              <AnimatedTickerDisplay
                price={price}
                priceChange={priceChange}
                priceChangePercent={priceChangePercent}
              />
              <AreaChart
                symbol={tickerSymbol}
                interval={'1s'}
                openPrice={openPrice}
              />
            </Flex>
          </>
        )}
      </Paper>
    </PageTransition>
  );
};

export default Pair;
