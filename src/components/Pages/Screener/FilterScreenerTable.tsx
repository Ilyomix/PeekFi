import React, { useMemo, useState } from 'react';
import { Button, Flex, Pill, Select, Text } from '@mantine/core';
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';
import useFetchFilterOptions from 'hooks/useFetchFilterOption';
import { IconSearch, IconX } from '@tabler/icons-react';

// Define the shape of data expected from the hook
interface FilterOption {
  id: string;
  name: string;
}

interface FilterComponentProps {
  resetPage: () => void; // Function to reset the current page
}

const FilterComponent: React.FC<FilterComponentProps> = ({ resetPage }) => {
  const { filterOptions } = useFetchFilterOptions(); // Cached after the first fetch
  const { setCategoryFilter, categoryFilter } = useScreenerDisplayPreferences();
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Selected filters (for rendering "pill" style badges)
  const selectedCategory = categoryFilter || null;
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return null;
    const selected = filterOptions?.categories.find(
      (cat: FilterOption) => cat.id === selectedCategory
    );
    return selected?.name || null;
  }, [selectedCategory, filterOptions?.categories]);

  // Safely access the data using memoization for better performance
  const categories = useMemo(
    () => filterOptions?.categories ?? [],
    [filterOptions?.categories]
  );

  const resetCategory = () => {
    setCategoryFilter(undefined);
    resetPage(); // Reset page
  };

  return (
    <Flex gap="md" align="center" pos="relative" direction="column">
      {/* Category Filter */}
      {selectedCategoryName ? (
        <Button
          color={selectedCategory ? 'teal' : 'gray'}
          className="hover-effect"
          onClick={resetCategory}
          style={{ cursor: 'pointer' }}
          radius="md"
          c="teal.6"
          variant="light"
          fz={14}
          py={2}
          fw={700}
          rightSection={<IconX size={14} />}
        >
          {selectedCategoryName}
        </Button>
      ) : (
        <>
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
            {isDropdownOpen || selectedCategoryName || searchValue
              ? ''
              : 'Search category'}
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
                group: searchValue
                  ? '🔎 Search results'
                  : '🔥 Popular categories',
                items: categories.map((cat: FilterOption) => ({
                  value: cat.id,
                  label: cat.name
                }))
              }
            ]}
            onSearchChange={(value) => setSearchValue(value)}
            value={selectedCategory ? selectedCategory : ''}
            onChange={(value) => {
              setCategoryFilter(value || undefined); // Update the category filter
              setSearchValue(''); // Clear the search field
              resetPage(); // Reset the current page to 1
            }}
            clearable
            searchable
            onDropdownOpen={() => setIsDropdownOpen(true)}
            onDropdownClose={() => setIsDropdownOpen(false)}
            withCheckIcon={false}
            nothingFoundMessage="No categories found"
            rightSection={<IconSearch size={14} />}
          />
        </>
      )}
    </Flex>
  );
};

export default FilterComponent;
