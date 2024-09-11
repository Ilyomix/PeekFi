import React from 'react';
import { Button, Grid } from '@mantine/core';
import useIntervalStore from 'stores/useIntervalStore';

const intervals = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'Max'];

interface IntervalSelectorProps {
  style?: React.CSSProperties;
}

const IntervalSelector: React.FC<IntervalSelectorProps> = ({ style }) => {
  const { selectedInterval, setSelectedInterval } = useIntervalStore();

  return (
    <Grid
      grow
      w="100%"
      style={style}
      px={{ base: 28 }}
      gutter="xs"
      justify="center"
      align="center"
    >
      {intervals.map((interval) => (
        <Grid.Col
          span={{ lg: 1, md: 1, sm: 1, xs: 1, base: 2 }} // Takes half the width on small screens
          key={interval}
        >
          <Button
            fullWidth
            radius="xl"
            variant={selectedInterval === interval ? 'filled' : 'light'}
            color={
              selectedInterval === interval
                ? 'rgba(0, 0, 0, 0.5)'
                : 'rgba(255, 255, 255, 0.8)'
            }
            style={{
              border:
                selectedInterval === interval
                  ? '1px solid rgba(255, 255, 255, 0.2)'
                  : 'none'
            }}
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
