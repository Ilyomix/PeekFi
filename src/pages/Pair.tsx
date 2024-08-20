import React, { useState } from 'react';
import { Paper, Flex } from '@mantine/core';
import PageTransition from 'components/PageTransition';
import useCryptoTicker from 'hooks/useRealTimeCryptoTicker';
import { useParams } from 'react-router-dom';
import { AnimatedTickerDisplay } from 'components/AnimatedTickerDisplay';
import { ShaderGradientWithTransition } from 'components/ShaderGradientWithTransition';
import { TickerSymbol } from 'components/TickerSymbol';
import AreaChart from 'components/AreaChart';
import IntervalSelector from 'components/IntervalSelector';
import classes from 'assets/app/pair.module.css';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';

/**
 * Returns the appropriate icon based on price change.
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
    priceChangePercent = '0',
    price = '0'
  } = tickerData || {};

  const [selectedInterval, setSelectedInterval] = useState('1d');

  const tickerDataPrice = Number(price);

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
                price={tickerDataPrice}
                priceChange={priceChange}
                priceChangePercent={priceChangePercent}
              />
              <IntervalSelector
                selectedInterval={selectedInterval}
                onIntervalChange={setSelectedInterval}
              />
              <AreaChart symbol={tickerSymbol} interval={selectedInterval} />
            </Flex>
          </>
        )}
      </Paper>
    </PageTransition>
  );
};

export default Pair;
