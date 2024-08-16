import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import useCryptoData from 'hooks/useCryptoData';
import PageTransition from './PageTransition';

type BackgroundChartProps = {
  cryptoId: string;
  delta: string | null;
};

const getColorClass = (value: string | null) => {
  const parsedValue = parseFloat(value as string);
  if (parsedValue === 0 || !value) return 'var(--mantine-color-gray-text)';
  return parsedValue > 0
    ? 'var(--mantine-color-green-5)'
    : 'var(--mantine-color-red-6)';
};

const BackgroundChart: React.FC<BackgroundChartProps> = ({
  cryptoId,
  delta
}) => {
  const { data, loading, error } = useCryptoData(cryptoId);

  if (loading) return <></>;
  if (error) return <></>;

  const chartData = [
    {
      id: cryptoId,
      data
    }
  ];

  return (
    <PageTransition>
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
          enablePoints={false}
          enableGridX={false}
          enableGridY={false}
          useMesh={true}
          colors={[getColorClass(delta)]}
          // tooltip={({ point }) => (
          //   <div
          //     style={{
          //       background: '#fff',
          //       padding: '5px',
          //       borderRadius: '3px'
          //     }}
          //   >
          //     <strong>{point.data.xFormatted}</strong>: {point.data.yFormatted}
          //   </div>
          // )}
        />
      </div>
    </PageTransition>
  );
};

export default BackgroundChart;
