import React, { memo, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import PageTransition from 'components/PageTransition';

type BackgroundChartProps = {
  cryptoId: string;
  delta: string | null;
  sparkline: number[]; // Pass sparkline data here
};

const getColorClass = (value: string | null) => {
  const parsedValue = parseFloat(value as string);
  if (parsedValue === 0 || !value) return 'var(--mantine-color-gray-text)';
  return parsedValue > 0
    ? 'var(--mantine-color-green-5)'
    : 'var(--mantine-color-red-6)';
};

const BackgroundChart: React.FC<BackgroundChartProps> = memo(
  ({ cryptoId, delta, sparkline }) => {
    // Prepare chart data
    const chartData = useMemo(
      () => [
        {
          id: cryptoId,
          data: sparkline.map((price, index) => ({
            x: index.toString(),
            y: price
          }))
        }
      ],
      [cryptoId, sparkline]
    );

    const lineColor = useMemo(() => getColorClass(delta), [delta]);
    if (!sparkline.length) return null;

    return (
      <PageTransition duration={0.75}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          }}
        >
          <ResponsiveLine
            data={chartData}
            margin={{ top: 28, right: 0, bottom: 38, left: 0 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            lineWidth={0}
            axisBottom={null}
            axisLeft={null}
            isInteractive={false}
            curve="natural"
            enableArea
            animate
            pointSize={50}
            enablePoints={false}
            enableGridX={false}
            enableGridY={false}
            useMesh={true}
            colors={[lineColor]}
            tooltip={({ point }) => (
              <div
                style={{
                  background: '#fff',
                  padding: '5px',
                  borderRadius: '3px'
                }}
              >
                <strong>{point.data.xFormatted}</strong>:{' '}
                {point.data.yFormatted}
              </div>
            )}
          />
        </div>
      </PageTransition>
    );
  }
);

BackgroundChart.displayName = 'BackgroundChart';

export default BackgroundChart;
