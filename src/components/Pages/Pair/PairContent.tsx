// src/components/PairContent.tsx
import React from 'react';
import { Paper, Flex } from '@mantine/core';
import { AnimatedTickerDisplay } from 'components/Pages/Pair/AnimatedTickerDisplay';
import { TickerSymbol } from 'components/Pages/Pair/TickerSymbol';
import AreaChart from 'components/Pages/Pair/AreaChart';
import IntervalSelector from 'components/Pages/Pair/IntervalSelector';
import useResponsiveStyles from 'hooks/useResponsiveStyles';
import classes from 'assets/app/pair.module.css';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import useCryptoKLine from 'hooks/useCryptoKline';
import { DotMatrixWallEffect } from 'components/App/MatrixDotBackground';

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

  if (data?.length) {
    data[data.length - 1].y = priceSource;
  }

  // Centralized deltaPercent formula
  let deltaPercent = openPrice
    ? Number(((priceSource / openPrice - 1) * 100).toFixed(2))
    : 0;
  deltaPercent = deltaPercent === 0 ? Math.abs(deltaPercent) : deltaPercent;
  deltaPercent = isNaN(deltaPercent) ? 0 : deltaPercent;
  // Define colors for different conditions based on deltaPercent
  const getDeltaColor = (deltaPercent: number): [number, number, number] => {
    if (deltaPercent > 0) {
      return [22, 133, 100]; // Green for positive
    } else if (deltaPercent < 0) {
      return [192, 21, 98]; // Red for negative
    } else {
      return [128, 128, 128]; // Gray for neutral
    }
  };
  const deltaColor = getDeltaColor(deltaPercent);

  return (
    <Paper
      shadow="xl"
      radius="xl"
      style={{
        position: 'relative',
        transition: 'all 0.5s ease-in-out',
        overflow: 'hidden'
      }}
      h="100%"
      className={classes['ticker-wrapper']}
    >
      <Flex align="flex-start" direction="column">
        <DotMatrixWallEffect
          colors={[deltaColor]}
          deltaPercent={
            deltaPercent !== 0 ? Math.ceil(Math.abs(deltaPercent)) : 0
          }
        />
        <TickerSymbol tickerSymbol={cryptoName || ''} imgUrl={image} />
        <Flex>
          <AnimatedTickerDisplay
            price={priceSource ?? 0}
            priceChangePercent={deltaPercent}
            decimalPrecision={
              getNumberPrecision(priceSource ?? 0) < 2
                ? 2
                : getNumberPrecision(priceSource ?? 0)
            }
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
          deltaPercent={deltaPercent}
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
