import React from 'react';
import { Button, Group } from '@mantine/core';
import useIntervalStore from 'stores/useIntervalStore'; // Import the store

const intervals = [
  '1m',
  '3m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '6h',
  '8h',
  '12h',
  '1d',
  '3d',
  '1w',
  '1M'
];

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
