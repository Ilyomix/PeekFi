import React from 'react';
import { Table, Skeleton, Flex, ScrollArea } from '@mantine/core';
import classes from 'assets/app/screener.module.css';

interface TableSkeletonProps {
  itemsPerPage?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  itemsPerPage = 100
}) => {
  const rows = Array.from({ length: itemsPerPage }, (_, index) => (
    <Table.Tr key={index} className={classes.tableCell}>
      <Table.Td>
        <Skeleton height={20} width={20} />
      </Table.Td>
      <Table.Td width={200}>
        <Flex align="center">
          <Skeleton circle height={30} width={30} mr={14} />
          <Flex direction="column" w={{ base: '150px', md: '250px' }}>
            <Skeleton height={20} width="60%" />
            <Skeleton height={14} width="40%" mt={5} />
          </Flex>
        </Flex>
      </Table.Td>
      <Table.Td align="right">
        <Skeleton height={20} width={150} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={20} width="100%" />
      </Table.Td>
      <Table.Td>
        <Skeleton height={20} width="100%" />
      </Table.Td>
      <Table.Td>
        <Skeleton height={20} width="100%" />
      </Table.Td>
      <Table.Td>
        <Skeleton height={20} width="100%" />
      </Table.Td>
      <Table.Td align="right">
        <Skeleton height={20} width="100%" />
        <Skeleton height={12} width="60%" mt={2} />
      </Table.Td>
      <Table.Td align="right">
        <Skeleton height={20} width="30%" />
        <Skeleton height={8} width="100%" mt={5} />
      </Table.Td>
      <Table.Td width={200}>
        <Skeleton height={40} width={170} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ zIndex: '-1' }}>
      <ScrollArea>
        <Table
          highlightOnHover
          highlightOnHoverColor="rgba(255, 255, 255, 0.1)"
          withRowBorders
          verticalSpacing="xs"
          horizontalSpacing="md"
          className={classes.tableContainer}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={classes.tableCell}>#</Table.Th>
              <Table.Th className={classes.tableCell} ta="left">
                Name
              </Table.Th>
              <Table.Th className={classes.tableCell} ta="right">
                Price
              </Table.Th>
              <Table.Th className={classes.tableCell} ta="right">
                1h %
              </Table.Th>
              <Table.Th className={classes.tableCell} ta="right">
                24h %
              </Table.Th>
              <Table.Th className={classes.tableCell} ta="right">
                7d %
              </Table.Th>
              <Table.Th className={classes.tableCell} ta="right">
                Market Cap
              </Table.Th>
              <Table.Th className={classes.tableCell} ta="right">
                Volume (24H)
              </Table.Th>
              <Table.Th className={classes.tableCell} ta="right">
                Circulating Supply
              </Table.Th>
              <Table.Th className={classes.tableCell}>Chart 1w</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default TableSkeleton;
