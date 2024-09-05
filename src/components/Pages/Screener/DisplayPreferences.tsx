import { Flex, rem, Select } from '@mantine/core';
import { IconList } from '@tabler/icons-react';
import { useScreenerDisplayPreferences } from 'stores/useScreenerDisplayPreferences';

const DisplayPreferences = () => {
  const itemsPerPages = ['10', '20', '50', '100', '200'];
  const { itemsPerPage, setItemsPerPage } = useScreenerDisplayPreferences();

  const handleItemsPerPage = (value: string) => {
    console.log(value);
    setItemsPerPage(Number(value));
  };

  return (
    <Flex justify="end" align="center" gap="sm">
      <Flex fz={12} align="center" gap={4}>
        {' '}
        <IconList size={14} /> Number rows
      </Flex>
      <Select
        comboboxProps={{ radius: 'md', shadow: 'md' }}
        data={itemsPerPages}
        value={itemsPerPage.toString()}
        onChange={(value) => handleItemsPerPage(value as string)}
        checkIconPosition="right"
        radius="md"
        variant="filled"
        maw={75}
        size="xs"
      />
    </Flex>
  );
};

export default DisplayPreferences;
