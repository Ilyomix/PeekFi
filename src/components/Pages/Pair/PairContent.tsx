// src/components/PairContent.tsx
import React, { useMemo } from 'react';
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

  const deltaPercent = openPrice ? (priceSource / openPrice - 1) * 100 : 0;

  // Define colors for different conditions
  const getDeltaColor = (deltaPercent: number): [number, number, number] => {
    if (deltaPercent > 0) {
      return [22, 133, 100]; // Positive (green)
    } else if (deltaPercent < 0) {
      return [192, 21, 98]; // Negative (red)
    } else {
      return [128, 128, 128]; // Neutral (gray)
    }
  };

  // Dynamically update the color based on deltaPercent
  const deltaColor = useMemo(() => getDeltaColor(deltaPercent), [deltaPercent]);
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
          deltaPercent={Math.floor(deltaPercent)}
        />
        <TickerSymbol tickerSymbol={cryptoName || ''} imgUrl={image} />
        <Flex>
          <AnimatedTickerDisplay
            price={priceSource ?? 0}
            priceChangePercent={
              selectedInterval === '1D' && deltaSource
                ? deltaSource
                : deltaPercent
            }
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
          deltaPercent={
            selectedInterval === '1D' && deltaSource
              ? deltaSource
              : deltaPercent
          }
          deltaPositive={
            selectedInterval === '1D' && deltaSource
              ? deltaSource > 0
              : deltaPercent > 0
          }
          symbol={pair || ''}
          interval={selectedInterval}
          precision={getNumberPrecision(priceSource ?? 0)}
        />
      </Flex>
    </Paper>
  );
};

export default React.memo(PairContent);
