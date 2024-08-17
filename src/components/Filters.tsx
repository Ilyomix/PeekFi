import React, { useState } from 'react';
import { Button, Group, rem, Text } from '@mantine/core';
import { useFavoritesStore } from 'stores/useFavoritesStore';
import { IconFilterFilled } from '@tabler/icons-react';
import 'assets/components/filter/filter.css';

interface FiltersProps {
  setFilter: (filter: string) => void;
  setItemsPerPage: (value: number) => void;
  setCardsPerRow: (value: number) => void;
  itemsPerPage: number;
  cardsPerRow: number;
}

const Filters: React.FC<FiltersProps> = ({
  setFilter,
  setItemsPerPage,
  setCardsPerRow,
  itemsPerPage,
  cardsPerRow
}) => {
  const [filter, setLocalFilter] = useState<string>('all');
  const favorites = useFavoritesStore((state) => state.favorites);

  const handleFilterChange = (value: string) => {
    setLocalFilter(value);
    setFilter(value);
  };

  const filterButtons = [
    { value: 'all', label: 'All' },
    { value: 'favorites', label: `Favorites (${favorites.length})` },
    { value: 'gainers', label: 'Top Gainers' },
    { value: 'losers', label: 'Top Losers' },
    { value: 'volume', label: 'High Volume' }
  ];

  const itemsPerPageButtons = [25, 50, 100];
  const cardsPerRowButtons = [1, 2, 3, 4, 5];

  return (
    <div className="filters" style={{ paddingBottom: rem(28) }}>
      <Group gap="xs" pt={rem(14)} display="flex" justify="start">
        <Group gap={3} mr={14}>
          <IconFilterFilled size="18" />
          <Text fw={500}>Filter</Text>
        </Group>
        {filterButtons.map(({ value, label }) => (
          <Button
            key={value}
            className={filter === value ? 'filter-active' : ''}
            onClick={() => handleFilterChange(value)}
            variant={filter === value ? 'filled' : 'default'}
            radius="xl"
            size="sm"
            c={filter === value ? 'var(--mantine-color-white)' : 'inherit'}
            color={`light-dark(var(--mantine-color-dark-8), ${
              filter === value
                ? 'var(--mantine-color-yellow-8)'
                : 'var(--mantine-color-dark-4)'
            })`}
          >
            {label}
          </Button>
        ))}
      </Group>
      <Group gap="xs" pt={rem(14)} display="flex" justify="start">
        <Text fw={500}>Items per Page</Text>
        {itemsPerPageButtons.map((value) => (
          <Button
            key={value}
            onClick={() => setItemsPerPage(value)}
            variant={itemsPerPage === value ? 'filled' : 'default'}
            radius="xl"
            size="sm"
            c={
              itemsPerPage === value ? 'var(--mantine-color-white)' : 'inherit'
            }
            color={`light-dark(var(--mantine-color-dark-8), ${
              itemsPerPage === value
                ? 'var(--mantine-color-yellow-8)'
                : 'var(--mantine-color-dark-4)'
            })`}
          >
            {value}
          </Button>
        ))}
      </Group>
      <Group gap="xs" pt={rem(14)} display="flex" justify="start">
        <Text fw={500}>Cards per Row</Text>
        {cardsPerRowButtons.map((value) => (
          <Button
            key={value}
            onClick={() => setCardsPerRow(value)}
            variant={cardsPerRow === value ? 'filled' : 'default'}
            radius="xl"
            size="sm"
            c={cardsPerRow === value ? 'var(--mantine-color-white)' : 'inherit'}
            color={`light-dark(var(--mantine-color-dark-8), ${
              cardsPerRow === value
                ? 'var(--mantine-color-yellow-8)'
                : 'var(--mantine-color-dark-4)'
            })`}
          >
            {value}
          </Button>
        ))}
      </Group>
    </div>
  );
};

export default Filters;
