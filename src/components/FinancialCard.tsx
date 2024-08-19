import React, { memo, useCallback, useMemo } from 'react';
import {
  ActionIcon,
  Avatar,
  Flex,
  Group,
  Paper,
  Text,
  rem
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconArrowUp,
  IconArrowDown,
  IconStarFilled,
  IconStar,
  IconQuestionMark
} from '@tabler/icons-react';
import { AnimatedCounter } from 'react-animated-counter';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import classes from 'assets/components/financialCard/index.module.css';
import BackgroundChart from 'components/BackgroundChart';
import PageTransition from 'components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from 'stores/useFavoritesStore';
import { CoinGeckoTickerData } from 'types/coinGeckoApi';
import { getAssetsImageUrl } from 'utils/assetsIcons';

type FinancialCardProps = CoinGeckoTickerData & {
  index: number;
  vsCurrency: string;
};

const getColorClass = (value: number) => {
  if (value === 0) return 'var(--mantine-color-gray-text)';
  return value > 0
    ? 'var(--mantine-color-teal-text)'
    : 'var(--mantine-color-red-text)';
};

const getDiffIcon = (value: number) => {
  return value > 0 ? IconArrowUpRight : IconArrowDownRight;
};

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
    decrementColor={
      !valueMovementColor ? color : 'var(--mantine-color-red-text)'
    }
    value={Number(value)}
    decimalPrecision={decimalPrecision ?? getNumberPrecision(value, 2)}
    color={color}
  />
);

const FinancialCard: React.FC<FinancialCardProps> = memo(
  ({
    name,
    current_price,
    total_volume,
    price_change_24h,
    price_change_percentage_24h,
    symbol,
    high_24h,
    low_24h,
    vsCurrency,
    index
  }) => {
    const navigate = useNavigate();

    // Memoize the icon and color classes
    const DiffIcon = useMemo(
      () => getDiffIcon(price_change_percentage_24h),
      [price_change_percentage_24h]
    );
    const colorClass = useMemo(
      () => getColorClass(price_change_percentage_24h),
      [price_change_percentage_24h]
    );

    // Callback for navigation
    const handleClick = useCallback(() => {
      if (symbol) navigate(`/pair/${symbol.toUpperCase()}USDT`);
    }, [symbol, navigate]);

    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
    const isFav = isFavorite(symbol);

    const handleFavoriteClick = useCallback(() => {
      if (symbol) {
        if (isFav) {
          removeFavorite(symbol);
        } else {
          addFavorite(symbol);
        }
      }
    }, [symbol, isFav, addFavorite, removeFavorite]);

    return (
      <Paper
        shadow="md"
        p="md"
        radius="lg"
        className={classes.card}
        onClick={handleClick}
      >
        <PageTransition duration={1}>
          <>
            <BackgroundChart
              cryptoId={`${symbol as string}`}
              delta={
                price_change_percentage_24h
                  ? price_change_percentage_24h.toString()
                  : '0.00'
              }
            />
            <Flex justify="start" align="center" title={name}>
              {name && (
                <Avatar
                  src={getAssetsImageUrl(symbol.toUpperCase())}
                  alt={name || ''}
                  size="sm"
                  mr={14}
                >
                  <IconQuestionMark />
                </Avatar>
              )}
              <Flex
                gap={1}
                direction="column"
                className={classes.titleContainer}
                align="flex-start"
              >
                <Text
                  component="div"
                  size="s"
                  fw={500}
                  className={classes.title}
                  inline
                  lineClamp={1}
                >
                  {name || `Asset #${index + 1}`}
                </Text>
                <Group justify="flex-start">
                  <Text component="div" fz="xs" className={classes.volume}>
                    {total_volume ? (
                      <Group justify="start" align="center" gap={rem(3)}>
                        Volume: USD
                        {renderCounter(
                          total_volume,
                          '12px',
                          2,
                          'var(--mantine-color-dark)',
                          false
                        )}
                      </Group>
                    ) : (
                      'No data'
                    )}
                  </Text>
                </Group>
              </Flex>

              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering navigation
                  handleFavoriteClick();
                }}
                size="md"
                pos="absolute"
                p={0}
                right={10}
                top={10}
              >
                {isFav ? (
                  <IconStarFilled size={20} color="gold" />
                ) : (
                  <IconStar size={20} />
                )}
              </ActionIcon>
            </Flex>
            <Group align="flex-end" gap="xs" mt={20}>
              <Text
                component="div"
                fw={600}
                size="40px"
                lh={1}
                className={classes.price}
              >
                {current_price ? (
                  <Group gap={4} align="flex-start">
                    {renderCounter(
                      current_price,
                      '40px',
                      undefined,
                      'light-dark(var(--mantine-color-dark-8), var(--mantine-color-white))'
                    )}
                    <Text size="xs" mt={1}>
                      {vsCurrency.toUpperCase()}
                    </Text>
                  </Group>
                ) : (
                  <Group gap={4}>0.00</Group>
                )}
              </Text>
            </Group>
            <Group align="flex-start" gap={4}>
              <Text
                component="div"
                c={getColorClass(price_change_24h)}
                fz="md"
                mt={1}
                fw={500}
                className={classes.diff}
              >
                {price_change_percentage_24h ? (
                  <Flex>
                    {renderCounter(
                      price_change_percentage_24h,
                      '16px',
                      2,
                      getColorClass(price_change_percentage_24h)
                    )}
                    <Text size="md" c={colorClass} mt={0}>
                      {'%'}
                    </Text>
                  </Flex>
                ) : (
                  '0.00%'
                )}
                {Number(price_change_percentage_24h) !== 0 && (
                  <DiffIcon size="1rem" stroke={1.5} />
                )}
              </Text>

              {price_change_24h && (
                <Flex
                  ml={4}
                  mt={3}
                  fw={400}
                  align="flex-start"
                  justify="flex-start"
                >
                  <Text fw={500} size="sm" c={colorClass}>
                    {'('}
                  </Text>
                  {renderCounter(
                    price_change_24h,
                    '16px',
                    getNumberPrecision(current_price),
                    getColorClass(price_change_24h)
                  )}
                  <Text fw={500} size="sm" c={colorClass}>
                    {')'}
                  </Text>
                </Flex>
              )}
            </Group>
            <Flex
              mt={18}
              justify="space-between"
              align="center"
              className={classes.details}
            >
              <Flex>
                <IconArrowUp
                  size={18}
                  style={{ paddingRight: '2px', marginLeft: '-2px' }}
                />
                <Text component="div" mr={5} display="flex" fz="xs">
                  High:
                </Text>
                <Text component="div" mt={-2} display="flex" fz="xs">
                  {renderCounter(
                    high_24h as number,
                    '12px',
                    getNumberPrecision(high_24h as number, 2),
                    'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4)',
                    false
                  )}
                </Text>
              </Flex>
              <Flex>
                <Text component="div" display="flex" fz="xs">
                  {'Low:'}
                  <Text component="div" mt={-2} ml={4} display="flex" fz="xs">
                    {renderCounter(
                      low_24h as number,
                      '12px',
                      getNumberPrecision(low_24h as number, 2),
                      'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4)',
                      false
                    )}
                  </Text>
                </Text>
                <IconArrowDown size={16} style={{ paddingRight: '2px' }} />{' '}
              </Flex>
            </Flex>
          </>
        </PageTransition>
      </Paper>
    );
  }
);

FinancialCard.displayName = 'FinancialCard';

export default FinancialCard;
