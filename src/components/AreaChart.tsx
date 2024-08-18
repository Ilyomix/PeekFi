import React from 'react';
import UseCryptoKLine from 'hooks/useCryptoKline';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Container } from '@mantine/core';
import 'assets/components/areaCharts/index.css';

type ChartProps = {
  interval: string;
  symbol: string;
};

const Chart: React.FC<ChartProps> = ({ interval, symbol }) => {
  const { data, loading, error } = UseCryptoKLine(symbol, interval);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const yValues = data.map((d) => d.y);

  // Trouver la valeur minimale et maximale dans `yValues`
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return (
    <>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={data}>
          <YAxis domain={[minY, maxY]} width={0} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#ffffff"
            strokeWidth={2}
            style={{ marginLeft: '-2px' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;
