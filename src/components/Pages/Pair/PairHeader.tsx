import React from 'react';
import {
  Group,
  Avatar,
  Flex,
  Title,
  Badge,
  Text,
  Skeleton
} from '@mantine/core';
import useCryptoCoinData from 'hooks/useCryptoCoinData';

interface PairHeaderProps {
  coinId: string;
  vsCurrency?: string;
}

const PairHeader: React.FC<PairHeaderProps> = React.memo(
  ({ coinId, vsCurrency = 'usd' }) => {
    const { coinData, loading, error } = useCryptoCoinData(coinId, vsCurrency);

    if (error) {
      return (
        <Text c="red" ta="center">
          {error}
        </Text>
      );
    } else if (coinData === null && !loading) {
      return <></>;
    }

    const { name, symbol, image, market_cap_rank } = coinData || {
      name: '',
      symbol: '',
      image: { large: '' },
      market_cap_rank: 0
    };

    return (
      <Flex direction="column" gap="md" w="100%" p={28} mb={28}>
        <Group p="apart" gap="sm" justify="space-between" style={{ zIndex: 8 }}>
          <Group gap="sm">
            <Skeleton
              visible={loading}
              style={{ width: 64, height: 64 }}
              radius="xl"
            >
              <Avatar src={image?.large} alt={name} size={64} radius="xl" />
            </Skeleton>
            <Flex direction="column" gap={0}>
              <Skeleton visible={loading} miw={200}>
                <Title order={2} c="white">
                  {name} ({symbol.toUpperCase()})
                </Title>
              </Skeleton>
              <Group gap={4}>
                <Skeleton
                  visible={loading}
                  mt={4}
                  height={20}
                  maw={120}
                  radius="xl"
                >
                  <Badge
                    color="rgba(134, 142, 150, 0.3)"
                    variant="filled"
                    size="md"
                  >
                    Rank #{market_cap_rank}
                  </Badge>
                </Skeleton>
              </Group>
            </Flex>
          </Group>
        </Group>
      </Flex>
    );
  }
);

PairHeader.displayName = 'PairHeader';
export default PairHeader;
