// src/pages/Pair.tsx
import React, { useEffect } from 'react';
import PageTransition from 'components/App/PageTransition';
import { useParams } from 'react-router-dom';
import useIntervalStore from 'stores/useIntervalStore';
import useCryptoInfo from 'hooks/useCryptoInfo';
import PairContent from 'components/Pages/Pair/PairContent';

const Pair: React.FC = () => {
  const { pair } = useParams<{ pair: string }>();
  const coinId = pair?.toLowerCase();
  const { selectedInterval, setSelectedInterval } = useIntervalStore();

  const {
    data: cryptoInfo,
    loading: infoLoading,
    error: infoError
  } = useCryptoInfo(coinId || '');

  useEffect(() => {
    return setSelectedInterval('1D');
  }, [setSelectedInterval]);

  if (infoLoading || !cryptoInfo || infoError || !coinId) {
    return null;
  }

  const {
    name: cryptoName = '',
    image: { small: image } = { small: '' },
    market_data: {
      price_change_percentage_24h: priceChangePercent24h = 0,
      current_price: { usd: currentPrice } = { usd: 0 }
    } = {}
  } = cryptoInfo || {};

  return (
    <PageTransition>
      <PairContent
        cryptoName={cryptoName}
        image={image}
        priceSource={currentPrice}
        deltaSource={priceChangePercent24h}
        pair={pair || ''}
        coinId={coinId}
        selectedInterval={selectedInterval}
      />
    </PageTransition>
  );
};

export default Pair;
