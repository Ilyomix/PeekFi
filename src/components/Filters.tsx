import React, { useState, useEffect } from 'react';
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
  Title,
  Grid
} from '@mantine/core';
import {
  IconFilterFilled,
  IconListDetails,
  IconTableRow,
  IconX,
  IconArrowUp,
  IconArrowDown,
  IconRefresh
} from '@tabler/icons-react';
import 'assets/components/filter/filter.css';

interface FiltersProps {
  setFilter: (filter: string) => void;
  setItemsPerPage: (value: number) => void;
  setCardsPerRow: (value: number) => void;
  itemsPerPage: number;
  cardsPerRow: number;
  currentFilter: string;
}

type FilterButton = {
  value: string;
  label: string;
  icon: React.ReactNode;
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
  cardsPerRow,
  currentFilter
}) => {
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false); // State for managing drawer
  const [resetVisible, setResetVisible] = useState<boolean>(false); // State for Reset button visibility
  const [applyVisible, setApplyVisible] = useState<boolean>(false); // State for Apply/Cancel buttons visibility
  const [localFilter, setLocalFilter] = useState(currentFilter);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);
  const [localCardsPerRow, setLocalCardsPerRow] = useState(cardsPerRow);

  useEffect(() => {
    const hasChanged =
      localFilter !== currentFilter ||
      localItemsPerPage !== itemsPerPage ||
      localCardsPerRow !== cardsPerRow;

    setResetVisible(
      localFilter !== 'market_cap_desc' ||
        localItemsPerPage !== 25 ||
        localCardsPerRow !== 4
    );

    setApplyVisible(hasChanged);
  }, [
    localFilter,
    localItemsPerPage,
    localCardsPerRow,
    currentFilter,
    itemsPerPage,
    cardsPerRow
  ]);

  const handleReset = () => {
    setLocalFilter('market_cap_desc');
    setLocalItemsPerPage(25);
    setLocalCardsPerRow(4);
    setResetVisible(false);
    setApplyVisible(false);
  };

  const handleApplyFilters = () => {
    setFilter(localFilter);
    setItemsPerPage(localItemsPerPage);
    setCardsPerRow(localCardsPerRow);
    setDrawerOpened(false);
  };

  const handleCloseDrawer = () => {
    setDrawerOpened(false);
    // Reset local states to original values if the drawer is closed without applying changes
    setLocalFilter(currentFilter);
    setLocalItemsPerPage(itemsPerPage);
    setLocalCardsPerRow(cardsPerRow);
    setApplyVisible(false);
  };

  const filterButtons: FilterButton[] = [
    {
      value: 'market_cap_desc',
      label: 'Marketcap',
      icon: <IconArrowUp size={14} />
    },
    {
      value: 'market_cap_asc',
      label: 'Marketcap',
      icon: <IconArrowDown size={14} />
    },
    {
      value: 'volume_desc',
      label: 'Volume',
      icon: <IconArrowUp size={14} />
    },
    { value: 'volume_asc', label: 'Volume', icon: <IconArrowDown size={14} /> },
    { value: 'id_desc', label: 'ID', icon: <IconArrowUp size={14} /> },
    { value: 'id_asc', label: 'ID', icon: <IconArrowDown size={14} /> }
  ];

  const itemsPerPageButtons: ItemsPerPageButton[] = [
    { value: 12, label: '12' },
    { value: 25, label: '25' },
    { value: 50, label: '50' }
  ];

  const cardsPerRowButtons: CardsPerRowButton[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' }
  ];

  const renderButtons = <T extends string | number>(
    buttons: { value: T; label: string; icon?: React.ReactNode }[],
    activeValue: T,
    onClick: (value: T) => void
  ) => (
    <>
      {buttons.map(({ value, label, icon }) => (
        <Grid.Col
          key={value.toString()}
          span={{ base: 6, xs: 3, md: 4, lg: 3 }}
        >
          <Button
            className="filter-active"
            onClick={() => onClick(value)}
            variant={activeValue === value ? 'filled' : 'default'}
            radius="xl"
            size="xs"
            fullWidth
            m={8}
            mt={14}
            rightSection={icon}
            c={activeValue === value ? 'var(--mantine-color-white)' : 'inherit'}
            color={`light-dark(var(--mantine-color-dark-8), ${
              activeValue === value
                ? 'var(--mantine-color-teal-8)'
                : 'var(--mantine-color-dark-4)'
            })`}
          >
            {label}
          </Button>
        </Grid.Col>
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
    buttons: { value: T; label: string; icon?: React.ReactNode }[];
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
      <Grid
        style={{
          marginBottom: '2rem',
          display: 'flex',
          gap: '2px',
          justifyContent: 'space-between'
        }}
      >
        {renderButtons(buttons, activeValue, onClick)}
      </Grid>
    </Container>
  );

  return (
    <>
      <Flex justify="end">
        <Button
          className="filter-active-neutral"
          component="div"
          leftSection={<IconFilterFilled size={14} />}
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
        onClose={handleCloseDrawer} // Handle drawer close with resetting to original values
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
        <Flex
          p="apart"
          justify="space-between"
          align="center"
          style={{ width: '100%' }}
        >
          <Flex justify="start" align="center" gap="md">
            <Title order={2} fw={700}>
              Filters preferences
            </Title>
            {resetVisible && (
              <Button
                rightSection={<IconRefresh size={18} />}
                className="button-filter-neutral"
                variant="filled"
                onClick={handleReset}
                radius="xl"
                c="light-dark(var(--mantine-color-white), var(--mantine-color-black))"
                color="light-dark(var(--mantine-color-black), var(--mantine-color-white))"
                size="xs"
              >
                Reset to Defaults
              </Button>
            )}
          </Flex>
          <ActionIcon
            size="md"
            variant="transparent"
            c="light-dark(var(--mantine-color-gray-9), var(--mantine-color-gray))"
            onClick={handleCloseDrawer} // Handle close drawer with reset
          >
            <IconX size="32" />
          </ActionIcon>
        </Flex>
        <Divider my="md" />
        <Section
          icon={IconFilterFilled}
          label="Sort By"
          buttons={filterButtons}
          activeValue={localFilter}
          onClick={(value) => setLocalFilter(value)}
        />
        <Section
          icon={IconListDetails}
          label="Items per Page"
          buttons={itemsPerPageButtons}
          activeValue={localItemsPerPage}
          onClick={(value) => setLocalItemsPerPage(Number(value))}
        />
        <Section
          icon={IconTableRow}
          label="Items per Row"
          buttons={cardsPerRowButtons}
          activeValue={localCardsPerRow}
          onClick={(value) => setLocalCardsPerRow(Number(value))}
        />
        <Divider my="md" />
        <Flex justify="end" gap="sm">
          <Button
            variant="transparent"
            onClick={handleCloseDrawer} // Close without applying changes
            radius="xl"
            size="sm"
            color="light-dark(var(--mantine-color-black), var(--mantine-color-white)"
          >
            Cancel
          </Button>
          {applyVisible && (
            <Button
              variant="filled"
              onClick={handleApplyFilters} // Apply changes
              radius="xl"
              size="sm"
              color="teal"
            >
              Apply Filters
            </Button>
          )}
        </Flex>
      </Drawer>
    </>
  );
};

export default Filters;
