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
  Divider,
  Pill,
  ActionIcon
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconBrandReddit,
  IconBrandTelegram,
  IconGlobe,
  IconBrandGithub,
  IconBrandX,
  IconChartBar,
  IconTrendingUp,
  IconUser,
  IconCode,
  IconInfoCircle,
  IconLink
} from '@tabler/icons-react';
import useCryptoCoinData from 'hooks/useCryptoCoinData';
import { getNumberPrecision } from 'utils/getNumberPrecision';

interface PairDetailsProps {
  id: string; // CoinGecko ID of the cryptocurrency
  vsCurrency: string; // The currency to compare against, e.g., 'usd'
}

const formatNumber = (number: number, precision: number = 2) => {
  if (number === undefined || number === null) return 'N/A';
  return number.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
};
const formatPercentage = (value: number) => {
  if (value === undefined || value === null) return 'N/A';
  const formatted = value.toFixed(2);
  return value >= 0
    ? `+${Number(formatted).toLocaleString()}%`
    : `${Number(formatted).toLocaleString()}%`;
};

const PairDetails: React.FC<PairDetailsProps> = React.memo(
  ({ id, vsCurrency }) => {
    const { coinData, loading, error } = useCryptoCoinData(id, vsCurrency);

    if (error) {
      return (
        <Text c="red" ta="center">
          {error}
        </Text>
      );
    }

    console.log(coinData?.description.en);

    // Helper function to determine color based on value
    const getColor = (value: number) =>
      value > 0 ? '#16c784' : value < 0 ? '#ea3943' : 'gray';

    const precision = coinData
      ? getNumberPrecision(coinData.market_data.current_price[vsCurrency])
      : 2; // Default precision if coinData is not available

    return (
      <Flex
        direction="column"
        gap="md"
        w="100%"
        p={28}
        pt={0}
        mt={-14}
        style={{ zIndex: 3, position: 'relative' }}
      >
        {/* Market Data Section */}
        <Divider my={14} mb={42} color="dark.5" />

        <Stack gap="md">
          <Flex align="center">
            <IconChartBar size={22} color="white" />
            <Title order={2} c="white" ml={14}>
              Market Data
            </Title>
          </Flex>
          <Grid gutter="xl">
            {/* Circulating Supply */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Circulating Supply
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {formatNumber(
                    coinData?.market_data?.circulating_supply ?? 0,
                    0
                  )}
                </Text>
              </Skeleton>
              {coinData?.market_data.total_supply && (
                <Skeleton visible={loading} height={10} w="50%" mt={5}>
                  <Progress
                    value={
                      (coinData.market_data.circulating_supply /
                        coinData.market_data.total_supply) *
                        100 || 0
                    }
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
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Total Supply
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {coinData?.market_data.total_supply
                    ? formatNumber(coinData.market_data.total_supply, 0)
                    : '∞'}
                </Text>
              </Skeleton>
            </Grid.Col>
            {/* Max Supply */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Max Supply
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {coinData?.market_data.max_supply
                    ? formatNumber(coinData.market_data.max_supply, 0)
                    : '∞'}
                </Text>
              </Skeleton>
            </Grid.Col>
            {/* Market Cap */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Market Cap
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {coinData?.market_data.market_cap[vsCurrency]?.toLocaleString(
                    undefined,
                    {
                      style: 'currency',
                      currency: vsCurrency.toUpperCase()
                    }
                  )}
                </Text>
              </Skeleton>
            </Grid.Col>
            {/* All-Time High */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                All-Time High
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {coinData?.market_data.ath[vsCurrency]?.toLocaleString(
                    undefined,
                    {
                      style: 'currency',
                      currency: vsCurrency.toUpperCase(),
                      minimumFractionDigits: precision,
                      maximumFractionDigits: precision
                    }
                  )}
                </Text>
              </Skeleton>
              <Skeleton visible={loading} height={20} width={250} mt={5}>
                <Group gap={4}>
                  {(() => {
                    const change =
                      coinData?.market_data.ath_change_percentage[vsCurrency];
                    if (change === undefined || change === null) return null;
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
                        <Text size="sm" color={color}>
                          {formatPercentage(change)} from ATH
                        </Text>
                      </>
                    );
                  })()}
                </Group>
              </Skeleton>
            </Grid.Col>
            {/* All-Time Low */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                All-Time Low
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {coinData?.market_data.atl[vsCurrency]?.toLocaleString(
                    undefined,
                    {
                      style: 'currency',
                      currency: vsCurrency.toUpperCase(),
                      minimumFractionDigits: precision,
                      maximumFractionDigits: precision
                    }
                  )}
                </Text>
              </Skeleton>
              <Skeleton visible={loading} height={20} width={250} mt={5}>
                <Group gap={4}>
                  {(() => {
                    const change =
                      coinData?.market_data.atl_change_percentage[vsCurrency];
                    if (change === undefined || change === null) return null;
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
          </Grid>
        </Stack>

        <Space h="xl" />
        {/* Price Changes Section */}
        <Stack gap="md">
          <Flex align="center">
            <IconTrendingUp size={22} color="white" />
            <Title order={2} c="white" ml={14}>
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
              if (change === undefined || change === null) return null;

              const isPositive = change > 0;
              const isZero = change === 0;
              const color = getColor(change);
              const IconComponent = isPositive
                ? IconArrowUpRight
                : isZero
                  ? null
                  : IconArrowDownRight;

              return (
                <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={index}>
                  <Text size="sm" c="dimmed">
                    {timeframe.label} Change
                  </Text>
                  <Skeleton visible={loading} height={20} width={200}>
                    <Group gap={4}>
                      {IconComponent && (
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

        <Space h="xl" />
        {/* Developer Data Section */}
        <Stack gap="md">
          <Flex align="center">
            <IconCode size={22} color="white" />
            <Title order={2} c="white" ml={14}>
              Developer Data
            </Title>
          </Flex>

          <Grid gutter="xl">
            {/* GitHub Stats */}
            <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Stars
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {formatNumber(coinData?.developer_data.stars ?? 0, 0) ||
                    'N/A'}
                </Text>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Forks
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {formatNumber(coinData?.developer_data.fork ?? 0, 0) || 'N/A'}
                </Text>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Open Issues
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {formatNumber(
                    coinData?.developer_data.total_issues ?? 0,
                    0
                  ) || 'N/A'}
                </Text>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
              <Text size="sm" c="dimmed">
                Contributors
              </Text>
              <Skeleton visible={loading} height={20} width={200}>
                <Text size="md" fw={500} c="white">
                  {formatNumber(
                    coinData?.developer_data.pull_request_contributors ?? 0,
                    0
                  ) || 'N/A'}
                </Text>
              </Skeleton>
            </Grid.Col>
            {coinData?.links.repos_url.github &&
              coinData.links.repos_url.github[0] && (
                <Grid.Col span={12}>
                  <Skeleton
                    visible={loading}
                    height={36}
                    width={170}
                    radius="xl"
                  >
                    <Button
                      variant="light"
                      color="dark.1"
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

        <Space h="xl" />
        {/* Community Data Section */}
        <Stack gap="md">
          <Flex align="center">
            <IconUser size={22} color="white" />
            <Title order={2} c="white" ml={14}>
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
                <Skeleton visible={loading} height={20} width={200}>
                  <Group gap={4}>
                    <IconBrandX size={16} color="#FAFAFA" />
                    <Text size="md" fw={500} c="white">
                      {formatNumber(
                        coinData?.community_data?.twitter_followers ?? 0,
                        0
                      )}
                    </Text>
                  </Group>
                </Skeleton>
              </Grid.Col>
            )}
            {/* Reddit Subscribers */}
            {coinData?.community_data.reddit_subscribers !== null && (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                <Text size="sm" c="dimmed">
                  Reddit Subscribers
                </Text>
                <Skeleton visible={loading} height={20} width={200}>
                  <Group gap={4}>
                    <IconBrandReddit size={16} color="#FF4500" />
                    <Text size="md" fw={500} c="white">
                      {formatNumber(
                        coinData?.community_data?.reddit_subscribers ?? 0,
                        0
                      )}
                    </Text>
                  </Group>
                </Skeleton>
              </Grid.Col>
            )}
            {/* Telegram Users */}
            {coinData?.community_data.telegram_channel_user_count !== null && (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }}>
                <Text size="sm" c="dimmed">
                  Telegram Users
                </Text>
                <Skeleton visible={loading} height={20}>
                  <Group gap={4}>
                    <IconBrandTelegram size={16} color="#0088CC" />
                    <Text size="md" fw={500} c="white">
                      {formatNumber(
                        coinData?.community_data?.telegram_channel_user_count ??
                          0,
                        0
                      )}
                    </Text>
                  </Group>
                </Skeleton>
              </Grid.Col>
            )}
          </Grid>
        </Stack>

        <Space h="xl" />
        {/* About Section */}
        <Stack gap="md">
          <Flex align="center">
            <IconInfoCircle size={22} color="white" />
            <Title order={2} c="white" ml={14}>
              About
            </Title>
          </Flex>

          <Skeleton visible={loading}>
            <TypographyStylesProvider
              fz="sm"
              c="white"
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

        <Space h="xl" />
        {/* Social Links */}
        <Stack gap="md">
          <Flex align="center">
            <IconLink size={22} color="white" />
            <Title order={2} c="white" ml={14}>
              Links
            </Title>
          </Flex>
          <Skeleton visible={loading} radius="xl">
            <Group gap="xs" p="center" ml={-14}>
              {coinData?.links.homepage && coinData.links.homepage[0] && (
                <Button
                  variant="transparent"
                  color="dark.1"
                  component="a"
                  href={coinData.links.homepage[0]}
                  target="_blank"
                  radius="xl"
                  leftSection={<IconGlobe size={16} style={{ opacity: 0.7 }} />}
                >
                  Website
                </Button>
              )}
              {coinData?.links.twitter_screen_name && (
                <Button
                  variant="transparent"
                  color="gray.2"
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
                  variant="transparent"
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
                  variant="transparent"
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
                    variant="transparent"
                    color="dark.2"
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
      </Flex>
    );
  }
);

PairDetails.displayName = 'PairDetails';

export default PairDetails;
