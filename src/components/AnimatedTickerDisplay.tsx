import React from 'react';
import { Text, Flex, useComputedColorScheme } from '@mantine/core';
import { AnimatedCounter } from 'react-animated-counter';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import {
  IconTriangleFilled,
  IconTriangleInvertedFilled
} from '@tabler/icons-react';
import classes from 'assets/app/pair.module.css';

const renderCounter = (
  value: string | number,
  fontSize: string,
  decimalPrecision?: number,
  color?: string,
  valueMovementColor = true,
  deltaMention = false
) => (
  <AnimatedCounter
    fontSize={fontSize}
    includeCommas
    incrementColor={
      !valueMovementColor || deltaMention
        ? color
        : 'var(--mantine-color-teal-text)'
    }
    decrementColor={
      !valueMovementColor || deltaMention ? color : 'var(--mantine-color-red-5)'
    }
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
  return Number(value) > 0 ? IconTriangleFilled : IconTriangleInvertedFilled;
};

type AnimatedTickerDisplayProps = {
  price: string | number;
  priceChange: string | number;
  priceChangePercent: string | number;
  priceFontSize?: string;
  deltaFontSize?: string;
  deltaIconFontSize?: string;
  deltaMention?: string;
  darkModeEnabled?: boolean;
};

export const AnimatedTickerDisplay: React.FC<AnimatedTickerDisplayProps> = ({
  price,
  priceChange,
  priceChangePercent,
  priceFontSize,
  deltaFontSize,
  deltaIconFontSize,
  deltaMention,
  darkModeEnabled
}) => {
  const colorClass = getColorClass(priceChange);
  const DiffIcon = getDiffIcon(priceChange);

  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });
  const isDarkTheme = computedColorScheme === 'dark';
  return (
    <Flex align="flex-start" justify="flex-start" gap={4}>
      <Text
        component="div"
        mt={priceFontSize ? 0 : -40}
        mb={priceFontSize ? 0 : 21}
        ml={priceFontSize ? 0 : 28}
        fw={priceFontSize ? 500 : 200}
        c={darkModeEnabled ? (isDarkTheme ? 'white' : 'dark') : 'white'}
        style={{ letterSpacing: priceFontSize ? '0px' : '-4px' }}
      >
        {renderCounter(
          price,
          priceFontSize || '100px',
          undefined,
          darkModeEnabled
            ? 'var(--mantine-color-dark)'
            : 'var(--mantine-color-white)'
        )}
      </Text>
      <Flex
        direction={deltaMention ? 'column' : 'row'}
        mt={deltaMention ? -4 : 0}
      >
        <Text component="div" size="sm">
          {deltaMention}
        </Text>

        <Flex mt={deltaFontSize ? 4 : 22} ml={deltaFontSize ? 0 : 14}>
          <Text
            component="div"
            c={colorClass}
            fz="md"
            mt={deltaFontSize ? -5 : 0}
            fw={500}
            className={classes.diff}
            style={{ zIndex: 3 }}
          >
            <Flex>
              {renderCounter(
                priceChangePercent,
                deltaFontSize || '28px',
                2,
                getColorClass(priceChange)
              )}
              <Text
                size={deltaFontSize || '28px'}
                c={colorClass}
                mt={deltaFontSize ? 0 : 1}
              >
                {'%'}
              </Text>
            </Flex>
            {Number(priceChange) !== 0 && (
              <DiffIcon
                style={{
                  margin: deltaIconFontSize ? '0rem 0.25rem' : '0rem 0.5rem',
                  marginTop: deltaIconFontSize ? '0.05rem' : '0.15rem'
                }}
                size={deltaIconFontSize || '24px'}
                stroke={1.5}
              />
            )}
          </Text>
          {
            <Flex
              ml={-7}
              mt={deltaFontSize ? -6 : 2}
              fw={500}
              align="flex-start"
              justify="flex-start"
            >
              <Text
                fw={500}
                mt={deltaFontSize ? 0 : 2}
                ml={8}
                size={deltaFontSize || '24px'}
                c={colorClass}
                style={{ zIndex: 3 }}
              >
                {'('}
              </Text>
              {renderCounter(
                priceChange,
                deltaFontSize || '24px',
                getNumberPrecision(price),
                getColorClass(priceChange)
              )}
              <Text
                fw={500}
                mt={deltaFontSize ? 0 : 2}
                size={deltaFontSize || '24px'}
                c={colorClass}
                style={{ zIndex: 3 }}
              >
                {')'}
              </Text>
            </Flex>
          }
        </Flex>
      </Flex>
    </Flex>
  );
};
