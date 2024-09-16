// src/pages/Pair.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useIntervalStore from 'stores/useIntervalStore';
import useCryptoInfo from 'hooks/useCryptoInfo';
import PairContent from 'components/Pages/Pair/PairContent';
import PageTransition from 'components/App/PageTransition';
import { Container } from '@mantine/core';

const Pair: React.FC = () => {
  const { pair } = useParams<{ pair: string }>();
  const coinId = pair?.toLowerCase();
  const { selectedInterval, setSelectedInterval } = useIntervalStore();

  const {
    data: cryptoInfo,
    loading: infoLoading,
    error: infoError
  } = useCryptoInfo(coinId || '');

  const {
    name: cryptoName = '',
    image: { small: image } = { small: '' },
    market_data: {
      price_change_percentage_24h: priceChangePercent24h = 0,
      total_volume: { usd: totalVolume } = { usd: 0 },
      current_price: { usd: currentPrice } = { usd: 0 }
    } = {}
  } = cryptoInfo || {};

  useEffect(() => {
    return setSelectedInterval('1D');
  }, [setSelectedInterval]);

  useEffect(() => {
    if (pair && !infoLoading) {
      document.title = `$${currentPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 16
      })} | ${cryptoName}`;
    }
    return () => {
      document.title = 'Peekfi';
    };
  }, [cryptoName, currentPrice, infoLoading, pair]);

  if (infoLoading || !cryptoInfo || infoError || !coinId) {
    return <></>;
  }

  return (
    <PageTransition>
      <PairContent
        cryptoName={cryptoName}
        image={image}
        priceSource={currentPrice}
        deltaSource={priceChangePercent24h}
        pair={pair || ''}
        coinId={coinId}
        totalVolume={totalVolume}
        selectedInterval={selectedInterval}
      />
    </PageTransition>
  );
};

export default Pair;
