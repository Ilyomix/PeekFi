import React, { useState, useCallback, useRef, useEffect } from 'react';
import UseCryptoKLine from 'hooks/useCryptoKline';
import {
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import 'assets/components/areaCharts/index.css';
import { AnimatedTickerDisplay } from 'components/AnimatedTickerDisplay';
import { Paper, Text } from '@mantine/core';

interface ChartProps {
  interval: string;
  symbol: string;
  precision: number;
  baseline: number;
  deltaPositive: boolean;
}

interface DataPoint {
  payload?: { x: number; y: number };
  x: number;
  y: number;
}

const Chart: React.FC<ChartProps> = ({
  interval,
  symbol,
  precision,
  baseline,
  deltaPositive
}) => {
  const { data, loading } = UseCryptoKLine(
    symbol,
    'usd',
    interval
  ) as unknown as {
    data: DataPoint[];
    loading: boolean;
  };

  const [tooltipVisibility, setTooltipVisibility] = useState(false);
  const [hoveredData, setHoveredData] = useState<DataPoint>({ x: 0, y: -1 });
  const hoveredDataRef = useRef<DataPoint>({ x: 0, y: -1 });

  const yValues = data.map((d) => d.y);
  const minYFromData = Math.min(...yValues);
  const maxYFromData = Math.max(...yValues);

  const handleMouseEnter = useCallback(() => setTooltipVisibility(true), []);
  const handleMouseLeave = useCallback(() => {
    setTooltipVisibility(false);
    setHoveredData({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (
      hoveredDataRef.current &&
      (hoveredDataRef.current.x !== hoveredData.x ||
        hoveredDataRef.current.y !== hoveredData.y)
    ) {
      setHoveredData(hoveredDataRef.current);
    }
  }, [hoveredData.x, hoveredData.y]);

  const handleTooltipUpdate = useCallback((payload: DataPoint[]) => {
    if (payload.length > 0) {
      const { x, y } = payload[0].payload as DataPoint;

      if (x !== undefined && y !== undefined) {
        hoveredDataRef.current = { x, y };
      }
    }
  }, []);

  useEffect(() => {
    const payload = hoveredDataRef.current;
    if (payload.x !== hoveredData.x || payload.y !== hoveredData.y) {
      setHoveredData(payload); // Mettre à jour si nécessaire
    }
  }, [hoveredData]);

  const getTooltipContent = useCallback(() => {
    const intervalToShowTimeOnly = ['1d'];
    const intervalToShowDateOnly = ['3M', '1Y', '5Y', 'Max'];
    const showDateTime = intervalToShowTimeOnly.includes(interval);
    const showDate = intervalToShowDateOnly.includes(interval);

    if (
      hoveredDataRef.current.x === undefined ||
      hoveredDataRef.current.y === undefined
    ) {
      return null;
    }

    const priceChange = hoveredDataRef.current.y - yValues[yValues.length - 1];
    const priceChangePercent = yValues[yValues.length - 1]
      ? (priceChange / yValues[yValues.length - 1]) * 100
      : 0;

    return hoveredDataRef.current.y > 0 ? (
      <Paper p={14} radius="lg" className="tooltip">
        <Text>
          {showDate
            ? new Date(hoveredDataRef.current.x).toLocaleDateString()
            : showDateTime
              ? new Date(hoveredDataRef.current.x).toLocaleTimeString()
              : new Date(hoveredDataRef.current.x).toLocaleString()}
        </Text>
        <div>
          <AnimatedTickerDisplay
            price={hoveredDataRef.current.y.toFixed(precision)}
            priceChange={priceChange.toFixed(precision)}
            priceChangePercent={priceChangePercent}
            darkModeEnabled
            priceFontSize="40px"
            deltaAbsoluteFontSize="15px"
            deltaFontSize="16px"
            deltaIconFontSize="22px"
            deltaMention="Change with current:"
            noAnimation
          />
        </div>
      </Paper>
    ) : (
      <></>
    );
  }, [interval, precision, yValues]);

  const RenderTooltip: React.FC<{ payload?: DataPoint[] }> = ({
    payload = []
  }) => {
    useEffect(() => {
      handleTooltipUpdate(payload);
    }, [payload]);

    return getTooltipContent();
  };

  const gradientOffset = () => {
    if (maxYFromData <= baseline) {
      return 0;
    }
    if (minYFromData >= baseline) {
      return 1;
    }

    return 1 - (baseline - minYFromData) / (maxYFromData - minYFromData);
  };
  const gradientOffsetValue = gradientOffset();

  return (
    <div
      className="area-chart-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ResponsiveContainer width="100%" height={600}>
        {!loading ? (
          <AreaChart data={data} margin={{ top: 40 }} width={500} height={400}>
            <YAxis domain={[minYFromData, maxYFromData]} width={0} />
            <defs>
              <linearGradient id="colorPriceChart" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset={gradientOffsetValue}
                  stopColor={
                    deltaPositive
                      ? 'rgba(12, 166, 120, 0.7)'
                      : 'rgba(0, 0, 0, 0.1)'
                  }
                  stopOpacity={1}
                />
                <stop
                  offset={gradientOffsetValue}
                  stopColor={
                    deltaPositive
                      ? 'rgba(0, 0, 0, 0.1)'
                      : 'rgba(240, 62, 62, 0.7)'
                  }
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotoneX"
              dataKey="y"
              stroke="rgba(255, 255, 255, 0.8)"
              animationDuration={1000}
              animationEasing="ease"
              strokeWidth={2}
              activeDot={{ r: 0 }}
              fill="url(#colorPriceChart)"
              dot={{ r: 0 }}
              style={{ marginLeft: '-2px' }}
            />
            <Tooltip
              content={<RenderTooltip />}
              allowEscapeViewBox={{ x: false }}
              position={{ y: 40 }}
              cursor={{ strokeWidth: 1, strokeOpacity: 1, stroke: 'white' }}
              animationDuration={100}
              active={tooltipVisibility}
            />
            <ReferenceDot
              x={data.length - 1}
              y={data[data.length - 1]?.y || 0}
              r={1}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={0}
              fill="rgba(255, 255, 255, 1)"
              className="fade-in"
            />
            <ReferenceLine y={baseline} stroke="white" strokeDasharray="3 3" />
          </AreaChart>
        ) : (
          <></>
        )}
      </ResponsiveContainer>
    </div>
  );
};

Chart.displayName = 'Chart';
export default Chart;
