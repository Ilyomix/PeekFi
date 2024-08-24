import React from 'react';
import { Button, Group } from '@mantine/core';
import useIntervalStore from 'stores/useIntervalStore'; // Import the store

const intervals = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'Max'];

const IntervalSelector: React.FC = () => {
  const { selectedInterval, setSelectedInterval } = useIntervalStore();

  return (
    <Group gap="xs" w="100%" px={28} pt={14} justify="center" grow>
      {intervals.map((interval) => (
        <Button
          key={interval}
          radius="xl"
          variant={selectedInterval === interval ? 'filled' : 'light'}
          color={
            selectedInterval === interval
              ? 'rgba(0, 0, 0, 0.6)'
              : 'rgba(255, 255, 255, 0.8)'
          }
          onClick={() => setSelectedInterval(interval)}
        >
          {interval}
        </Button>
      ))}
    </Group>
  );
};

export default IntervalSelector;
