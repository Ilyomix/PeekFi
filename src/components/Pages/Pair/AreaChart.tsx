import React, { useCallback, useState, useMemo } from 'react';
import {
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  ReferenceLine
} from 'recharts';
import { Divider, Flex, LoadingOverlay, Paper, Text } from '@mantine/core';
import 'assets/components/areaCharts/index.css';
import { AnimatedTickerDisplay } from 'components/Pages/Pair/AnimatedTickerDisplay';
import { IconChartBarPopular, IconClock } from '@tabler/icons-react';
import { CandleData } from 'hooks/useCryptoKline';

type DataPoint = {
  x: number;
  y: number;
  volume: number;
};

type ChartProps = {
  interval: string;
  symbol: string;
  precision: number;
  currentPrice?: number;
  deltaPercent?: number;
  activeDotColor: string;
  loading: boolean;
  openPrice: number;
  deltaPositive: boolean;
  data: CandleData[];
};

const Chart: React.FC<ChartProps> = React.memo(
  ({ interval, precision, data, loading, activeDotColor, openPrice }) => {
    const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

    const xValues = useMemo(() => data.map((d) => d.x), [data]);
    const yValues = useMemo(() => data.map((d) => d.y), [data]);

    const showDateTime = useMemo(() => ['1D'].includes(interval), [interval]);
    const showDate = useMemo(
      () => ['3M', '1Y', '5Y', 'Max'].includes(interval),
      [interval]
    );

    const minXFromData = useMemo(() => Math.min(...xValues), [xValues]);
    const maxXFromData = useMemo(() => Math.max(...xValues), [xValues]);

    const minYFromData = useMemo(
      () => Math.min(openPrice, Math.min(...yValues)),
      [openPrice, yValues]
    );
    const maxYFromData = useMemo(
      () => Math.max(openPrice, Math.max(...yValues)),
      [openPrice, yValues]
    );

    const handleTooltipUpdate = useCallback((payload: any[]) => {
      if (payload.length > 0) {
        const { x, y, volume } = payload[0].payload as DataPoint;
        setHoveredData({ x, y, volume });
      } else {
        setHoveredData(null);
      }
    }, []);

    const formatDate = useCallback(
      (date: number) => {
        const options: Intl.DateTimeFormatOptions = showDate
          ? { day: '2-digit', month: 'short', year: 'numeric' }
          : showDateTime
            ? { hour: '2-digit', minute: '2-digit' }
            : {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              };
        return new Date(date).toLocaleString(undefined, options);
      },
      [showDate, showDateTime]
    );

    const getTooltipContent = useCallback(() => {
      if (!hoveredData) return null;

      const priceChange = hoveredData.y - yValues[yValues.length - 1];
      const priceChangePercent = yValues[yValues.length - 1]
        ? (priceChange / yValues[yValues.length - 1]) * 100
        : 0;

      return (
        <Paper px={14} py={2} radius="xs" className="tooltip">
          <Flex align="center" justify="start" mb={4} mt={6}>
            <IconClock size={18} />
            <Text component="div" ml={4}>
              {formatDate(hoveredData.x)}
            </Text>
          </Flex>
          <Divider mx={-14} color="dark.5" />
          <div style={{ padding: '0.25rem 0' }}>
            <Flex mb={{ base: 7 }} mt={{ md: 4, base: 7 }}>
              <AnimatedTickerDisplay
                price={hoveredData.y}
                priceChange={priceChange.toFixed(precision)}
                decimalPrecision={precision}
                priceChangePercent={priceChangePercent}
                darkModeEnabled
                priceFontSize={window.innerWidth <= 768 ? '30px' : '40px'}
                deltaAbsoluteFontSize="15px"
                deltaFontSize="18px"
                deltaIconFontSize="22px"
                noAnimation
                tooltipMode
              />
            </Flex>
            <Divider mx={-14} color="dark.5" />
            <Flex align="center" justify="start" mb={2} mt={6}>
              <IconChartBarPopular size={18} />
              <Text component="div" ml={4}>
                Volume 24h:{' '}
                {Number(hoveredData.volume.toFixed(2)).toLocaleString()}
              </Text>
            </Flex>
          </div>
        </Paper>
      );
    }, [hoveredData, yValues, precision, formatDate]);

    const RenderTooltip: React.FC<{ payload?: any[] }> = React.memo(
      ({ payload = [] }) => {
        handleTooltipUpdate(payload);
        return getTooltipContent();
      }
    );

    RenderTooltip.displayName = 'RenderTooltip';

    const RenderTrendlineLabel: React.FC<{ x: number; y: number }> = React.memo(
      ({ x, y }) => {
        const text = openPrice
          ? Number(openPrice.toFixed(precision)).toLocaleString(undefined, {
              minimumFractionDigits: precision
            })
          : '0.00';

        return (
          <g>
            <rect
              x={x + 50 - text.length * 4 - 10}
              y={y - 11}
              rx={10}
              ry={10}
              width={text.length * 8 + 20}
              height={21}
              fill="#FFF"
              stroke="#333"
              strokeOpacity={0.4}
            />
            <text
              x={x + 50}
              y={y + 4}
              fill="#333"
              fontSize="12"
              fillOpacity={0.9}
              fontWeight="bold"
              textAnchor="middle"
            >
              {text}
            </text>
          </g>
        );
      }
    );

    RenderTrendlineLabel.displayName = 'RenderTrendlineLabel';

    return (
      <Flex
        className="area-chart-wrapper"
        justify="space-between"
        style={{ zIndex: 2, paddingTop: '14px' }}
        h={{
          base: 'calc(100vh - 470px)',
          sm: 'calc(100vh - 470px)',
          md: 'calc(100vh - 420px)',
          xl: 'calc(100vh - 340px)'
        }}
        mih={300}
        direction="column"
      >
        <LoadingOverlay
          visible={loading}
          zIndex={2}
          transitionProps={{ duration: 200, timingFunction: 'ease' }}
          overlayProps={{
            radius: 'lg',
            blur: 0,
            mt: 20,
            bg: 'transparent'
          }}
          loaderProps={{
            size: 'xl',
            type: 'bars',
            mt: -40,
            color: 'rgba(255, 255, 255, 0.8)'
          }}
        />
        <Divider
          variant="dotted"
          label="Price"
          labelPosition="left"
          pl={28}
          color="dark.5"
        />
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart
            syncId="syncCharts"
            data={data}
            margin={{ top: 20, bottom: 20, right: 0 }}
          >
            <YAxis
              domain={[minYFromData, maxYFromData]}
              width={0}
              tickSize={0}
              tickMargin={10}
              mirror
              type="number"
              orientation="right"
              allowDecimals={false}
              axisLine={false}
              tickCount={6}
              tickFormatter={(v) =>
                Number(v.toFixed(precision)).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })
              }
              tick
            />
            <XAxis
              dataKey="x"
              height={0}
              tickSize={0}
              type="category"
              padding={{ left: 0 }}
              domain={[minXFromData, maxXFromData]}
              tickCount={5}
              tickMargin={20}
              axisLine={false}
              tickFormatter={(v) => formatDate(v)}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={activeDotColor}
                  stopOpacity={0.8}
                />
                <stop
                  offset="25%"
                  stopColor={activeDotColor}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={activeDotColor}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="rgba(255, 255, 255, 1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="25%"
                  stopColor="rgba(255, 255, 255, 1)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="rgba(255, 255, 255, 1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="natural"
              dataKey="y"
              isAnimationActive
              animationDuration={500}
              strokeWidth={2}
              activeDot={{
                r: 6,
                fill: 'rgba(255, 255, 255, 0.9)',
                strokeOpacity: 0
              }}
              strokeOpacity={0.8}
              stroke={activeDotColor}
              fill="url(#lineGradient)"
              dot={{ r: 0 }}
            />
            {openPrice && (
              <ReferenceLine
                y={openPrice}
                strokeDasharray="1"
                strokeWidth={1}
                stroke="rgba(255, 255, 255, 0.4)"
                label={({ viewBox }) => {
                  const { x, y } = viewBox as { x: number; y: number };
                  return <RenderTrendlineLabel x={x} y={y} />;
                }}
              />
            )}
            <Tooltip
              content={loading ? null : <RenderTooltip />}
              allowEscapeViewBox={{ x: false, y: false }}
              cursor={{
                strokeDasharray: '2 2',
                strokeWidth: 1,
                strokeOpacity: 0.6,
                stroke: 'white'
              }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <Divider
          variant="dotted"
          label="Volume"
          labelPosition="left"
          pl={28}
          color="dark.5"
        />
        {/* Volume Chart */}
        <ResponsiveContainer width="100%" height="15%">
          <AreaChart
            syncId="syncCharts"
            data={data}
            margin={{ top: 10, bottom: 0, right: 0, left: 0 }}
          >
            <XAxis
              dataKey="x"
              type="category"
              domain={[minXFromData, maxXFromData]}
              hide
            />
            <Area
              isAnimationActive
              animationDuration={500}
              dataKey="volume"
              type="natural"
              fill="url(#volumeGradient)"
              stroke="rgba(255, 255, 255, 0.3)"
            />
            <Tooltip
              content={null}
              cursor={{
                strokeDasharray: '2 2',
                strokeWidth: 1,
                strokeOpacity: 0.6,
                stroke: 'white'
              }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Flex>
    );
  }
);

Chart.displayName = 'Chart';
export default Chart;
