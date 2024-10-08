import React, { useMemo } from 'react';
import { Text, Flex, useComputedColorScheme } from '@mantine/core';
import { AnimatedCounter } from 'components/Pages/Pair/AnimatedCounter';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import classes from 'assets/app/pair.module.css';

// Constants for commonly used values
const DEFAULT_PRICE_FONT_SIZE = '100px';
const DEFAULT_DELTA_FONT_SIZE = '28px';
const DEFAULT_DELTA_ICON_FONT_SIZE = '34px';

// Initial conditions (magic numbers replaced with descriptive constants)
const TEXT_DEFAULTS = {
  marginTop: -37,
  marginBottom: 21,
  marginLeft: 28,
  fontWeight: 300,
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
  marginTop: -0.5,
  marginLeft: 7
};

const DIFF_ICON_DEFAULTS = {
  margin: '0rem 0.25rem 0 0',
  marginTop: '0.35rem',
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

const TEXT_Z_INDEX = 3;

const FLEX_GAP = 4;

const COLORS = {
  tealText: 'var(--mantine-color-teal-5)',
  redText: 'var(--mantine-color-red-5)',
  dark: 'var(--mantine-color-dark)',
  white: 'var(--mantine-color-white)'
};

const renderCounter = (
  value: string | number,
  fontSize: string,
  decimalPrecision?: number,
  color?: string,
  tooltipMode = false,
  noAnimation = false,
  fontWeight?: number,
  narrowed = false,
  valueMovementColor = true
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
      fw={fontWeight || 400}
      style={{
        fontSize: counterProps.fontSize,
        color: counterProps.color,
        letterSpacing: noAnimation && narrowed ? '-3px' : '0px'
      }}
    >
      {counterProps.value.toLocaleString(undefined, {
        minimumFractionDigits: counterProps.decimalPrecision,
        maximumFractionDigits: counterProps.decimalPrecision
      })}
    </Text>
  ) : (
    <AnimatedCounter
      {...counterProps}
      digitStyles={{ fontWeight: fontWeight || 400, fontSize: fontSize }}
      incrementColor={
        !valueMovementColor || tooltipMode ? color : COLORS.tealText
      }
      decrementColor={
        !valueMovementColor || tooltipMode ? color : COLORS.redText
      }
    />
  );
};

const getColorClass = (value: number | string) => {
  const numericValue = Number(value);
  if (numericValue === 0) return 'var(--mantine-color-gray-text)';
  return numericValue > 0
    ? 'var(--mantine-color-teal-5)'
    : 'var(--mantine-color-red-5)';
};

const getColorClassTooltip = (value: number | string) => {
  const numericValue = Number(value);
  if (numericValue === 0) return 'var(--mantine-color-gray-text)';
  return numericValue > 0
    ? 'var(--mantine-color-teal-5)'
    : 'var(--mantine-color-red-6)';
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
  decimalPrecision?: number;
  noAnimation?: boolean;
  tooltipMode?: boolean;
  interval?: string;
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
      deltaMention,
      decimalPrecision = 2,
      darkModeEnabled = false,
      noAnimation = false,
      tooltipMode = false,
      interval
    }) => {
      const colorClass = useMemo(
        () => getColorClass(priceChangePercent),
        [priceChangePercent]
      );

      const colorClassTooltip = useMemo(
        () => getColorClassTooltip(priceChangePercent),
        [priceChangePercent]
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

      const { marginTop: diffIconMarginTop, transform: diffIconTransform } =
        deltaIconFontSize === DEFAULT_DELTA_ICON_FONT_SIZE
          ? DIFF_ICON_DEFAULTS
          : DIFF_ICON_SMALLS;
      return (
        <Flex
          align={tooltipMode ? 'baseline' : 'flex-start'}
          justify="flex-start"
          gap={FLEX_GAP}
          direction={{ xl: 'row', base: 'column' }}
          style={{ zIndex: TEXT_Z_INDEX }}
        >
          <Text
            component="div"
            mt={{
              base: !tooltipMode ? -50 : textMarginTop,
              xs: !tooltipMode ? -60 : textMarginTop,
              md: !tooltipMode ? -60 : textMarginTop,
              xl: textMarginTop
            }}
            mb={textMarginBottom}
            ml={{
              base: !tooltipMode ? 30 : textMarginLeft,
              xs: !tooltipMode ? 30 : textMarginLeft,
              md: !tooltipMode ? 24 : textMarginLeft,
              xl: textMarginLeft
            }}
            mr={noAnimation ? 6 : 0}
            fw={textFontWeight}
            c={textColor}
            style={{ letterSpacing }}
          >
            {renderCounter(
              price,
              priceFontSize,
              decimalPrecision,
              textColor,
              tooltipMode,
              noAnimation,
              undefined,
              true
            )}
          </Text>
          <Flex>
            {deltaMention && (
              <Text component="div" size="sm" mr={6}>
                {deltaMention}
              </Text>
            )}
            <Flex
              ml={INNER_FLEX.marginLeft}
              mt={0}
              fw={noAnimation ? 400 : 500}
              align="flex-start"
              justify="flex-start"
              style={{
                transition: 'opacity 0.1s ease'
              }}
            >
              <Flex
                ml={{
                  base: !tooltipMode ? 39 : flexMarginLeft,
                  xs: !tooltipMode ? 38 : flexMarginLeft,
                  md: !tooltipMode ? 36 : flexMarginLeft,
                  xl: tooltipMode ? flexMarginLeft : 14
                }}
                mb={{
                  base: !tooltipMode ? 30 : 0,
                  xs: !tooltipMode ? 30 : 0,
                  md: !tooltipMode ? 24 : 0,
                  xl: 0
                }}
                mt={{
                  base: flexMarginTop,
                  xl: !tooltipMode ? 18 : flexMarginTop
                }}
                justify="start"
                align="center"
              >
                <Text
                  component="div"
                  c={tooltipMode ? colorClassTooltip : colorClass}
                  fz="md"
                  fw={500}
                  className={classes.diff}
                  mt={tooltipMode ? 4 : 0}
                  style={{ zIndex: TEXT_Z_INDEX }}
                >
                  <Flex align="center">
                    {renderCounter(
                      priceChangePercent,
                      deltaFontSize,
                      2,
                      tooltipMode ? colorClassTooltip : colorClass,
                      tooltipMode,
                      noAnimation,
                      500,
                      false
                    )}
                    <Text
                      size={deltaFontSize}
                      c={tooltipMode ? colorClassTooltip : colorClass}
                      fw={tooltipMode ? 400 : 500}
                    >
                      {'%'}
                    </Text>
                  </Flex>
                  {
                    <DiffIcon
                      style={{
                        marginRight: '-4px',
                        marginTop: diffIconMarginTop,
                        transform: diffIconTransform,
                        display:
                          Number(priceChangePercent) !== 0 ? 'block' : 'none',
                        opacity: Number(priceChangePercent) !== 0 ? '1' : '0'
                      }}
                      size={deltaIconFontSize}
                      stroke={1.5}
                    />
                  }
                </Text>
                {interval ? (
                  <Flex align="flex-start">
                    <Text
                      style={{
                        fontSize: `calc(${deltaFontSize} - 10px)`,
                        marginTop: '5px',
                        marginLeft: priceChangePercent ? '4px' : '5px'
                      }}
                      c={tooltipMode ? colorClassTooltip : colorClass}
                    >{`(${interval})`}</Text>
                  </Flex>
                ) : (
                  ''
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      );
    }
  );

AnimatedTickerDisplay.displayName = 'AnimatedTickerDisplay';
