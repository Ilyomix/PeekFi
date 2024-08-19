import React from 'react';
import UseCryptoKLine from 'hooks/useCryptoKline';
import {
  Line,
  LineChart,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Label,
  ReferenceLine
} from 'recharts';
import 'assets/components/areaCharts/index.css';

type ChartProps = {
  interval: string;
  symbol: string;
  openPrice: string;
};

const Chart: React.FC<ChartProps> = ({ interval, symbol, openPrice }) => {
  const { data, loading } = UseCryptoKLine(symbol, interval);

  const yValues = data.map((d) => d.y);

  // Trouver la valeur minimale et maximale dans `yValues`
  const minYFromData = Math.min(...yValues);
  const minY =
    Number(openPrice) < minYFromData ? Number(openPrice) : minYFromData;
  const maxYFromData = Math.max(...yValues);
  const maxY =
    Number(openPrice) > maxYFromData ? Number(openPrice) : maxYFromData;

  return (
    <div className="area-chart-wrapper">
      <ResponsiveContainer width="100%" height={600}>
        {!loading ? (
          <LineChart data={data} margin={{ top: 120, bottom: 120, right: 12 }}>
            <YAxis domain={[minY, maxY]} width={0} />
            <Line
              type="natural"
              dataKey="y"
              stroke="rgba(255, 255, 255, 0.8)"
              animationDuration={900}
              animationEasing="ease"
              strokeWidth={2}
              dot={(e) => <div key={e.index}></div>}
              style={{ marginLeft: '-2px' }}
            />
            <Tooltip />
            {/* Ajout du ReferenceDot pour la dernière valeur */}
            <ReferenceDot
              x={data.length - 1}
              y={data[data.length - 1].y}
              r={8}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={2}
              fill="rgba(255, 255, 255, 1)"
              className="fade-in"
            />
            {/* Ajout du ReferenceLine pour le minimum avec un label */}
            <ReferenceLine
              strokeDasharray="2 2 2"
              y={openPrice}
              stroke="white"
              isFront
            >
              <Label
                fill="rgba(255, 255, 255, 1)"
                content={() => (
                  <rect x="0" y="0" fill="black" rx="15" ry="15">
                    <text>{Number(openPrice)}</text>
                  </rect>
                )}
              ></Label>
            </ReferenceLine>
          </LineChart>
        ) : (
          <></>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
