import React from 'react';
import { Group, Avatar, Flex, Title, Badge, Text } from '@mantine/core';
import useCryptoCoinData from 'hooks/useCryptoCoinData';

interface PairHeaderProps {
  coinId: string;
  vsCurrency?: string;
}

const PairHeader: React.FC<PairHeaderProps> = React.memo(
  ({ coinId, vsCurrency = 'usd' }) => {
    const { coinData, loading, error } = useCryptoCoinData(coinId, vsCurrency);

    if (loading) {
      return <></>;
    }

    if (error || !coinData) {
      return (
        <Text c="red" ta="center">
          {error}
        </Text>
      );
    }

    const { name, symbol, image, market_cap_rank } = coinData;

    return (
      <Flex direction="column" gap="md" w="100%" p={28} mb={28}>
        <Group p="apart" gap="sm" justify="space-between" style={{ zIndex: 8 }}>
          <Group gap="sm">
            <Avatar src={image.large} alt={name} size={48} radius="xl" />
            <Flex direction="column" gap={0}>
              <Title order={3}>
                {name} ({symbol.toUpperCase()})
              </Title>
              <Group gap={4}>
                <Badge
                  color="rgba(134, 142, 150, 0.3)"
                  variant="filled"
                  size="md"
                >
                  Rank #{market_cap_rank}
                </Badge>
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
