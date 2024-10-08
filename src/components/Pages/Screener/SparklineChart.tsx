import PageTransition from 'components/App/PageTransition';
import React, { memo, useMemo } from 'react';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

type SparklineChartProps = {
  delta: string | null;
  sparkline: number[]; // Pass sparkline data here, already reduced if necessary
};

export const SparklineChart: React.FC<SparklineChartProps> = memo(
  ({ delta, sparkline }) => {
    // Reduce the number of points if the dataset is large
    const reduceData = (data: number[], maxPoints: number = 25) => {
      const interval = Math.ceil(data.length / maxPoints);
      return data.filter((_, index) => index % interval === 0);
    };

    // Prepare chart data using useMemo for memoization
    const chartData = useMemo(() => {
      const reducedSparkline = reduceData(sparkline);
      return reducedSparkline.map((price, index) => ({
        x: index.toString(),
        y: price
      }));
    }, [sparkline]);

    const getColorClass = useMemo(() => {
      const parsedValue = parseFloat(delta as string);
      if (parsedValue === 0 || !delta) return 'var(--mantine-color-gray-text)';
      return parsedValue > 0
        ? 'var(--mantine-color-teal-6)'
        : 'var(--mantine-color-red-6)';
    }, [delta]);

    // Calculate the Y domain based on the reduced data
    const yDomain = useMemo(
      () => [
        (dataMin: number) => Math.min(dataMin, Math.min(...sparkline)), // Using original sparkline for domain calculation
        (dataMax: number) => Math.max(dataMax, Math.max(...sparkline))
      ],
      [sparkline]
    );

    return (
      <PageTransition>
        <ResponsiveContainer width="100%" height={40}>
          <AreaChart
            margin={{ bottom: 0 }}
            data={chartData}
            style={{ borderRadius: '0 0 2px 2px', overflow: 'hidden' }}
          >
            <XAxis dataKey="x" hide />
            <YAxis
              // @ts-expect-error domain definition is not available in Recharts 2.x
              domain={yDomain}
              hide
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke={getColorClass}
              fillOpacity={0.2}
              fill={getColorClass}
              isAnimationActive={false}
              strokeOpacity={1}
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </PageTransition>
    );
  }
);

SparklineChart.displayName = 'SparklineChart';

export default SparklineChart;
