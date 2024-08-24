import React, { useMemo } from 'react';
import { Text, Flex, useComputedColorScheme } from '@mantine/core';
import { AnimatedCounter } from 'react-animated-counter';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import classes from 'assets/app/pair.module.css';

// Constants for commonly used values
const DEFAULT_PRICE_FONT_SIZE = '100px';
const DEFAULT_DELTA_FONT_SIZE = '28px';
const DEFAULT_DELTA_ABSOLUTE_FONT_SIZE = '24px';
const DEFAULT_DELTA_ICON_FONT_SIZE = '34px';

// Initial conditions (magic numbers replaced with descriptive constants)
const TEXT_DEFAULTS = {
  marginTop: -37,
  marginBottom: 21,
  marginLeft: 28,
  fontWeight: 200,
  letterSpacing: '-4px'
};

const TEXT_SMALLS = {
  marginTop: -10,
  marginBottom: -14,
  marginLeft: 0,
  fontWeight: 500,
  letterSpacing: '0px'
};

const FLEX_DEFAULTS = {
  marginTop: 22,
  marginLeft: 14
};

const FLEX_SMALLS = {
  marginTop: -2,
  marginLeft: 0
};

const DIFF_ICON_DEFAULTS = {
  margin: '0rem 0.25rem 0 0',
  marginTop: '0rem',
  transform: 'translateY(1px)'
};

const DIFF_ICON_SMALLS = {
  margin: '0rem 0.125rem 0 0',
  marginTop: '0rem',
  transform: 'translateY(0rem)'
};

const INNER_FLEX = {
  marginLeft: -7,
  marginTop: 2
};

const INNER_TEXT = {
  marginTop: 2,
  marginLeft: 8
};

const TEXT_Z_INDEX = 3;

const FLEX_GAP = 4;

const COLORS = {
  tealText: 'var(--mantine-color-teal-text)',
  redText: 'var(--mantine-color-red-5)',
  dark: 'var(--mantine-color-dark)',
  white: 'var(--mantine-color-white)'
};

const renderCounter = (
  value: string | number,
  fontSize: string,
  decimalPrecision?: number,
  color?: string,
  valueMovementColor = true,
  deltaMention = false,
  noAnimation = false,
  fontWeight?: number,
  narrowed = false
) => {
  const counterProps = {
    fontSize,
    includeCommas: true,
    value: Number(value),
    decimalPrecision: decimalPrecision ?? getNumberPrecision(value, 2),
    color,
    fontWeight
  };
  return noAnimation ? (
    <Text
      fw={fontWeight || 300}
      style={{
        fontSize: counterProps.fontSize,
        color: counterProps.color,
        letterSpacing: noAnimation && narrowed ? '-3px' : '0px'
      }}
    >
      {counterProps.value.toLocaleString('en', {
        minimumFractionDigits: counterProps.decimalPrecision,
        maximumFractionDigits: counterProps.decimalPrecision
      })}
    </Text>
  ) : (
    <AnimatedCounter
      {...counterProps}
      incrementColor={
        !valueMovementColor || deltaMention ? color : COLORS.tealText
      }
      decrementColor={
        !valueMovementColor || deltaMention ? color : COLORS.redText
      }
    />
  );
};

const getColorClass = (value: number | string) => {
  const numericValue = Number(value);
  if (numericValue === 0) return 'var(--mantine-color-gray-text)';
  return numericValue > 0
    ? 'var(--mantine-color-teal-2)'
    : 'var(--mantine-color-red-2)';
};

const getDiffIcon = (value: number | string) => {
  return Number(value) > 0 ? IconArrowUpRight : IconArrowDownRight;
};

type AnimatedTickerDisplayProps = {
  price: string | number;
  priceChange: string | number;
  priceChangePercent: string | number;
  priceFontSize?: string;
  deltaFontSize?: string;
  deltaAbsoluteFontSize?: string;
  deltaIconFontSize?: string;
  deltaMention?: string;
  darkModeEnabled?: boolean;
  noAnimation?: boolean;
};

export const AnimatedTickerDisplay: React.FC<AnimatedTickerDisplayProps> =
  React.memo(
    ({
      price,
      priceChange,
      priceChangePercent,
      priceFontSize = DEFAULT_PRICE_FONT_SIZE,
      deltaFontSize = DEFAULT_DELTA_FONT_SIZE,
      deltaIconFontSize = DEFAULT_DELTA_ICON_FONT_SIZE,
      deltaAbsoluteFontSize = DEFAULT_DELTA_ABSOLUTE_FONT_SIZE,
      deltaMention,
      darkModeEnabled = false,
      noAnimation = false
    }) => {
      const colorClass = useMemo(
        () => getColorClass(priceChange),
        [priceChange]
      );
      const DiffIcon = useMemo(() => getDiffIcon(priceChange), [priceChange]);

      const computedColorScheme = useComputedColorScheme('light', {
        getInitialValueInEffect: true
      });
      const isDarkTheme = computedColorScheme === 'dark';
      const textColor = darkModeEnabled
        ? isDarkTheme
          ? COLORS.white
          : COLORS.dark
        : COLORS.white;

      const {
        marginTop: textMarginTop,
        marginBottom: textMarginBottom,
        marginLeft: textMarginLeft,
        fontWeight: textFontWeight,
        letterSpacing
      } = priceFontSize === DEFAULT_PRICE_FONT_SIZE
        ? TEXT_DEFAULTS
        : TEXT_SMALLS;

      const { marginTop: flexMarginTop, marginLeft: flexMarginLeft } =
        deltaFontSize === DEFAULT_DELTA_FONT_SIZE ? FLEX_DEFAULTS : FLEX_SMALLS;

      const {
        margin: diffIconMargin,
        marginTop: diffIconMarginTop,
        transform: diffIconTransform
      } = deltaIconFontSize === DEFAULT_DELTA_ICON_FONT_SIZE
        ? DIFF_ICON_DEFAULTS
        : DIFF_ICON_SMALLS;

      return (
        <Flex align="flex-start" justify="flex-start" gap={FLEX_GAP}>
          <Text
            component="div"
            mt={textMarginTop}
            mb={textMarginBottom}
            ml={textMarginLeft}
            mr={noAnimation ? 6 : 0}
            fw={textFontWeight}
            c={textColor}
            style={{ letterSpacing }}
          >
            {renderCounter(
              price,
              priceFontSize,
              undefined,
              textColor,
              true,
              false,
              noAnimation,
              undefined,
              true
            )}
          </Text>
          <Flex direction={deltaMention ? 'column' : 'row'}>
            {deltaMention && (
              <Text component="div" size="sm">
                {deltaMention}
              </Text>
            )}
            <Flex
              mt={flexMarginTop}
              ml={flexMarginLeft}
              justify="start"
              align="center"
            >
              <Text
                component="div"
                c={colorClass}
                fz="md"
                fw={500}
                className={classes.diff}
                style={{ zIndex: TEXT_Z_INDEX }}
              >
                <Flex>
                  {renderCounter(
                    priceChangePercent,
                    deltaFontSize,
                    2,
                    colorClass,
                    true,
                    false,
                    noAnimation,
                    400
                  )}
                  <Text
                    size={deltaFontSize}
                    c={colorClass}
                    mt={noAnimation ? 4 : 0}
                    fw={noAnimation ? 400 : 500}
                  >
                    {'%'}
                  </Text>
                </Flex>
                {
                  <DiffIcon
                    style={{
                      margin: diffIconMargin,
                      marginTop: diffIconMarginTop,
                      transform: diffIconTransform,
                      opacity: Number(priceChangePercent) !== 0 ? '1' : '0'
                    }}
                    size={deltaIconFontSize}
                    stroke={1.5}
                  />
                }
              </Text>
              <Flex
                ml={INNER_FLEX.marginLeft}
                mt={1}
                fw={noAnimation ? 400 : 500}
                align="flex-start"
                justify="flex-start"
                style={{
                  transition: 'opacity 0.1s ease',
                  opacity: Number(priceChange) !== 0 ? '1' : '0'
                }}
              >
                <Text
                  fw={noAnimation ? 400 : 500}
                  mt={noAnimation ? 3 : -2}
                  ml={INNER_TEXT.marginLeft}
                  size={deltaAbsoluteFontSize}
                  c={colorClass}
                  style={{ zIndex: TEXT_Z_INDEX }}
                >
                  {'('}
                </Text>
                {renderCounter(
                  priceChange,
                  deltaAbsoluteFontSize,
                  getNumberPrecision(price),
                  colorClass,
                  true,
                  false,
                  noAnimation,
                  400
                )}
                <Text
                  fw={noAnimation ? 400 : 500}
                  mt={noAnimation ? 3 : -2}
                  size={deltaAbsoluteFontSize}
                  c={colorClass}
                  style={{ zIndex: TEXT_Z_INDEX }}
                >
                  {')'}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      );
    }
  );

AnimatedTickerDisplay.displayName = 'AnimatedTickerDisplay';
