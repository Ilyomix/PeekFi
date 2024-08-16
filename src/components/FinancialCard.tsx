import React, { memo, useCallback, useMemo } from 'react';
import { Avatar, Flex, Group, Paper, Text, rem } from '@mantine/core';
import {
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
  IconBug,
  IconArrowUp,
  IconArrowDown,
  IconMoonFilled,
  IconSunFilled
} from '@tabler/icons-react';
import { AnimatedCounter } from 'react-animated-counter';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import classes from 'assets/components/financialCard/index.module.css';
import BackgroundChart from './BackgroundChart';
import { getAssetsImageUrl } from 'utils/assetsIcons';
import PageTransition from './PageTransition';
import { useNavigate } from 'react-router-dom';

type FinancialCardProps = {
  name: string | null;
  price: string | null;
  quoteVolume: string | null;
  priceChange: string | null;
  priceChangePercent: string | null;
  error: string | null;
  currencyPair: string | null;
  timestamp: Date | null;
  loading: boolean;
  symbol: string | null;
  index: number;
  lowPrice: string | null;
  openPrice: string | null;
  prevClosePrice: string | null;
  highPrice: string | null;
};

const icons = {
  coin: IconCoin,
  bug: IconBug
};

const getColorClass = (value: string | null) => {
  const parsedValue = parseFloat(value as string);
  if (parsedValue === 0 || !value) return 'var(--mantine-color-gray-text)';
  return parsedValue > 0
    ? 'var(--mantine-color-teal-text)'
    : 'var(--mantine-color-red-text)';
};

const getDiffIcon = (value: string | null) => {
  return parseFloat(value as string) > 0
    ? IconArrowUpRight
    : IconArrowDownRight;
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
      !valueMovementColor ? color : 'var(--mantine-color-red-text)'
    }
    decrementColor={
      !valueMovementColor ? color : 'var(--mantine-color-teal-text)'
    }
    value={Number(value)}
    decimalPrecision={decimalPrecision ?? getNumberPrecision(value, 2)}
    color={color}
  />
);

const FinancialCard: React.FC<FinancialCardProps> = memo(
  ({
    name = '---',
    price = '0.00',
    quoteVolume = '0.00',
    priceChange = '(0.00)',
    priceChangePercent = '0.00',
    error,
    symbol,
    currencyPair = '',
    loading,
    lowPrice,
    openPrice,
    prevClosePrice,
    highPrice,
    index
  }) => {
    const navigate = useNavigate();

    // Memoize the icon and color classes
    const Icon = useMemo(() => icons[error ? 'bug' : 'coin'], [error]);
    const DiffIcon = useMemo(
      () => getDiffIcon(priceChangePercent),
      [priceChangePercent]
    );
    const colorClass = useMemo(() => getColorClass(priceChange), [priceChange]);

    // Callback for navigation
    const handleClick = useCallback(() => {
      if (symbol) navigate(`/pair/${symbol}`);
    }, [symbol, navigate]);

    if (loading) return <p>Loading ...</p>;

    return (
      <Paper
        shadow="md"
        p="md"
        radius="lg"
        className={classes.card}
        onClick={handleClick}
      >
        <PageTransition duration={1}>
          {error ? (
            <Group justify="space-between">
              <Icon
                color="#ff8787"
                className={classes.icon}
                size="1.4rem"
                stroke={1.5}
              />
              <Text size="md" c="red" className={classes.title}>
                Cannot fetch data for the moment
              </Text>
            </Group>
          ) : (
            <>
              <BackgroundChart
                cryptoId={symbol as string}
                delta={priceChangePercent}
              />
              <Group justify="space-between" align="center">
                <Text size="s" fw={500} className={classes.title}>
                  {name || `Asset #${index + 1}`}
                </Text>
                {name && (
                  <Avatar
                    src={getAssetsImageUrl(name)}
                    alt={name || ''}
                    size="sm"
                  />
                )}
              </Group>

              <Group justify="flex-start">
                <Text component="div" fz="xs" className={classes.volume}>
                  {quoteVolume ? (
                    <Group justify="start" align="center" gap={rem(3)}>
                      Volume: {currencyPair}
                      {renderCounter(
                        quoteVolume,
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

              <Group align="flex-end" gap="xs" mt={20}>
                <Text
                  component="div"
                  fw={600}
                  size="40px"
                  lh={1}
                  className={classes.price}
                >
                  {price ? (
                    <Group gap={4} align="flex-start">
                      {renderCounter(
                        price,
                        '40px',
                        undefined,
                        'light-dark(var(--mantine-color-dark-8), var(--mantine-color-white))'
                      )}
                      <Text size="xs" mt={1}>
                        {currencyPair}
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
                  c={getColorClass(priceChange)}
                  fz="md"
                  mt={1}
                  fw={500}
                  className={classes.diff}
                >
                  {priceChangePercent ? (
                    <Flex>
                      {renderCounter(
                        priceChangePercent,
                        '16px',
                        2,
                        getColorClass(priceChangePercent)
                      )}
                      <Text size="md" c={colorClass} mt={1}>
                        {'%'}
                      </Text>
                    </Flex>
                  ) : (
                    '0.00%'
                  )}
                  {Number(priceChangePercent) !== 0 && (
                    <DiffIcon size="1rem" stroke={1.5} />
                  )}
                </Text>

                {priceChange && (
                  <Flex
                    ml={4}
                    mt={4}
                    fw={500}
                    align="flex-start"
                    justify="flex-start"
                  >
                    <Text fw={500} size="sm" c={colorClass}>
                      {'('}
                    </Text>
                    {renderCounter(
                      priceChange,
                      '14px',
                      getNumberPrecision(priceChange),
                      getColorClass(priceChange)
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
                  <IconSunFilled
                    size={18}
                    style={{ paddingRight: '2px', marginLeft: '-2px' }}
                  />
                  <Text component="div" mr={5} display="flex" fz="xs">
                    Open:
                  </Text>
                  <Text component="div" mt={0} display="flex" fz="xs">
                    {renderCounter(
                      openPrice as string,
                      '12px',
                      getNumberPrecision(openPrice as string, 2),
                      'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4)',
                      false
                    )}
                  </Text>
                </Flex>
                <Flex>
                  <Text component="div" display="flex" fz="xs">
                    {'High:'}
                    <Text component="div" mt={0} ml={4} display="flex" fz="xs">
                      {renderCounter(
                        highPrice as string,
                        '12px',
                        getNumberPrecision(highPrice as string, 2),
                        'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4)',
                        false
                      )}
                    </Text>
                  </Text>
                  <IconArrowUp size={16} style={{ paddingRight: '2px' }} />
                </Flex>
              </Flex>
              <Flex
                mt={2}
                justify="space-between"
                align="center"
                className={classes.details}
              >
                <Flex>
                  <Text component="div" display="flex" fz="xs">
                    <IconMoonFilled size={16} style={{ paddingRight: '2px' }} />
                    {'Close: '}
                    <Text component="div" mt={0} ml={4} display="flex" fz="xs">
                      {renderCounter(
                        (
                          parseFloat(prevClosePrice as string) -
                          parseFloat(priceChange as string)
                        ).toPrecision(12),
                        '12px',
                        getNumberPrecision(
                          (
                            parseFloat(prevClosePrice as string) -
                            parseFloat(priceChange as string)
                          ).toPrecision(12),
                          2
                        ),
                        'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4)',
                        false
                      )}
                    </Text>
                  </Text>
                </Flex>
                <Flex>
                  <Text component="div" display="flex" fz="xs">
                    {'Low: '}
                    <Text component="div" mt={0} ml={4} display="flex" fz="xs">
                      {renderCounter(
                        lowPrice as string,
                        '12px',
                        getNumberPrecision(lowPrice as string, 2),
                        'light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4)',
                        false
                      )}
                    </Text>
                  </Text>
                  <IconArrowDown size={16} style={{ paddingRight: '2px' }} />{' '}
                </Flex>
              </Flex>
            </>
          )}
        </PageTransition>
      </Paper>
    );
  }
);

FinancialCard.displayName = 'FinancialCard';

export default FinancialCard;
