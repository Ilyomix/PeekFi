import React, { useMemo, useState } from 'react';
import { Flex, Pill, rem, Select, Text } from '@mantine/core';
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';
import useFetchFilterOptions from 'hooks/useFetchFilterOption';
import { IconChevronDown, IconSearch, IconX } from '@tabler/icons-react';
import { color } from 'framer-motion';

// Define the shape of data expected from the hook
interface FilterOption {
  id: string;
  name: string;
}

const FilterComponent: React.FC = () => {
  const { filterOptions } = useFetchFilterOptions(); // Cached after the first fetch

  const { setCategoryFilter, categoryFilter } = useScreenerDisplayPreferences();
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Selected filters (for rendering "pill" style badges)
  const selectedCategory = categoryFilter || null;

  // Safely access the data using memoization for better performance
  const categories = useMemo(
    () => filterOptions?.categories ?? [],
    [filterOptions?.categories]
  );

  return (
    <Flex gap="md" align="center" pos="relative" direction="column">
      {/* Category Filter */}
      <Text
        display="flex"
        size="sm"
        top={8}
        left={10}
        component="div"
        pos="absolute"
        w="100%"
        style={{ zIndex: 1, pointerEvents: 'none' }}
      >
        {isDropdownOpen || searchValue ? '' : 'Search Category'}
      </Text>
      <Select
        radius="md"
        inputSize="15"
        size="sm"
        limit={100}
        comboboxProps={{
          width: 300,
          position: 'bottom-start',
          radius: 'md',
          shadow: 'md'
        }}
        variant="filled"
        data={[
          {
            group: searchValue ? '🔎 Search results' : '🔥 Popular categories',
            items: categories.map((cat: FilterOption) => ({
              value: cat.id,
              label: cat.name
            }))
          }
        ]}
        onSearchChange={(value) => setSearchValue(value)}
        value={selectedCategory ? selectedCategory : ''}
        onChange={(value) => setCategoryFilter(value || undefined)}
        clearable
        searchable
        onDropdownOpen={() => setIsDropdownOpen(true)}
        onDropdownClose={() => setIsDropdownOpen(false)}
        withCheckIcon={false}
        nothingFoundMessage="No categories found"
      />
    </Flex>
  );
};

export default FilterComponent;
