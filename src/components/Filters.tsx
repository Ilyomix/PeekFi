import React, { useState } from 'react';
import {
  Button,
  Container,
  Group,
  Text,
  Drawer,
  ActionIcon,
  ScrollArea,
  Divider,
  Flex,
  Title
} from '@mantine/core';
import { useFavoritesStore } from 'stores/useFavoritesStore';
import {
  IconFilterFilled,
  IconListDetails,
  IconTableRow,
  IconX
} from '@tabler/icons-react';
import 'assets/components/filter/filter.css';

interface FiltersProps {
  setFilter: (filter: string) => void;
  setItemsPerPage: (value: number) => void;
  setCardsPerRow: (value: number) => void;
  itemsPerPage: number;
  cardsPerRow: number;
}

type FilterButton = {
  value: string;
  label: string;
};

type ItemsPerPageButton = {
  value: number;
  label: string;
};

type CardsPerRowButton = {
  value: number;
  label: string;
};

const Filters: React.FC<FiltersProps> = ({
  setFilter,
  setItemsPerPage,
  setCardsPerRow,
  itemsPerPage,
  cardsPerRow
}) => {
  const [filter, setLocalFilter] = useState<string>('all');
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false); // State for managing drawer
  const favorites = useFavoritesStore((state) => state.favorites);

  const handleFilterChange = (value: string) => {
    setLocalFilter(value);
    setFilter(value);
  };

  const filterButtons: FilterButton[] = [
    { value: 'all', label: 'All' },
    { value: 'favorites', label: `Favorites (${favorites.length})` },
    { value: 'gainers', label: 'Top Gainers' },
    { value: 'losers', label: 'Top Losers' },
    { value: 'volume', label: 'High Volume' }
  ];

  const itemsPerPageButtons: ItemsPerPageButton[] = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];

  const cardsPerRowButtons: CardsPerRowButton[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' }
  ];

  const renderButtons = <T extends string | number>(
    buttons: { value: T; label: string }[],
    activeValue: T,
    onClick: (value: T) => void
  ) => (
    <>
      {buttons.map(({ value, label }) => (
        <Button
          key={value.toString()}
          className="filter-active"
          onClick={() => onClick(value)}
          variant={activeValue === value ? 'filled' : 'default'}
          radius="xl"
          size="xs"
          w="100%"
          m={2}
          c={activeValue === value ? 'var(--mantine-color-white)' : 'inherit'}
          color={`light-dark(var(--mantine-color-dark-8), ${
            activeValue === value
              ? 'var(--mantine-color-teal-8)'
              : 'var(--mantine-color-dark-4)'
          })`}
        >
          {label}
        </Button>
      ))}
    </>
  );

  const Section = <T extends string | number>({
    icon: Icon,
    label,
    buttons,
    activeValue,
    onClick
  }: {
    icon: React.ElementType;
    label: string;
    buttons: { value: T; label: string }[];
    activeValue: T;
    onClick: (value: T) => void;
  }) => (
    <Container p={0}>
      <Group gap={3} mr={0}>
        <Text
          component="div"
          display="flex"
          mr={2}
          size="md"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}
          fw={500}
        >
          <Icon component="div" size="14" style={{ marginRight: '7px' }} />{' '}
          {label}
        </Text>
      </Group>
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          gap: 'px',
          justifyContent: 'space-between'
        }}
      >
        {renderButtons(buttons, activeValue, onClick)}
      </div>
    </Container>
  );

  return (
    <>
      <Flex justify="end">
        <Button
          className="filter-active-neutral"
          component="div"
          leftSection={<IconFilterFilled size="14" />}
          variant="filled"
          onClick={() => setDrawerOpened(true)}
          radius="xl"
          size="xs"
          c="light-dark(var(--mantine-color-white), var(--mantine-color-black))"
          color="light-dark(var(--mantine-color-black), var(--mantine-color-white))"
          styles={(theme) => ({
            root: {
              '&:hover': {
                backgroundColor: theme.colors.gray[6]
              },
              color: theme.white
            }
          })}
        >
          Show Filters
        </Button>
      </Flex>
      <Divider my="md" />

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        padding="xl"
        position="right"
        size="xl"
        withCloseButton={false}
        styles={{
          header: {
            display: 'flex',
            justifyContent: 'space-between'
          }
        }}
      >
        <Flex p="apart" justify="space-between" align="center">
          <Title order={2} fw={700}>
            Filters preferences
          </Title>
          <ActionIcon
            size="md"
            variant="transparent"
            c="light-dark(var(--mantine-color-gray-9), var(--mantine-color-gray))"
            onClick={() => setDrawerOpened(false)}
          >
            <IconX size="32" />
          </ActionIcon>
        </Flex>
        <Divider my="md" />

        <ScrollArea
          style={{ height: '70vh', paddingTop: '1rem' }}
          type="scroll"
        >
          <Section
            icon={IconFilterFilled}
            label="Display"
            buttons={filterButtons}
            activeValue={filter}
            onClick={handleFilterChange}
          />
          <Section
            icon={IconListDetails}
            label="Items per Page"
            buttons={itemsPerPageButtons}
            activeValue={itemsPerPage}
            onClick={setItemsPerPage}
          />
          <Section
            icon={IconTableRow}
            label="Items per Row"
            buttons={cardsPerRowButtons}
            activeValue={cardsPerRow}
            onClick={setCardsPerRow}
          />
        </ScrollArea>
      </Drawer>
    </>
  );
};

export default Filters;
