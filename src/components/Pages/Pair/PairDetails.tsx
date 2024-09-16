import React from 'react';
import {
  Text,
  Flex,
  Grid,
  Group,
  Loader,
  Center,
  Progress,
  Button,
  Stack,
  Title,
  Space,
  TypographyStylesProvider
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconBrandReddit,
  IconBrandTelegram,
  IconGlobe,
  IconBrandGithub,
  IconBrandX
} from '@tabler/icons-react';
import useCryptoCoinData from 'hooks/useCryptoCoinData';
import { getNumberPrecision } from 'utils/getNumberPrecision';

interface PairDetailsProps {
  id: string; // CoinGecko ID of the cryptocurrency
  vsCurrency: string; // The currency to compare against, e.g., 'usd'
}

const formatNumber = (number: number, precision: number = 2) => {
  if (!number) return 'N/A';
  return number.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
};

const formatPercentage = (value: number) => {
  const formatted = value.toFixed(2);
  return value >= 0
    ? `+${Number(formatted).toLocaleString()}%`
    : `${Number(formatted).toLocaleString()}%`;
};

const PairDetails: React.FC<PairDetailsProps> = React.memo(
  ({ id, vsCurrency }) => {
    const { coinData, loading, error } = useCryptoCoinData(id, vsCurrency);

    if (loading) {
      return (
        <Center style={{ height: '100%' }}>
          <Loader size="md" />
        </Center>
      );
    }

    if (error || !coinData) {
      return (
        <Text c="red" ta="center">
          {error}
        </Text>
      );
    }

    const { market_data, description, links, developer_data, community_data } =
      coinData;

    const precision = getNumberPrecision(market_data.current_price[vsCurrency]);

    // Helper function to determine color based on value
    const getColor = (value: number) =>
      value > 0 ? '#16c784' : value < 0 ? '#ea3943' : 'gray';

    return (
      <Flex
        direction="column"
        gap="md"
        w="100%"
        p={28}
        mt={28}
        style={{ zIndex: 3, position: 'relative' }}
      >
        {/* Market Data Section */}
        <Stack gap="md">
          <Title order={3} c="white">
            Market Data
          </Title>
          <Grid>
            {/* Circulating Supply */}
            <Grid.Col span={6}>
              <Text size="sm" c="dimmed">
                Circulating Supply
              </Text>
              <Text size="md" fw={500} c="white">
                {formatNumber(market_data.circulating_supply)}
              </Text>
              {market_data.total_supply && (
                <Progress
                  w="50%"
                  value={
                    (market_data.circulating_supply /
                      market_data.total_supply) *
                      100 || 0
                  }
                  color="white"
                  size="sm"
                  mt={5}
                />
              )}
            </Grid.Col>
            {/* Total Supply */}
            <Grid.Col span={6}>
              <Text size="sm" color="dimmed">
                Total Supply
              </Text>
              <Text size="md" fw={500} c="white">
                {market_data.total_supply
                  ? formatNumber(market_data.total_supply)
                  : '∞'}
              </Text>
            </Grid.Col>
            {/* Max Supply */}
            <Grid.Col span={6}>
              <Text size="sm" c="dimmed">
                Max Supply
              </Text>
              <Text size="md" fw={500} c="white">
                {market_data.max_supply
                  ? formatNumber(market_data.max_supply)
                  : '∞'}
              </Text>
            </Grid.Col>
            {/* Market Cap */}
            <Grid.Col span={6}>
              <Text size="sm" c="dimmed">
                Market Cap
              </Text>
              <Text size="md" fw={500} c="white">
                {market_data.market_cap[vsCurrency]?.toLocaleString(undefined, {
                  style: 'currency',
                  currency: vsCurrency.toUpperCase()
                })}
              </Text>
            </Grid.Col>
            {/* All-Time High */}
            <Grid.Col span={6}>
              <Text size="sm" c="dimmed">
                All-Time High
              </Text>
              <Text size="md" fw={500} c="white">
                {market_data.ath[vsCurrency]?.toLocaleString(undefined, {
                  style: 'currency',
                  currency: vsCurrency.toUpperCase(),
                  minimumFractionDigits: precision,
                  maximumFractionDigits: precision
                })}
              </Text>
              <Group gap={4}>
                {(() => {
                  const change = market_data.ath_change_percentage[vsCurrency];
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
            </Grid.Col>
            {/* All-Time Low */}
            <Grid.Col span={6}>
              <Text size="sm" c="dimmed">
                All-Time Low
              </Text>
              <Text size="md" fw={500} c="white">
                {market_data.atl[vsCurrency]?.toLocaleString(undefined, {
                  style: 'currency',
                  currency: vsCurrency.toUpperCase(),
                  minimumFractionDigits: precision,
                  maximumFractionDigits: precision
                })}
              </Text>
              <Group gap={4}>
                {(() => {
                  const change = market_data.atl_change_percentage[vsCurrency];
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
            </Grid.Col>
          </Grid>
        </Stack>

        {/* Add space between sections */}
        <Space h="md" />

        {/* Price Changes Section */}
        <Stack gap="md">
          <Title order={3} c="white">
            Price Changes
          </Title>
          <Grid>
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
                market_data[`price_change_percentage_${timeframe.value}`]?.[
                  vsCurrency
                ];
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
                <Grid.Col span={6} key={index}>
                  <Text size="sm" color="dimmed">
                    {timeframe.label} Change
                  </Text>
                  <Group gap={4}>
                    {IconComponent && <IconComponent size={16} color={color} />}
                    <Text size="md" fw={500} color={color}>
                      {formatPercentage(change)}
                    </Text>
                  </Group>
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>

        <Space h="md" />

        {/* Developer Data Section */}
        <Stack gap="md">
          <Title order={3} c="white">
            Developer Data
          </Title>
          <Grid>
            {/* GitHub Stats */}
            <Grid.Col span={6}>
              <Text size="sm" color="dimmed">
                Stars
              </Text>
              <Text size="md" fw={500} c="white">
                {formatNumber(developer_data.stars, 0) || 'N/A'}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" color="dimmed">
                Forks
              </Text>
              <Text size="md" fw={500} c="white">
                {formatNumber(developer_data.fork, 0) || 'N/A'}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" color="dimmed">
                Open Issues
              </Text>
              <Text size="md" fw={500} c="white">
                {formatNumber(developer_data.total_issues, 0) || 'N/A'}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" color="dimmed">
                Contributors
              </Text>
              <Text size="md" fw={500} c="white">
                {formatNumber(developer_data.pull_request_contributors, 0) ||
                  'N/A'}
              </Text>
            </Grid.Col>
            {links.repos_url.github && links.repos_url.github[0] && (
              <Grid.Col span={12}>
                <Button
                  variant="light"
                  color="dark.1"
                  component="a"
                  href={links.repos_url.github[0]}
                  target="_blank"
                  radius="xl"
                  leftSection={<IconBrandGithub size={16} />}
                >
                  View on GitHub
                </Button>
              </Grid.Col>
            )}
          </Grid>
        </Stack>

        <Space h="md" />

        {/* Community Data Section */}
        <Stack gap="md">
          <Title order={3} c="white">
            Community Data
          </Title>
          <Grid>
            {/* Twitter Followers */}
            {community_data.twitter_followers !== null && (
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  X Followers
                </Text>
                <Group gap={4}>
                  <IconBrandX size={16} color="#FAFAFA" />
                  <Text size="md" fw={500} c="white">
                    {formatNumber(community_data.twitter_followers, 0)}
                  </Text>
                </Group>
              </Grid.Col>
            )}
            {/* Reddit Subscribers */}
            {community_data.reddit_subscribers !== null && (
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Reddit Subscribers
                </Text>
                <Group gap={4}>
                  <IconBrandReddit size={16} color="#FF4500" />
                  <Text size="md" fw={500} c="white">
                    {formatNumber(community_data.reddit_subscribers, 0)}
                  </Text>
                </Group>
              </Grid.Col>
            )}
            {/* Telegram Users */}
            {community_data.telegram_channel_user_count !== null && (
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Telegram Users
                </Text>
                <Group gap={4}>
                  <IconBrandTelegram size={16} color="#0088CC" />
                  <Text size="md" fw={500} c="white">
                    {formatNumber(
                      community_data.telegram_channel_user_count,
                      0
                    )}
                  </Text>
                </Group>
              </Grid.Col>
            )}
          </Grid>
        </Stack>

        <Space h="md" />

        {/* About Section */}
        <Stack gap="md">
          <Title order={3} c="white">
            About
          </Title>
          <TypographyStylesProvider
            fz="sm"
            c="white"
            style={{ textAlign: 'justify' }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: description.en && description.en.split('. ')[0] + '.'
              }}
            />
          </TypographyStylesProvider>
        </Stack>

        <Space h="md" />

        {/* Social Links */}
        <Group gap="xs" p="center" ml={-14}>
          {links.homepage && links.homepage[0] && (
            <Button
              variant="transparent"
              color="dark.1"
              component="a"
              href={links.homepage[0]}
              target="_blank"
              radius="xl"
              leftSection={<IconGlobe size={16} style={{ opacity: 0.7 }} />}
            >
              Website
            </Button>
          )}
          {links.twitter_screen_name && (
            <Button
              variant="transparent"
              color="gray.2"
              component="a"
              href={`https://twitter.com/${links.twitter_screen_name}`}
              target="_blank"
              radius="xl"
              leftSection={<IconBrandX size={16} style={{ opacity: 0.7 }} />}
            >
              X
            </Button>
          )}
          {links.subreddit_url && (
            <Button
              variant="transparent"
              color="#FF4500"
              component="a"
              href={links.subreddit_url}
              target="_blank"
              radius="xl"
              leftSection={
                <IconBrandReddit size={16} style={{ opacity: 0.7 }} />
              }
            >
              Reddit
            </Button>
          )}
          {links.telegram_channel_identifier && (
            <Button
              variant="transparent"
              color="blue"
              component="a"
              href={`https://t.me/${links.telegram_channel_identifier}`}
              target="_blank"
              radius="xl"
              leftSection={
                <IconBrandTelegram size={16} style={{ opacity: 0.7 }} />
              }
            >
              Telegram
            </Button>
          )}
          {links.repos_url.github && links.repos_url.github[0] && (
            <Button
              variant="transparent"
              color="dark.2"
              component="a"
              href={links.repos_url.github[0]}
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
      </Flex>
    );
  }
);

PairDetails.displayName = 'PairDetails';

export default PairDetails;
