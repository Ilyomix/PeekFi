import React, { memo, useMemo } from 'react';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import PageTransition from 'components/PageTransition';

type BackgroundChartProps = {
  cryptoId: string;
  delta: string | null;
  sparkline: number[]; // Pass sparkline data here
};

const BackgroundChart: React.FC<BackgroundChartProps> = memo(
  ({ delta, sparkline }) => {
    // Prepare chart data
    const chartData = useMemo(
      () =>
        sparkline.map((price, index) => ({
          x: index.toString(),
          y: price
        })),
      [sparkline]
    );

    const getColorClass = (value: string | null) => {
      const parsedValue = parseFloat(value as string);
      if (parsedValue === 0 || !value) return 'var(--mantine-color-gray-text)';
      return parsedValue > 0 ? '#50B498' : '#FF4C4C';
    };

    // Calculate the Y domain based on the data
    const yDomain = [
      (dataMin: number) => Math.min(dataMin, Math.min(...sparkline)), // Minimum value in the sparkline
      (dataMax: number) => Math.max(dataMax, Math.max(...sparkline)) // Maximum value in the sparkline
    ];

    return (
      <PageTransition duration={0.75}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            width: '100%',
            zIndex: 0
          }}
        >
          <ResponsiveContainer width="100%">
            <AreaChart margin={{ bottom: -1, top: 30 }} data={chartData}>
              <XAxis dataKey="x" hide />
              <YAxis
                // @ts-expect-error domain definition is not available in Recharts 2.x
                domain={yDomain}
                hide
              />
              <Area
                type="monotone"
                dataKey="y"
                stroke={getColorClass(delta)}
                fillOpacity={0.1}
                fill={getColorClass(delta)}
                strokeOpacity={0}
                strokeWidth={1}
                isAnimationActive={true}
                animationDuration={250}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </PageTransition>
    );
  }
);

BackgroundChart.displayName = 'BackgroundChart';

export default BackgroundChart;
