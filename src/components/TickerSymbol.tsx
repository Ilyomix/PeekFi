import React from 'react';
import { Avatar, Flex, Text } from '@mantine/core';
import { getAssetsImageUrl } from 'utils/assetsIcons';
import { IconQuestionMark } from '@tabler/icons-react';

type TickerSymbolProps = {
  tickerSymbol: string;
};

export const TickerSymbol: React.FC<TickerSymbolProps> = ({ tickerSymbol }) => (
  <Flex
    justify="center"
    align="center"
    title={tickerSymbol}
    mb={21}
    ml={7}
    p={32}
    style={{ zIndex: 3 }}
  >
    {tickerSymbol && (
      <Avatar
        src={getAssetsImageUrl(
          tickerSymbol.replace(/USDT|USD|EUR|GBP|AUD|JPY|TRY/g, '')
        )}
        alt={tickerSymbol.toUpperCase() || ''}
        size="md"
        mr={14}
      >
        <IconQuestionMark />
      </Avatar>
    )}
    <Text
      component="div"
      fw={600}
      size="xl"
      c="white"
      style={{ letterSpacing: '2px' }}
    >
      {tickerSymbol}
    </Text>
  </Flex>
);
