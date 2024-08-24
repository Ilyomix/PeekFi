import React from 'react';
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

  if (infoLoading || !cryptoInfo || infoError) {
    return null;
  }

  const {
    name: cryptoName = '',
    image: { small: image } = { small: '' },
    market_data: {
      current_price: { usd: currentPrice } = { usd: 0 },
      price_change_percentage_24h: priceChange24h = 0,
      price_change_24h: priceChangePercent24h = 0
    } = {}
  } = cryptoInfo || {};

  return (
    <PageTransition>
      <Paper
        shadow="xl"
        radius="xl"
        bg={
          Number(priceChangePercent24h) !== 0
            ? Number(priceChangePercent24h) > 0
              ? 'linear-gradient(to top, #0ba360 0%, #3cba92 100%)'
              : 'linear-gradient(to top, #e53935 0%, #f77f7f 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898'
        }
        style={{
          background: 'transparent',
          position: 'relative'
        }}
        className={classes['ticker-wrapper']}
      >
        <>
          {/* {priceChange24h && (
            <ShaderGradientWithTransition
              priceChangePercent={priceChange24h.toString()}
            />
          )} */}
          <Flex align="flex-start" direction="column">
            <TickerSymbol tickerSymbol={cryptoName || ''} imgUrl={image} />
            <AnimatedTickerDisplay
              price={currentPrice}
              priceChangePercent={priceChange24h}
              priceChange={priceChangePercent24h}
            />
            <IntervalSelector />
            <AreaChart
              symbol={pair || ''}
              interval={selectedInterval}
              baseline={currentPrice - priceChange24h}
              deltaPositive={priceChange24h > 0}
              precision={getNumberPrecision(currentPrice)}
            />
          </Flex>
        </>
      </Paper>
    </PageTransition>
  );
};

export default Pair;
