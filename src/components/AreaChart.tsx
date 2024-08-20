import React, { useState, useCallback, useRef, useEffect } from 'react';
import UseCryptoKLine from 'hooks/useCryptoKline';
import {
  Line,
  LineChart,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import 'assets/components/areaCharts/index.css';
import { AnimatedTickerDisplay } from 'components/AnimatedTickerDisplay';
import { Paper, Text } from '@mantine/core';

type ChartProps = {
  interval: string;
  symbol: string;
};

const Chart: React.FC<ChartProps> = ({ interval, symbol }) => {
  const { data, loading } = UseCryptoKLine(symbol, interval);
  const [tooltipVisibility, setTooltipVisibility] = useState(false);
  const [hoveredData, setHoveredData] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });

  // Ref to track previous hovered data
  const prevHoveredDataRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const yValues = data.map((d) => d.y);

  const minYFromData = Math.min(...yValues);
  const maxYFromData = Math.max(...yValues);

  const handleMouseEnter = useCallback(() => {
    setTooltipVisibility(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipVisibility(false);
    setHoveredData({ x: 0, y: 0 });
  }, []);

  // Update the hovered data state outside of the render phase
  useEffect(() => {
    if (
      prevHoveredDataRef.current.x !== hoveredData.x ||
      prevHoveredDataRef.current.y !== hoveredData.y
    ) {
      setHoveredData({
        x: prevHoveredDataRef.current.x,
        y: prevHoveredDataRef.current.y
      });
    }
  }, [prevHoveredDataRef.current]);

  const RenderTooltip = useCallback(
    (callback: any) => {
      const { payload } = callback;

      if (payload && payload.length) {
        const payloadContent = payload[0]?.payload;
        const { x } = payloadContent || {};
        const getDataByDate = data.find((value) => value.x === x);

        if (
          getDataByDate &&
          (getDataByDate.x !== prevHoveredDataRef.current.x ||
            getDataByDate.y !== prevHoveredDataRef.current.y)
        ) {
          // Update the ref with the new hovered data
          prevHoveredDataRef.current = {
            x: getDataByDate.x,
            y: getDataByDate.y
          };
        }
      }

      const intervalToShowTimeOnly = ['1s', '1m', '5m', '15m'];
      const intervalToShowDateOnly = ['1d', '3d', '1w', '1M'];

      const showDateTime = intervalToShowTimeOnly.includes(interval) || false;
      const showDate = intervalToShowDateOnly.includes(interval) || false;

      return (
        <Paper
          p={14}
          radius="lg"
          c="var(--mantine-color-black-text)"
          className="tooltip"
        >
          <Text c="var(--mantine-color-white-text)">
            {!showDate
              ? showDateTime
                ? new Date(hoveredData.x).toLocaleTimeString()
                : new Date(hoveredData.x).toLocaleString()
              : new Date(hoveredData.x).toLocaleDateString()}
          </Text>
          <div>
            <AnimatedTickerDisplay
              price={hoveredData.y}
              priceChange={yValues[yValues.length - 1] - hoveredData.y}
              priceChangePercent={
                ((yValues[yValues.length - 1] - hoveredData.y) /
                  hoveredData.y) *
                100
              }
              darkModeEnabled
              priceFontSize="32px"
              deltaFontSize="16px"
              deltaIconFontSize="14px"
              deltaMention="Change with current:"
            />
          </div>
        </Paper>
      );
    },
    [hoveredData.y, yValues.length]
  );

  return (
    <div
      className="area-chart-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ResponsiveContainer width="100%" height={600}>
        {!loading ? (
          <LineChart data={data} margin={{ top: 80, bottom: 20, right: 12 }}>
            <YAxis domain={[minYFromData, maxYFromData]} width={0} />
            <Line
              type="natural"
              dataKey="y"
              stroke="rgba(255, 255, 255, 0.8)"
              animationDuration={250}
              animationEasing="ease"
              strokeWidth={2}
              dot={(e) => <div key={e.index}></div>}
              style={{ marginLeft: '-2px' }}
            />
            <Tooltip
              content={RenderTooltip}
              allowEscapeViewBox={{ x: false }}
              animationDuration={100}
              active={tooltipVisibility ? true : false}
            />
            <ReferenceDot
              x={data.length - 1}
              y={data[data.length - 1].y}
              r={8}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={2}
              fill="rgba(255, 255, 255, 1)"
              className="fade-in"
            />
          </LineChart>
        ) : (
          <></>
        )}
      </ResponsiveContainer>
    </div>
  );
};

Chart.displayName = 'Chart';

export default Chart;
