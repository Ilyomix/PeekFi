import React, { useMemo } from 'react';
import { Paper, Flex } from '@mantine/core';
import PageTransition from 'components/PageTransition';
import { useParams } from 'react-router-dom';
import { AnimatedTickerDisplay } from 'components/AnimatedTickerDisplay';
import { TickerSymbol } from 'components/TickerSymbol';
import AreaChart from 'components/AreaChart';
import IntervalSelector from 'components/IntervalSelector';
import classes from 'assets/app/pair.module.css';
import useIntervalStore from 'stores/useIntervalStore';
import useCryptoInfo from 'hooks/useCryptoInfo';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { ShaderGradientWithTransition } from 'components/ShaderGradientWithTransition';

export const getDiffIcon = (value: number | string) => {
  return Number(value) > 0 ? IconArrowUpRight : IconArrowDownRight;
};

const Pair: React.FC = () => {
  const { pair } = useParams<{ pair: string }>();
  const coinId = pair?.toLowerCase();
  const { selectedInterval } = useIntervalStore();

  const {
    data: cryptoInfo,
    loading: infoLoading,
    error: infoError
  } = useCryptoInfo(coinId || '');

  const {
    name: cryptoName = '',
    image: { small: image } = { small: '' },
    market_data: {
      current_price: { usd: currentPrice } = { usd: 0 },
      price_change_percentage_24h: priceChangePercent24h = 0,
      price_change_24h: priceChange24h = 0
    } = {}
  } = cryptoInfo || {};

  // Determine the current sign of priceChangePercent24h
  const currentSign = useMemo(() => {
    if (priceChangePercent24h > 0) return 'positive';
    if (priceChangePercent24h < 0) return 'negative';
    return 'neutral';
  }, [priceChangePercent24h]);

  const GradientBackground = useMemo(() => {
    // Re-render gradient only if the sign changes
    return (
      <ShaderGradientWithTransition
        delta={currentSign}
        value={priceChangePercent24h}
      />
    );
  }, [currentSign]);

  if (infoLoading || !cryptoInfo || infoError) {
    return null;
  }

  return (
    <PageTransition>
      <Paper
        shadow="xl"
        radius="xl"
        style={{
          position: 'relative',
          transition: 'all 0.5s ease-in-out'
        }}
        className={classes['ticker-wrapper']}
      >
        <>
          {GradientBackground}
          <Flex align="flex-start" direction="column">
            <TickerSymbol tickerSymbol={cryptoName || ''} imgUrl={image} />
            <AnimatedTickerDisplay
              price={currentPrice}
              priceChangePercent={priceChangePercent24h}
              priceChange={priceChange24h}
            />
            <IntervalSelector />
            <AreaChart
              symbol={pair || ''}
              interval={selectedInterval}
              baseline={currentPrice - priceChange24h}
              deltaPositive={priceChange24h > 0}
              priceChangePercent24h={priceChangePercent24h}
              precision={getNumberPrecision(currentPrice)}
            />
          </Flex>
        </>
      </Paper>
    </PageTransition>
  );
};

export default Pair;
