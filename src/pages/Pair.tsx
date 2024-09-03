// src/pages/Pair.tsx
import React from 'react';
import PageTransition from 'components/App/PageTransition';
import { useParams } from 'react-router-dom';
import useIntervalStore from 'stores/useIntervalStore';
import useCryptoInfo from 'hooks/useCryptoInfo';
import PairContent from 'components/Pages/Pair/PairContent';

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
      price_change_percentage_24h: priceChangePercent24h = 0,
      price_change_24h: priceChange24h = 0
    } = {}
  } = cryptoInfo || {};

  return (
    <PageTransition>
      <PairContent
        cryptoName={cryptoName}
        image={image}
        currentPrice={currentPrice}
        priceChangePercent24h={priceChangePercent24h}
        priceChange24h={priceChange24h}
        pair={pair || ''}
        selectedInterval={selectedInterval}
      />
    </PageTransition>
  );
};

export default Pair;
