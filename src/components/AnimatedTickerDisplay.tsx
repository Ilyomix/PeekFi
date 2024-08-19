import React from 'react';
import { Text, Flex } from '@mantine/core';
import { AnimatedCounter } from 'react-animated-counter';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import classes from 'assets/app/pair.module.css';

const renderCounter = (
  value: string | number,
  fontSize: string,
  decimalPrecision?: number,
  color?: string,
  valueMovementColor = true
) => (
  <AnimatedCounter
    fontSize={fontSize}
    includeCommas
    incrementColor={
      !valueMovementColor ? color : 'var(--mantine-color-teal-text)'
    }
    decrementColor={!valueMovementColor ? color : 'var(--mantine-color-red-5)'}
    value={Number(value)}
    decimalPrecision={decimalPrecision ?? getNumberPrecision(value, 2)}
    color={color}
  />
);

const getColorClass = (value: number | string) => {
  if (Number(value) === 0) return 'var(--mantine-color-gray-text)';
  return Number(value) > 0
    ? 'var(--mantine-color-teal-4)'
    : 'var(--mantine-color-red-4)';
};

const getDiffIcon = (value: number | string) => {
  return Number(value) > 0 ? IconArrowUpRight : IconArrowDownRight;
};

type AnimatedTickerDisplayProps = {
  price: string;
  priceChange: string;
  priceChangePercent: string;
};

export const AnimatedTickerDisplay: React.FC<AnimatedTickerDisplayProps> = ({
  price,
  priceChange,
  priceChangePercent
}) => {
  const colorClass = getColorClass(priceChange);
  const DiffIcon = getDiffIcon(priceChange);

  return (
    <Flex align="flex-start" justify="flex-start" gap={4}>
      <Text
        component="div"
        mt={-40}
        mb={21}
        ml={28}
        fw={200}
        c="white"
        style={{ letterSpacing: '-4px' }}
      >
        {renderCounter(price, '100px', undefined, 'var(--mantine-color-dark)')}
      </Text>
      <Flex mt={17} ml={14}>
        <Text
          component="div"
          c={colorClass}
          fz="md"
          mt={0}
          fw={500}
          className={classes.diff}
          style={{ zIndex: 3 }}
        >
          <Flex>
            {renderCounter(
              priceChangePercent,
              '28px',
              2,
              getColorClass(priceChange)
            )}
            <Text size="28px" c={colorClass} mt={1}>
              {'%'}
            </Text>
          </Flex>
          {Number(priceChange) !== 0 && <DiffIcon size="40px" stroke={1.5} />}
        </Text>
        {priceChange && (
          <Flex ml={-7} mt={2} fw={500} align="flex-start" justify="flex-start">
            <Text
              fw={500}
              mt={6}
              ml={8}
              size="24px"
              c={colorClass}
              style={{ zIndex: 3 }}
            >
              {'('}
            </Text>
            {renderCounter(
              priceChange,
              '24px',
              getNumberPrecision(priceChange),
              getColorClass(priceChange)
            )}
            <Text
              fw={500}
              mt={6}
              size="24px"
              c={colorClass}
              style={{ zIndex: 3 }}
            >
              {')'}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
