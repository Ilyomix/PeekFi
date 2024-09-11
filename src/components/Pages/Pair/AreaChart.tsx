import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo
} from 'react';
import {
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  openPrice?: number;
  volume: number; // Added volume for the bar chart
  payload?: { x: number; y: number };
};

type ChartProps = {
  interval: string;
  symbol: string;
  precision: number;
  currentPrice?: number;
  deltaPercent?: number;
  loading: boolean;
  openPrice: number;
  deltaPositive: boolean;
  data: CandleData[]; // Add the 'data' property
};

type RenderTrendlineLabelProps = {
  x: number;
  y: number;
};

const Chart: React.FC<ChartProps> = ({
  interval,
  precision,
  data,
  loading,
  openPrice,
  deltaPercent,
  deltaPositive
}) => {
  const hoveredDataRef = useRef<DataPoint>({ x: 0, y: -1, volume: 0 });

  const yValues = data.map((d) => d.y);

  const minYFromData = useMemo(
    () => Math.min(openPrice, Math.min(...yValues)),
    [openPrice, yValues]
  );
  const maxYFromData = useMemo(
    () => Math.max(openPrice, Math.max(...yValues)),
    [openPrice, yValues]
  );

  const handleTooltipUpdate = useCallback((payload: DataPoint[]) => {
    if (payload.length > 0) {
      const { x, y, volume } = payload[0].payload as DataPoint;

      if (x !== undefined && y !== undefined) {
        hoveredDataRef.current = { x, y, volume };
      }
    }
  }, []);

  const getTooltipContent = useCallback(() => {
    const intervalToShowTimeOnly = ['1D'];
    const intervalToShowDateOnly = ['3M', '1Y', '5Y', 'Max'];
    const showDateTime = intervalToShowTimeOnly.includes(interval);
    const showDate = intervalToShowDateOnly.includes(interval);

    const priceChange = hoveredDataRef.current.y - yValues[yValues.length - 1];
    const priceChangePercent = yValues[yValues.length - 1]
      ? (priceChange / yValues[yValues.length - 1]) * 100
      : 0;

    return hoveredDataRef.current.y > 0 ? (
      <Paper px={14} py={2} radius="xs" className="tooltip">
        <Flex align="center" justify="start" mb={4} mt={6}>
          <IconClock size={18} />
          <Text component="div" ml={4}>
            {showDate
              ? new Date(hoveredDataRef.current.x).toLocaleDateString()
              : showDateTime
                ? new Date(hoveredDataRef.current.x).toLocaleTimeString()
                : new Date(hoveredDataRef.current.x).toLocaleString()}
          </Text>
        </Flex>
        <Divider
          mx={-14}
          color="light-dark(var(--mantine-color-gray-4), rgba(255, 255, 255, 0.1))"
        />
        <div style={{ padding: '0.25rem 0' }}>
          <Flex mb={{ base: 7 }} mt={{ md: 4, base: 7 }}>
            <AnimatedTickerDisplay
              price={hoveredDataRef.current.y}
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
          <Divider
            mx={-14}
            color="light-dark(var(--mantine-color-gray-4), rgba(255, 255, 255, 0.1))"
          />
          <Flex align="center" justify="start" mb={2} mt={6}>
            <IconChartBarPopular size={18} />

            <Text component="div" ml={4}>
              Volume 24h:{' '}
              {Number(
                hoveredDataRef.current.volume
                  ? hoveredDataRef.current.volume.toFixed(2)
                  : Number(0).toFixed(2)
              ).toLocaleString()}
            </Text>
          </Flex>
        </div>
      </Paper>
    ) : (
      <></>
    );
  }, [interval, precision, yValues]);

  const RenderTooltip: React.FC<{ payload?: DataPoint[] }> = React.memo(
    ({ payload = [] }) => {
      useEffect(() => {
        handleTooltipUpdate(payload);
      }, [payload]);

      return payload.length ? getTooltipContent() : <></>;
    }
  );

  RenderTooltip.displayName = 'RenderTooltip';

  const RenderTrendlineLabel: React.FC<RenderTrendlineLabelProps> = React.memo(
    ({ x, y }) => {
      const text = openPrice
        ? Number(openPrice.toFixed(precision)).toLocaleString(undefined, {
            minimumFractionDigits: precision
          })
        : '0.00';
      // The openPrice value to display
      const textWidth = text.length * 8; // Approximate width of each character (adjust for your font)
      const padding = 5; // Padding on each side of the text inside the pill
      const pillWidth = textWidth + 2 * padding; // Total width of the pill based on the text length

      return (
        <g>
          {/* Pill-shaped background */}
          <rect
            x={x - pillWidth / 2 + 50} // Center the pill background
            y={y - 11} // Adjust the y position to place it above the trendline
            rx={10} // Rounded corners for the pill shape
            ry={10}
            width={pillWidth} // Width of the pill background
            height={21} // Height of the pill background
            fill={'#FFF'} // Adapt background color for dark/light mode
            fillOpacity={0.9} // Opacity of the pill background
            stroke={'#333'} // Border of the pill, opposite color
            strokeOpacity={0.4}
          />
          {/* Text showing the openPrice value */}
          <text
            x={x + 50} // Center the text
            y={y + 4} // Adjust y position to center text inside the pill
            fill={'#333'} // Adapt text color for dark/light mode
            fontSize="12"
            fillOpacity={0.9}
            fontWeight="bold"
            textAnchor="middle" // Center the text horizontally
          >
            {text}
          </text>
        </g>
      );
    }
  );

  RenderTrendlineLabel.displayName = 'RenderTrendlineLabel';
  return (
    <>
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            syncId="syncCharts"
            data={data}
            margin={{ top: 20, bottom: 80 }}
          >
            <YAxis domain={[minYFromData, maxYFromData]} width={0} />
            <XAxis dataKey="x" hide />
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(31, 196, 147, 1)" />
                <stop offset="25%" stopColor="rgba(124, 234, 201, 1)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                <stop offset="80%" stopColor="rgba(255, 89, 89, 1)" />
                <stop offset="100%" stopColor="rgba(255, 71, 71, 1)" />
              </linearGradient>
            </defs>
            <Area
              type="monotoneX"
              dataKey="y"
              animationDuration={0}
              animateNewValues
              strokeWidth={2}
              activeDot={{
                r: 6,
                fill: 'rgba(255, 255, 255, 0.9)',
                strokeOpacity: 0
              }}
              strokeOpacity={0.8}
              stroke={
                deltaPercent !== 0
                  ? deltaPositive
                    ? 'url(#positiveGradient)'
                    : 'url(#negativeGradient)'
                  : 'rgba(0, 0, 0, 0)' // No fill when there's no change
              }
              fill={
                'rgba(0, 0, 0, 0)' // No fill when there's no change
              }
              dot={{ r: 0 }}
            />

            {!openPrice ? (
              <></>
            ) : (
              <ReferenceLine
                // @ts-expect-error y definition is not available in Recharts 2.x
                y={openPrice}
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.7)"
                label={({ viewBox }: React.SVGProps<SVGRectElement>) => {
                  const { x, y } = viewBox as React.SVGProps<SVGRectElement>;
                  return <RenderTrendlineLabel x={Number(x)} y={Number(y)} />;
                }}
              />
            )}
            <Tooltip
              content={loading ? <></> : <RenderTooltip />}
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

        {/* Volume Bar Chart */}
        <ResponsiveContainer
          width="100%"
          height="10%"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            bottom: 0
          }}
        >
          <BarChart
            syncId="syncCharts"
            data={data}
            margin={{ bottom: 0, left: -8, right: -8 }}
          >
            <XAxis dataKey="x" hide />
            <YAxis width={30} hide />
            <Bar
              isAnimationActive={false}
              dataKey="volume"
              fill="rgba(255, 255, 255, 0.3)"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Flex>
    </>
  );
};

Chart.displayName = 'Chart';
export default Chart;
