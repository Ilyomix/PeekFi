import React from 'react';
import { Button, Grid } from '@mantine/core';
import useIntervalStore from 'stores/useIntervalStore';

const intervals = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'Max'];

interface IntervalSelectorProps {
  style?: React.CSSProperties;
}

const IntervalSelector: React.FC<IntervalSelectorProps> = ({ style }) => {
  const { selectedInterval, setSelectedInterval } = useIntervalStore();

  return (
    <Grid w="100%" maw={600} style={{ ...style }} px={{ base: 28 }} gutter="sm">
      {intervals.map((interval) => (
        <Grid.Col key={interval} span="auto">
          <Button
            fullWidth
            radius="xl"
            px={6}
            variant={selectedInterval === interval ? 'filled' : 'light'}
            fw={selectedInterval === interval ? 700 : 'normal'}
            style={{
              pointerEvents: selectedInterval === interval ? 'none' : 'auto'
            }}
            c={selectedInterval === interval ? 'black' : 'white'}
            color={selectedInterval === interval ? 'white' : 'gray'}
            onClick={() => setSelectedInterval(interval)}
          >
            {interval}
          </Button>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default IntervalSelector;
