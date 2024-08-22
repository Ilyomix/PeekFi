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

interface ChartProps {
  interval: string;
  symbol: string;
}

interface DataPoint {
  payload?: { x: number; y: number };
  x: number;
  y: number;
}

const Chart: React.FC<ChartProps> = ({ interval, symbol }) => {
  const { data, loading } = UseCryptoKLine(symbol, interval) as unknown as {
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
    const intervalToShowTimeOnly = ['1s', '1m', '5m', '15m'];
    const intervalToShowDateOnly = ['1d', '3d', '1w', '1M'];
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

    return (
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
            price={hoveredDataRef.current.y}
            priceChange={priceChange}
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
    );
  }, [interval, yValues]);

  const RenderTooltip: React.FC<{ payload?: DataPoint[] }> = ({
    payload = []
  }) => {
    useEffect(() => {
      handleTooltipUpdate(payload);
    }, [payload]);

    return getTooltipContent();
  };

  return (
    <div
      className="area-chart-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ResponsiveContainer width="100%" height={600}>
        {!loading ? (
          <LineChart data={data} margin={{ top: 40, bottom: 20, right: 12 }}>
            <YAxis domain={[minYFromData, maxYFromData]} width={0} />
            <Line
              type="monotoneX"
              dataKey="y"
              stroke="rgba(255, 255, 255, 0.8)"
              animationDuration={250}
              animationEasing="ease"
              strokeWidth={2}
              activeDot={{ r: 0 }}
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
