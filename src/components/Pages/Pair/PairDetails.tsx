// PairDetails.tsx

import React from 'react';
import {
  Text,
  Flex,
  Grid,
  Group,
  Progress,
  Button,
  Stack,
  Title,
  Space,
  TypographyStylesProvider,
  Skeleton,
  Pill,
  Timeline,
  TimelineItem,
  Popover,
  ScrollArea,
  Paper
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconBrandTelegram,
  IconGlobe,
  IconBrandGithub,
  IconBrandX,
  IconChartBar,
  IconTrendingUp,
  IconUser,
  IconCode,
  IconInfoCircle,
  IconLink,
  IconHeart,
  IconNews,
  IconListDetails,
  IconThumbUpFilled,
  IconThumbDownFilled,
  IconBrandReddit
} from '@tabler/icons-react';
import ReactCountryFlag from 'react-country-flag';
import useCoinGeckoCoinData, { CoinData } from 'hooks/useCryptoCoinData';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import classes from 'assets/app/pair.module.css';

interface PairDetailsProps {
  id: string; // CoinGecko ID of the cryptocurrency
  vsCurrency: string; // The currency to compare against, e.g., 'usd'
}

const formatNumber = (number: number, precision: number = 2) => {
  if (number === undefined || number === null) return '-';
  return number.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
};

const formatPercentage = (value: number) => {
  if (value === undefined || value === null) return '-';
  const formatted = value.toFixed(2);
  return value >= 0
    ? `+${Number(formatted).toLocaleString()}%`
    : `${Number(formatted).toLocaleString()}%`;
};

type CoinCategoriesProps = {
  coinData: CoinData;
};

const CoinCategories: React.FC<CoinCategoriesProps> = ({ coinData }) => {
  if (!(coinData?.categories && coinData.categories.length > 0)) {
    return <>-</>;
  }

  const categories = coinData.categories;
  const [firstCategories, lastCategories] = [
    categories.slice(0, 5),
    categories.slice(5)
  ];

  const [firstCategoriesNodes, lastCategoriesNodes] = [
    firstCategories.map((category: string, index: number) => (
      <Pill key={index}>{category}</Pill>
    )),
    lastCategories.map((category: string, index: number) => (
      <Pill key={index + 5}>{category}</Pill>
    ))
  ];

  const lastCategoriesLabel = lastCategories.length && (
    <Popover position="bottom" withArrow key={-1}>
      <Popover.Target>
        <Pill style={{ cursor: 'pointer' }}>
          +{lastCategories.length} more categorie
          {`${lastCategories.length ? 's' : ''}`}
        </Pill>
      </Popover.Target>
      <Popover.Dropdown>
        <ScrollArea mah="100%">
          <Group gap="xs" maw={300} mah={300}>
            {lastCategoriesNodes}
          </Group>
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  );

  return [...firstCategoriesNodes, lastCategoriesLabel || <></>];
};

const PairDetails: React.FC<PairDetailsProps> = React.memo(
  ({ id, vsCurrency }) => {
    const { coinData, loading, error } = useCoinGeckoCoinData(id, vsCurrency);
    if (error) {
      return <></>;
    }

    // Helper function to determine color based on value
    const getColor = (value: number) =>
      value > 0 ? '#16c784' : value < 0 ? '#ea3943' : 'gray';

    const precision = coinData
      ? getNumberPrecision(coinData.market_data.current_price[vsCurrency])
      : 2; // Default precision if coinData is not available

    const regionNames = new Intl.DisplayNames([navigator.language], {
      type: 'region'
    });

    return (
      <Grid
        gutter="xl"
        w="100%"
        pt={32}
        style={{ zIndex: 3, position: 'relative' }}
        align="stretch"
      >
        <Grid.Col span={{ base: 12, md: 6, xl: 6 }}>
          <Paper
            h="100%"
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            pt="lg"
            pb="xl"
            withBorder
          >
            <Stack gap="md">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  Market Data
                </Title>
              </Flex>
              <Grid gutter="xl">
                {/* Circulating Supply */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    Circulating Supply
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {formatNumber(
                        coinData?.market_data?.circulating_supply ?? 0,
                        0
                      )}
                    </Text>
                  </Skeleton>
                  {coinData?.market_data.total_supply && (
                    <Skeleton visible={loading} height={10} w="50%" mt={8}>
                      <Progress
                        value={
                          (coinData.market_data.circulating_supply /
                            coinData.market_data.total_supply) *
                            100 || 0
                        }
                        h={2}
                        color="white"
                        styles={{
                          root: { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                        }}
                        size="sm"
                        mt={5}
                      />
                    </Skeleton>
                  )}
                </Grid.Col>
                {/* Total Supply */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    Total Supply
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.market_data.total_supply
                        ? formatNumber(coinData.market_data.total_supply, 0)
                        : '∞'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {/* Max Supply */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    Max Supply
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.market_data.max_supply
                        ? formatNumber(coinData.market_data.max_supply, 0)
                        : '∞'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {/* Market Cap */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    Market Cap
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.market_data.market_cap[
                        vsCurrency
                      ]?.toLocaleString(undefined, {
                        style: 'currency',
                        currency: vsCurrency.toUpperCase()
                      }) || '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {/* All-Time High */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    All-Time High
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.market_data.ath[vsCurrency]?.toLocaleString(
                        undefined,
                        {
                          style: 'currency',
                          currency: vsCurrency.toUpperCase(),
                          minimumFractionDigits: precision,
                          maximumFractionDigits: precision
                        }
                      ) || '-'}
                    </Text>
                  </Skeleton>
                  <Skeleton visible={loading} height={20} w={250} mt={5}>
                    <Group gap={4}>
                      {(() => {
                        const change =
                          coinData?.market_data.ath_change_percentage[
                            vsCurrency
                          ];
                        if (change === undefined || change === null)
                          return null;
                        const isPositive = change > 0;
                        const isZero = change === 0;
                        const color = getColor(change);
                        const IconComponent = isPositive
                          ? IconArrowUpRight
                          : isZero
                            ? null
                            : IconArrowDownRight;
                        return (
                          <>
                            {IconComponent && (
                              <IconComponent size={16} color={color} />
                            )}
                            <Text size="sm" c={color}>
                              {formatPercentage(change)} from ATH
                            </Text>
                          </>
                        );
                      })()}
                    </Group>
                  </Skeleton>
                </Grid.Col>
                {/* All-Time Low */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    All-Time Low
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.market_data.atl[vsCurrency]?.toLocaleString(
                        undefined,
                        {
                          style: 'currency',
                          currency: vsCurrency.toUpperCase(),
                          minimumFractionDigits: precision,
                          maximumFractionDigits: precision
                        }
                      ) || '-'}
                    </Text>
                  </Skeleton>
                  <Skeleton visible={loading} height={20} w={250} mt={5}>
                    <Group gap={4}>
                      {(() => {
                        const change =
                          coinData?.market_data.atl_change_percentage[
                            vsCurrency
                          ];
                        if (change === undefined || change === null)
                          return null;
                        const isPositive = change > 0;
                        const isZero = change === 0;
                        const color = getColor(change);
                        const IconComponent = isPositive
                          ? IconArrowUpRight
                          : isZero
                            ? null
                            : IconArrowDownRight;
                        return (
                          <>
                            {IconComponent && (
                              <IconComponent size={16} color={color} />
                            )}
                            <Text size="sm" c={color}>
                              {formatPercentage(change)} from ATL
                            </Text>
                          </>
                        );
                      })()}
                    </Group>
                  </Skeleton>
                </Grid.Col>
                {/* Market Cap Rank */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    Market Cap Rank
                  </Text>
                  <Skeleton visible={loading} height={20} w={100}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.market_cap_rank
                        ? `#${coinData?.market_cap_rank}`
                        : '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {/* Total Volume */}
                <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 5, xl: 4 }}>
                  <Text size="sm" c="dimmed">
                    Total Volume
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.market_data.total_volume[
                        vsCurrency
                      ]?.toLocaleString(undefined, {
                        style: 'currency',
                        currency: vsCurrency.toUpperCase()
                      }) || '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>

          <Space h={0} />
        </Grid.Col>

        {/* General Information Section */}
        <Grid.Col span={{ base: 12, md: 6, xl: 6 }}>
          <Paper
            h="100%"
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            pt="lg"
            pb="xl"
            withBorder
          >
            <Stack gap="md">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  Informations
                </Title>
              </Flex>
              <Grid gutter="xl">
                {/* Country of Origin */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Country of Origin
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Flex align="baseline" gap={6}>
                      {coinData?.country_origin ? (
                        <>
                          <div
                            style={{
                              borderRadius: '100%',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              position: 'relative',
                              width: '1.25em',
                              height: '1.25em',
                              backgroundColor: 'rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            <ReactCountryFlag
                              svg
                              style={{
                                width: '1.25em',
                                height: '1.25em',
                                objectFit: 'cover',
                                transform: 'translate(0%, -15%)'
                              }}
                              countryCode={coinData?.country_origin || ''}
                              title={regionNames.of(coinData?.country_origin)}
                            />
                          </div>
                          <Text
                            size="md"
                            fw={500}
                            c="light-dark(black, white)"
                            ml={4}
                          >
                            {coinData?.country_origin
                              ? regionNames.of(coinData?.country_origin)
                              : '-'}
                          </Text>
                        </>
                      ) : (
                        <Text size="md" fw={500} c="light-dark(black, white)">
                          -
                        </Text>
                      )}
                    </Flex>
                  </Skeleton>
                </Grid.Col>
                {/* Genesis Date */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Genesis Date
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.genesis_date
                        ? new Date(coinData.genesis_date).toLocaleDateString()
                        : '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {/* Hashing Algorithm */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Hashing Algorithm
                  </Text>
                  <Skeleton visible={loading} height={20} miw={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.hashing_algorithm || '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {/* Block Time in Minutes */}
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Block Time (minutes)
                  </Text>
                  <Skeleton visible={loading} height={20} miw={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {coinData?.block_time_in_minutes
                        ? `${coinData.block_time_in_minutes} minute${
                            coinData.block_time_in_minutes > 1 ? 's' : ''
                          }`
                        : '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {/* Categories */}
                <Grid.Col span={{ base: 12 }}>
                  <Text size="sm" c="dimmed">
                    Categories
                  </Text>
                  <Skeleton visible={loading} mih={20} mt={7}>
                    <Group gap="xs" w="100%">
                      <CoinCategories coinData={coinData as CoinData} />
                    </Group>
                  </Skeleton>
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>

          <Space h={0} />
        </Grid.Col>

        {/* Price Changes Section */}
        <Grid.Col span={{ base: 12 }}>
          <Paper
            h="100%"
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            pt="lg"
            pb="xl"
            withBorder
          >
            <Stack gap="md">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  Price Changes
                </Title>
              </Flex>

              <Grid gutter="xl">
                {/* Price Change Timeframes */}
                {[
                  { label: '1h', value: '1h_in_currency' },
                  { label: '24h', value: '24h_in_currency' },
                  { label: '7d', value: '7d_in_currency' },
                  { label: '14d', value: '14d_in_currency' },
                  { label: '30d', value: '30d_in_currency' },
                  { label: '60d', value: '60d_in_currency' },
                  { label: '200d', value: '200d_in_currency' },
                  { label: '1y', value: '1y_in_currency' }
                ].map((timeframe, index) => {
                  const change =
                    // @ts-expect-error - TS doesn't know that the key exists
                    coinData?.market_data[
                      `price_change_percentage_${timeframe.value}`
                    ]?.[vsCurrency];

                  const isPositive = change > 0;
                  const isZero = change === 0;
                  const color = getColor(change);
                  const IconComponent = isPositive
                    ? IconArrowUpRight
                    : isZero
                      ? null
                      : IconArrowDownRight;

                  return (
                    <Grid.Col
                      span={{ base: 6, sm: 3, md: 3, lg: 3, xl: 2 }}
                      key={index}
                    >
                      <Text size="sm" c="dimmed">
                        {timeframe.label} Change
                      </Text>
                      <Skeleton visible={loading} height={20} w={200}>
                        <Group gap={4}>
                          {IconComponent && change && (
                            <IconComponent size={16} color={color} />
                          )}
                          <Text size="md" fw={500} c={color}>
                            {formatPercentage(change)}
                          </Text>
                        </Group>
                      </Skeleton>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </Stack>
          </Paper>

          <Space h={0} />
        </Grid.Col>

        {/* Developer Data Section */}
        <Grid.Col span={{ base: 12, md: 6, xl: 6 }}>
          <Paper
            h="100%"
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            pt="lg"
            pb="xl"
            withBorder
          >
            <Stack gap="md">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  Developer Data
                </Title>
              </Flex>

              <Grid gutter="xl">
                {/* GitHub Stats */}
                <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Stars
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {formatNumber(coinData?.developer_data.stars ?? 0, 0) ||
                        '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Forks
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {formatNumber(coinData?.developer_data.forks ?? 0, 0) ||
                        '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Open Issues
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {formatNumber(
                        coinData?.developer_data.total_issues ?? 0,
                        0
                      ) || '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                  <Text size="sm" c="dimmed">
                    Contributors
                  </Text>
                  <Skeleton visible={loading} height={20} w={200}>
                    <Text size="md" fw={500} c="light-dark(black, white)">
                      {formatNumber(
                        coinData?.developer_data.pull_request_contributors ?? 0,
                        0
                      ) || '-'}
                    </Text>
                  </Skeleton>
                </Grid.Col>
                {coinData?.links.repos_url.github &&
                  coinData.links.repos_url.github[0] && (
                    <Grid.Col span={{ base: 12, md: 6, xl: 6 }}>
                      <Skeleton
                        visible={loading}
                        height={36}
                        w={170}
                        radius="xl"
                      >
                        <Button
                          variant="filled"
                          color="dark.7"
                          component="a"
                          href={coinData.links.repos_url.github[0]}
                          target="_blank"
                          radius="xl"
                          leftSection={<IconBrandGithub size={16} />}
                        >
                          View on GitHub
                        </Button>
                      </Skeleton>
                    </Grid.Col>
                  )}
              </Grid>
            </Stack>
          </Paper>

          <Space h={0} />
        </Grid.Col>

        {/* Community Data Section */}
        <Grid.Col span={{ base: 12, md: 6, xl: 6 }}>
          <Paper
            h="100%"
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            pt="lg"
            pb="xl"
            withBorder
          >
            <Stack gap="md">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  Community Data
                </Title>
              </Flex>

              <Grid gutter="xl">
                {/* Twitter Followers */}
                {coinData?.community_data.twitter_followers !== null && (
                  <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                    <Text size="sm" c="dimmed">
                      X Followers
                    </Text>
                    <Skeleton visible={loading} height={20} w={200}>
                      <Group gap={4}>
                        <IconBrandX
                          size={16}
                          color="light-dark(black, white)"
                        />
                        <Text size="md" fw={500} c="light-dark(black, white)">
                          {formatNumber(
                            coinData?.community_data?.twitter_followers ?? 0,
                            0
                          )}
                        </Text>
                      </Group>
                    </Skeleton>
                  </Grid.Col>
                )}
                {/* Telegram Users */}
                {coinData?.community_data.telegram_channel_user_count !==
                  null && (
                  <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                    <Text size="sm" c="dimmed">
                      Telegram Users
                    </Text>
                    <Skeleton visible={loading} height={20}>
                      <Group gap={4}>
                        <IconBrandTelegram size={16} color="#0088CC" />
                        <Text size="md" fw={500} c="light-dark(black, white)">
                          {formatNumber(
                            coinData?.community_data
                              ?.telegram_channel_user_count ?? 0,
                            0
                          )}
                        </Text>
                      </Group>
                    </Skeleton>
                  </Grid.Col>
                )}
              </Grid>
            </Stack>
          </Paper>

          <Space h={0} />
        </Grid.Col>

        {/* Status Updates Section */}
        {coinData?.status_updates && coinData.status_updates.length > 0 && (
          <>
            <Grid.Col span={{ base: 12 }}>
              <Paper
                radius="lg"
                p="xl"
                className={classes['pair-detail-card']}
                pt="lg"
                pb="xl"
                withBorder
              >
                <Stack gap="md">
                  <Flex align="center">
                    <Title
                      order={3}
                      fw={600}
                      style={{ letterSpacing: '-0.03em' }}
                      fz={{ base: 24, md: 26 }}
                      mb={14}
                      c="light-dark(black, white)"
                    >
                      Status Updates
                    </Title>
                  </Flex>
                  <Skeleton visible={loading}>
                    <Stack gap="sm">
                      <Timeline bulletSize={12}>
                        {coinData.status_updates.map((update, index) => (
                          <TimelineItem key={index} bullet={<></>}>
                            <Text
                              size="sm"
                              c="dimmed"
                              style={{ transform: 'translateY(-3px)' }}
                            >
                              {new Date(update.created_at).toLocaleString()}
                            </Text>
                            <TypographyStylesProvider
                              fz="sm"
                              c="light-dark(black, white)"
                              mt={7}
                              style={{ textAlign: 'left', display: 'block' }}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: update.description
                                }}
                              />
                            </TypographyStylesProvider>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </Stack>
                  </Skeleton>
                </Stack>
              </Paper>
              <Space h={0} />
            </Grid.Col>
          </>
        )}

        {/* About Section */}
        <Grid.Col span={{ base: 12 }}>
          <Paper
            h="100%"
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            pt="lg"
            pb="xl"
            withBorder
          >
            <Stack gap="md">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  About
                </Title>
              </Flex>

              <Skeleton visible={loading}>
                <TypographyStylesProvider
                  fz="sm"
                  c="light-dark(black, white)"
                  style={{ textAlign: 'left', display: 'block' }}
                >
                  <div
                    style={{
                      display: 'block',
                      overflow: 'hidden'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: !coinData?.description.en
                        ? 'No description available'
                        : coinData?.description.en
                    }}
                  />
                </TypographyStylesProvider>
              </Skeleton>
            </Stack>
          </Paper>

          <Space h={0} />
        </Grid.Col>

        {/* Sentiment Votes Section */}
        <Grid.Col span={{ base: 12, md: 6, xl: 6 }}>
          <Paper
            h="100%"
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            pt="lg"
            pb="xl"
            withBorder
          >
            <Stack gap="md">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  Sentiment Votes
                </Title>
              </Flex>
              <Grid gutter="xl">
                {/* Sentiment Votes Up */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" c="dimmed">
                    Votes Up Percentage
                  </Text>
                  <Skeleton visible={loading} height={20} w={100}>
                    <Flex align="center" fw={500} c="light-dark(black, white)">
                      <IconThumbUpFilled size={16} color="#16c784" />
                      <Text
                        size="md"
                        fw={500}
                        c="light-dark(black, white)"
                        ml={6}
                      >
                        {coinData?.sentiment_votes_up_percentage !== null
                          ? `${coinData?.sentiment_votes_up_percentage.toFixed(
                              2
                            )}%`
                          : '-'}
                      </Text>
                    </Flex>
                  </Skeleton>
                </Grid.Col>
                {/* Sentiment Votes Down */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" c="dimmed">
                    Votes Down Percentage
                  </Text>
                  <Skeleton visible={loading} height={20} w={100}>
                    <Flex align="center" fw={500} c="light-dark(black, white)">
                      <IconThumbDownFilled size={16} color="#ea3943" />
                      <Text
                        size="md"
                        fw={500}
                        c="light-dark(black, white)"
                        ml={6}
                      >
                        {coinData?.sentiment_votes_down_percentage !== null
                          ? `${coinData?.sentiment_votes_down_percentage.toFixed(
                              2
                            )}%`
                          : '-'}
                      </Text>
                    </Flex>
                  </Skeleton>
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>

          <Space h={0} />
        </Grid.Col>

        {/* Social Links */}
        <Grid.Col span={{ base: 12, md: 6, xl: 6 }}>
          <Paper
            radius="lg"
            p="xl"
            className={classes['pair-detail-card']}
            h="100%"
            pt="lg"
            pb="lg"
            mb="lg"
            withBorder
          >
            <Stack gap="md" h="100%">
              <Flex align="center">
                <Title
                  order={3}
                  fw={600}
                  style={{ letterSpacing: '-0.03em' }}
                  fz={{ base: 24, md: 26 }}
                  mb={14}
                  c="light-dark(black, white)"
                >
                  Links
                </Title>
              </Flex>
              <Skeleton visible={loading} radius="xl">
                <Group>
                  {coinData?.links.homepage && coinData.links.homepage[0] && (
                    <Button
                      variant="filled"
                      color="blue.9"
                      component="a"
                      href={coinData.links.homepage[0]}
                      target="_blank"
                      radius="xl"
                      leftSection={
                        <IconGlobe size={16} style={{ opacity: 0.7 }} />
                      }
                    >
                      Website
                    </Button>
                  )}
                  {coinData?.links.twitter_screen_name && (
                    <Button
                      variant="filled"
                      color="black"
                      component="a"
                      href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
                      target="_blank"
                      radius="xl"
                      leftSection={
                        <IconBrandX size={16} style={{ opacity: 0.7 }} />
                      }
                    >
                      X
                    </Button>
                  )}
                  {coinData?.links.subreddit_url && (
                    <Button
                      variant="filled"
                      color="#FF4500"
                      component="a"
                      href={coinData.links.subreddit_url}
                      target="_blank"
                      radius="xl"
                      leftSection={
                        <IconBrandReddit size={16} style={{ opacity: 0.7 }} />
                      }
                    >
                      Reddit
                    </Button>
                  )}
                  {coinData?.links.telegram_channel_identifier && (
                    <Button
                      variant="filled"
                      color="blue"
                      component="a"
                      href={`https://t.me/${coinData.links.telegram_channel_identifier}`}
                      target="_blank"
                      radius="xl"
                      leftSection={
                        <IconBrandTelegram size={16} style={{ opacity: 0.7 }} />
                      }
                    >
                      Telegram
                    </Button>
                  )}
                  {coinData?.links.repos_url.github &&
                    coinData.links.repos_url.github[0] && (
                      <Button
                        variant="filled"
                        color="dark.7"
                        component="a"
                        href={coinData.links.repos_url.github[0]}
                        target="_blank"
                        radius="xl"
                        leftSection={
                          <IconBrandGithub size={16} style={{ opacity: 0.7 }} />
                        }
                      >
                        GitHub
                      </Button>
                    )}
                </Group>
              </Skeleton>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    );
  }
);

PairDetails.displayName = 'PairDetails';

export default PairDetails;
