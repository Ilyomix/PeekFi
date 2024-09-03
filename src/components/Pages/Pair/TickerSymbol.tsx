import React from 'react';
import { Avatar, Flex, Text } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons-react';

type TickerSymbolProps = {
  tickerSymbol: string;
  imgUrl: string;
  style?: React.CSSProperties;
};

export const TickerSymbol: React.FC<TickerSymbolProps> = ({
  tickerSymbol,
  imgUrl = '',
  style
}) => (
  <Flex
    justify="center"
    align="center"
    title={tickerSymbol}
    mb={21}
    ml={7}
    p={32}
    style={{ zIndex: 3, ...style }}
  >
    {tickerSymbol && (
      <Avatar
        src={imgUrl}
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
