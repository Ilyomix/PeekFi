// src/components/PairContent.tsx
import React from 'react';
import { Paper, Flex } from '@mantine/core';
import { AnimatedTickerDisplay } from 'components/Pages/Pair/AnimatedTickerDisplay';
import { TickerSymbol } from 'components/Pages/Pair/TickerSymbol';
import AreaChart from 'components/Pages/Pair/AreaChart';
import IntervalSelector from 'components/Pages/Pair/IntervalSelector';
import GradientBackground from 'components/Pages/Pair/GradientBackground';
import useResponsiveStyles from 'hooks/useResponsiveStyles';
import classes from 'assets/app/pair.module.css';
import { getNumberPrecision } from 'utils/getNumberPrecision';

interface PairContentProps {
  cryptoName: string;
  image: string;
  currentPrice: number;
  priceChangePercent24h: number;
  priceChange24h: number;
  pair: string;
  selectedInterval: string;
}

const PairContent: React.FC<PairContentProps> = ({
  cryptoName,
  image,
  currentPrice,
  priceChangePercent24h,
  priceChange24h,
  pair,
  selectedInterval
}) => {
  const responsiveStyles = useResponsiveStyles();

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
      <GradientBackground priceChangePercent24h={priceChangePercent24h} />
      <Flex align="flex-start" direction="column">
        <TickerSymbol tickerSymbol={cryptoName || ''} imgUrl={image} />
        <AnimatedTickerDisplay
          price={currentPrice}
          priceChangePercent={priceChangePercent24h}
          priceChange={priceChange24h}
          deltaFontSize={responsiveStyles.deltaFontSize.fontSize}
          deltaIconFontSize={responsiveStyles.deltaFontSize.fontSize}
          deltaAbsoluteFontSize={responsiveStyles.deltaFontSize.fontSize}
          priceFontSize={responsiveStyles.animatedTickerDisplay.fontSize}
          noAnimation={responsiveStyles.animatedTicker}
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
    </Paper>
  );
};

export default React.memo(PairContent);
