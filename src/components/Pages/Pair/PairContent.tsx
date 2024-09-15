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
import { DotMatrixWallEffect } from 'components/App/MatrixDotBackground/DotMatrixWallEffect';

interface PairContentProps {
  cryptoName: string;
  image: string;
  pair: string;
  selectedInterval: string;
  priceSource: number;
  deltaSource: number;
}

const PairContent: React.FC<PairContentProps> = React.memo(
  ({ cryptoName, image, pair, selectedInterval, priceSource }) => {
    const responsiveStyles = useResponsiveStyles();
    const { data, loading, openPrice } = useCryptoKLine(
      pair,
      'usd',
      selectedInterval
    );

    const processedData = useMemo(() => {
      if (data?.length) {
        const newData = [...data];
        newData[newData.length - 1].y = priceSource;
        return newData;
      }
      return data;
    }, [data, priceSource]);

    const deltaPercent = useMemo(() => {
      if (openPrice && priceSource) {
        const delta = (priceSource / openPrice - 1) * 100;
        return Number(delta.toFixed(2));
      }
      return 0;
    }, [openPrice, priceSource]);

    const deltaColor = useMemo(() => {
      if (deltaPercent > 0) {
        return [31, 196, 147];
      } else if (deltaPercent < 0) {
        return [255, 71, 71];
      } else {
        return [128, 128, 128];
      }
    }, [deltaPercent]);

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
            data={processedData}
            loading={loading}
            openPrice={openPrice ?? 0}
            activeDotColor={
              deltaPercent !== 0
                ? deltaPercent > 0
                  ? 'rgb(31, 196, 147)'
                  : 'rgb(255, 71, 71)'
                : 'rgb(128, 128, 128)'
            }
            currentPrice={priceSource ?? 0}
            deltaPercent={deltaPercent}
            deltaPositive={deltaPercent > 0}
            symbol={pair || ''}
            interval={selectedInterval}
            precision={getNumberPrecision(priceSource ?? 0)}
          />
        </Flex>
      </Paper>
    );
  }
);

PairContent.displayName = 'PairContent';

export default PairContent;
