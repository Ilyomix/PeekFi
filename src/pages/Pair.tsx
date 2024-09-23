// src/pages/Pair.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useIntervalStore from 'stores/useIntervalStore';
import useCryptoInfo from 'hooks/useCryptoInfo';
import PairContent from 'components/Pages/Pair/PairContent';
import PageTransition from 'components/App/PageTransition';
import { Button, Center, Code, Flex, Image, Loader, Text } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import disconnect from 'assets/images/disconnect.svg';

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
      document.title = currentPrice
        ? `$${currentPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 16
          })} | ${cryptoName}`
        : `N/A | ${cryptoName}`;
    }
    return () => {
      document.title = 'Peekfi';
    };
  }, [cryptoName, currentPrice, infoLoading, pair]);

  if (infoError)
    return (
      <PageTransition duration={0.2}>
        <Center style={{ width: '100%', height: 'calc(100vh - 88px)' }}>
          <Flex direction="column" align="center" justify="center">
            <Image src={disconnect} alt="Error" maw={400} mah={400} mb="md" />
            <Text
              size="lg"
              fw={500}
              c="light-dark(var(--mantine-color-text-dark), var(--mantine-color-text-white))"
              ta="center"
              mt={28}
            >
              Oops! Something went wrong
            </Text>
            <Code c="red.6" ta="center" bg="white" mt="xs" mb="lg">
              Error message: <b>{infoError}</b>
            </Code>
            <Button
              leftSection={<IconRefresh size={18} />}
              mt={28}
              onClick={() => window.location.reload()}
              color="teal"
              radius="xl"
            >
              Refresh Page
            </Button>
          </Flex>
        </Center>
      </PageTransition>
    );

  if (infoLoading || !cryptoInfo || !coinId) {
    return (
      <Center style={{ width: '100%', height: 'calc(100vh - 88px)' }}>
        <Flex direction="column" align="center" justify="center">
          <Loader size="md" type="bars" color="dark.5" />
        </Flex>
      </Center>
    );
  }

  return (
    <PageTransition duration={0.1}>
      <PairContent
        cryptoName={cryptoName}
        image={image}
        priceSource={currentPrice}
        deltaSource={priceChangePercent24h}
        coinId={pair || ''}
        pair={pair || ''}
        totalVolume={totalVolume}
        selectedInterval={selectedInterval}
      />
    </PageTransition>
  );
};

export default Pair;
