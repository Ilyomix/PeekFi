import React, { useState, useEffect } from 'react';
import { Text, Flex, useMantineTheme } from '@mantine/core';

interface PriceCellProps {
  value: number;
  previousValue: number;
  currencySymbol: string;
}

const PriceCell: React.FC<PriceCellProps> = ({
  value,
  previousValue,
  currencySymbol
}) => {
  const theme = useMantineTheme();
  const [flashColor, setFlashColor] = useState<string>('');

  useEffect(() => {
    if (value > previousValue && previousValue !== 0) {
      setFlashColor(theme.colors.teal[6]);
    } else if (value < previousValue) {
      setFlashColor(theme.colors.red[6]);
    }

    const timer = setTimeout(() => {
      setFlashColor('');
    }, 1000); // Animation duration

    return () => clearTimeout(timer);
  }, [value, previousValue, theme.colors.teal, theme.colors.red]);

  return (
    <Flex
      style={{
        color: flashColor,
        transition: 'color 1000ms'
      }}
    >
      <Text lineClamp={1} truncate="end">{` ${currencySymbol}${Number(
        value
      ).toLocaleString(undefined, { maximumFractionDigits: 16 })}`}</Text>
    </Flex>
  );
};

export default PriceCell;
