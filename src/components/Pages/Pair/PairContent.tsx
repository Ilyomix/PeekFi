// src/components/PairContent.tsx
import React from 'react';
import { Paper, Flex, Text } from '@mantine/core';
import { AnimatedTickerDisplay } from 'components/Pages/Pair/AnimatedTickerDisplay';
import { TickerSymbol } from 'components/Pages/Pair/TickerSymbol';
import AreaChart from 'components/Pages/Pair/AreaChart';
import IntervalSelector from 'components/Pages/Pair/IntervalSelector';
import GradientBackground from 'components/Pages/Pair/GradientBackground';
import useResponsiveStyles from 'hooks/useResponsiveStyles';
import classes from 'assets/app/pair.module.css';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import useCryptoKLine from 'hooks/useCryptoKline';
import GlowBehindChart from './AreaChartEffects';

interface PairContentProps {
  cryptoName: string;
  image: string;
  pair: string;
  selectedInterval: string;
  priceSource: number;
  deltaSource: number;
}

const PairContent: React.FC<PairContentProps> = ({
  cryptoName,
  image,
  pair,
  selectedInterval,
  priceSource,
  deltaSource
}) => {
  const responsiveStyles = useResponsiveStyles();
  const { data, loading, openPrice } = useCryptoKLine(
    pair,
    'usd',
    selectedInterval
  );

  const deltaPercent = openPrice ? (priceSource / openPrice - 1) * 100 : 0;

  return (
    <Paper
      shadow="xl"
      radius="xl"
      style={{
        position: 'relative',
        transition: 'all 0.5s ease-in-out'
      }}
      h="100%"
      className={classes['ticker-wrapper']}
    >
      <Flex align="flex-start" direction="column">
        <TickerSymbol tickerSymbol={cryptoName || ''} imgUrl={image} />
        <Flex>
          <AnimatedTickerDisplay
            price={priceSource ?? 0}
            priceChangePercent={
              selectedInterval === '1D' ? deltaSource : deltaPercent ?? 0
            }
            decimalPrecision={getNumberPrecision(priceSource ?? 0)}
            priceChange={openPrice ?? 0}
            deltaFontSize={responsiveStyles.deltaFontSize.fontSize}
            deltaIconFontSize={responsiveStyles.deltaFontSize.fontSize}
            deltaAbsoluteFontSize={responsiveStyles.deltaFontSize.fontSize}
            priceFontSize={responsiveStyles.animatedTickerDisplay.fontSize}
            noAnimation={responsiveStyles.animatedTicker}
            interval={selectedInterval}
          />
        </Flex>
        <IntervalSelector />

        <AreaChart
          data={data}
          loading={loading}
          openPrice={openPrice ?? 0}
          deltaPercent={
            selectedInterval === '1D' ? deltaSource : deltaPercent ?? 0
          }
          deltaPositive={deltaPercent > 0}
          symbol={pair || ''}
          interval={selectedInterval}
          precision={getNumberPrecision(priceSource ?? 0)}
        />
      </Flex>
    </Paper>
  );
};

export default React.memo(PairContent);
