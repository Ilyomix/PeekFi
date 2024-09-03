import React from 'react';
import { Skeleton, Table } from '@mantine/core';

interface TableSkeletonProps {
  rows: number;
  columns: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows, columns }) => {
  return (
    <Table>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex}>
                <Skeleton height={20} width="100%" radius="sm" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableSkeleton;
