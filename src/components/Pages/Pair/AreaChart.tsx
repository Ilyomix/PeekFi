import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  ReferenceLine,
  ReferenceDot,
  Label
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
  totalVolume: number;
  data: CandleData[];
};

const Chart: React.FC<ChartProps> = React.memo(
  ({
    interval,
    precision,
    data,
    loading,
    activeDotColor,
    openPrice,
    totalVolume
  }) => {
    const hoveredData = useRef<DataPoint | null>(null);
    const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

    const xValues = useMemo(() => data.map((d) => d.x), [data]);
    const yValues = useMemo(() => data.map((d) => d.y), [data]);

    // Find the max and min values and their corresponding data points
    const maxY = useMemo(() => Math.max(...yValues), [yValues]);
    const minY = useMemo(() => Math.min(...yValues), [yValues]);

    const maxYDataPoint = useMemo(
      () => data.find((d) => d.y === maxY),
      [data, maxY]
    );
    const minYDataPoint = useMemo(
      () => data.find((d) => d.y === minY),
      [data, minY]
    );

    // Determine date formatting based on interval
    const formatDate = useCallback(
      (date: number) => {
        const dt = new Date(date);
        switch (interval) {
          case '1m':
          case '5m':
          case '15m':
          case '30m':
          case '1h':
            // Show time for shorter intervals
            return dt.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            });
          case '4h':
          case '1D':
            // Show date and time
            return dt.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          case '1W':
          case '1M':
          case '3M':
          case '6M':
          case '1Y':
          case '5Y':
          case 'Max':
            // Show date for longer intervals
            return dt.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          default:
            return dt.toLocaleString();
        }
      },
      [interval]
    );

    const minXFromData = useMemo(() => Math.min(...xValues), [xValues]);
    const maxXFromData = useMemo(() => Math.max(...xValues), [xValues]);

    const minYFromData = useMemo(
      () => Math.min(openPrice, minY),
      [openPrice, minY]
    );
    const maxYFromData = useMemo(
      () => Math.max(openPrice, maxY),
      [openPrice, maxY]
    );

    const handleTooltipUpdate = useCallback((payload: any[]) => {
      if (payload.length > 0) {
        const { x, y, volume } = payload[0].payload as DataPoint;
        hoveredData.current = { x, y, volume };
      } else {
        hoveredData.current = null;
      }
    }, []);

    const getTooltipContent = useCallback(() => {
      if (!hoveredData.current) return null;

      const priceChange = hoveredData.current.y - yValues[yValues.length - 1];
      const priceChangePercent = yValues[yValues.length - 1]
        ? (priceChange / yValues[yValues.length - 1]) * 100
        : 0;

      return (
        <Paper px={14} py={2} radius="xs" className="tooltip">
          <Flex align="center" justify="start" mb={4} mt={6}>
            <IconClock size={18} />
            <Text component="div" ml={4}>
              {formatDate(hoveredData.current.x)}
            </Text>
          </Flex>
          <Divider mx={-14} color="dark.5" opacity={0.4} />
          <div style={{ padding: '0.25rem 0' }}>
            <Flex mb={{ base: 7 }} mt={{ md: 4, base: 7 }}>
              <AnimatedTickerDisplay
                price={hoveredData.current.y}
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
            <Divider mx={-14} color="dark.5" opacity={0.4} />
            <Flex align="center" justify="start" mb={2} mt={6}>
              <IconChartBarPopular size={18} />
              <Text component="div" ml={4}>
                Volume 24h:{' '}
                {Number(hoveredData.current.volume.toFixed(2)).toLocaleString()}
              </Text>
            </Flex>
          </div>
        </Paper>
      );
    }, [hoveredData, yValues, precision, formatDate]);

    const RenderTooltip: React.FC<{ payload?: unknown[] }> = React.memo(
      ({ payload = [] }) => {
        handleTooltipUpdate(payload);
        return getTooltipContent();
      }
    );

    RenderTooltip.displayName = 'RenderTooltip';

    const CustomLabel = ({
      value = '',
      viewBox = { x: 0, y: 0, width: 300, height: 100 }, // Fallback default for viewBox
      position = 'insideBottom',
      fontSize = 14
    }) => {
      // Approximate character width ratio (adjust as needed)
      const characterWidthRatio = 0.9;
      const labelWidth = value.length * fontSize * characterWidthRatio;
      const { width } = chartSize;
      // Ensure the label stays within the left and right boundaries
      let adjustedX = viewBox.x;
      const x = Math.ceil(viewBox.x);
      // Use a fallback width in case viewBox.width is 0

      // Check if the label overflows to the left side
      if (x - labelWidth / 2 <= 0) {
        adjustedX = x + labelWidth / 2 - 15; // Shift right to prevent left overflow
      }
      // Check if the label overflows to the right side
      if (x + labelWidth / 2 >= width) {
        adjustedX = x - labelWidth / 2 + 20; // Shift left to prevent right overflow
      }
      // Adjust y position based on the position ('insideTop' or 'insideBottom')
      let adjustedY = viewBox.y;
      if (position === 'insideTop') {
        adjustedY = viewBox.y - 12; // Inside top with padding
      } else if (position === 'insideBottom') {
        adjustedY = viewBox.y + 25; // Inside bottom with padding
      }

      return (
        <text
          x={adjustedX}
          y={adjustedY}
          fill="#fff"
          opacity={0.7}
          fontSize={fontSize}
          fontWeight="bold"
          textAnchor="middle"
        >
          {value.toLocaleString()}
        </text>
      );
    };

    const handleResize = (width: number, height: number) => {
      setChartSize({ width, height });
    };

    return (
      <Flex
        className="area-chart-wrapper"
        justify="space-between"
        style={{ zIndex: 2, paddingTop: '14px' }}
        h={{
          base: '300',
          sm: '325',
          md: '350',
          xl: '400'
        }}
        mb={64}
        direction="column"
      >
        <LoadingOverlay
          visible={loading}
          zIndex={2}
          transitionProps={{ duration: 200, timingFunction: 'ease' }}
          overlayProps={{
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
          mt={16}
          variant="dotted"
          label={
            <Flex justify="center">
              <Text component="div" size="xs" c="dark.1" fw={400}>
                Open price:{' '}
                {Number(openPrice?.toFixed(precision)).toLocaleString()}
              </Text>
            </Flex>
          }
          labelPosition="left"
          pl={28}
          color="dark.5"
        />
        <ResponsiveContainer
          width="100%"
          height="80%"
          debounce={200}
          onResize={(width, height) => handleResize(width, height)}
        >
          <AreaChart
            syncId="syncCharts"
            data={data}
            margin={{ top: 30, bottom: 26, right: 28, left: 28 }}
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
              isAnimationActive={!loading}
              type="linear"
              dataKey="y"
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
                // @ts-expect-error - recharts types are incorrect
                y={openPrice}
                strokeDasharray="5 5"
                strokeWidth={1}
                stroke="rgba(255, 255, 255, 0.4)"
              />
            )}

            {/* Max Value Reference Dot */}
            {maxYDataPoint && (
              <ReferenceDot
                x={maxYDataPoint.x}
                y={maxYDataPoint.y}
                r={3}
                fill={activeDotColor}
                stroke="rgba(255, 255, 255, 0)"
                isFront
              >
                <Label
                  content={({ viewBox }) => (
                    <CustomLabel
                      // @ts-expect-error - recharts types are incorrect
                      viewBox={viewBox}
                      x={maxYDataPoint.x}
                      y={maxYDataPoint.y}
                      position="insideTop"
                      fontSize={12}
                      value={maxY.toLocaleString(undefined, {
                        minimumFractionDigits: precision,
                        maximumFractionDigits: precision
                      })}
                    />
                  )}
                />
              </ReferenceDot>
            )}

            {/* Min Value Reference Dot */}
            {minYDataPoint && (
              <ReferenceDot
                x={minYDataPoint.x}
                y={minYDataPoint.y}
                r={3}
                stroke="rgba(255, 255, 255, 0)"
                fill={activeDotColor}
                isFront
              >
                <Label
                  content={({ viewBox }) => (
                    <CustomLabel
                      // @ts-expect-error - recharts types are incorrect
                      viewBox={viewBox}
                      x={minYDataPoint.x}
                      y={minYDataPoint.y}
                      position="insideBottom"
                      fontSize={12}
                      value={minY.toLocaleString(undefined, {
                        minimumFractionDigits: precision,
                        maximumFractionDigits: precision
                      })}
                    />
                  )}
                />
              </ReferenceDot>
            )}

            <Tooltip
              content={<RenderTooltip />}
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
          mt={14}
          label={
            <Flex justify="center">
              <Text component="div" size="xs" c="dark.1" fw={400}>
                Total volume (24h):{' '}
                {totalVolume
                  ? Number(totalVolume.toFixed(2)).toLocaleString()
                  : Number('0.00').toLocaleString()}
              </Text>
            </Flex>
          }
          labelPosition="left"
          pl={28}
          color="dark.5"
        />
        {/* Volume Chart */}
        <ResponsiveContainer width="100%" height="20%">
          <AreaChart
            syncId="syncCharts"
            data={data}
            margin={{ top: 10, bottom: 0, right: 28, left: 28 }}
          >
            <XAxis
              dataKey="x"
              type="category"
              domain={[minXFromData, maxXFromData]}
              hide
            />
            <Area
              isAnimationActive={!loading}
              animationDuration={500}
              dataKey="volume"
              type="natural"
              fill="url(#volumeGradient)"
              stroke="rgba(255, 255, 255, 0.3)"
            />
            <Tooltip
              content={<></>}
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
