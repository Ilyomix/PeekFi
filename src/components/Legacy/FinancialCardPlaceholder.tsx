import { SimpleGrid, Paper, Skeleton, Flex } from '@mantine/core';
import classes from 'assets/components/FinancialCard/index.module.css';

export const FinancialCardPlaceholder = ({ columns = 4 }) => (
  <SimpleGrid cols={{ base: 1, xs: 2, md: columns }} mb="md">
    {Array.from({ length: 30 }).map((_, index) => (
      <Paper
        shadow="md"
        p="md"
        radius="lg"
        key={index}
        style={{ height: '189.5px' }}
        className={classes.card}
      >
        <Flex
          direction="column"
          justify="space-between"
          align="start"
          style={{ height: '100%' }}
        >
          <Skeleton radius={10} height={14} width="50%" />
          <Skeleton radius={10} height={7} width="36%" />
          <Skeleton radius={10} height={60} width="100%" />
          <Skeleton radius={10} height={14} width="50%" />
          <Flex justify="space-between" w="100%">
            <Skeleton radius={10} height={7} width="33%" />
            <Skeleton radius={10} height={7} width="33%" />
          </Flex>
        </Flex>
      </Paper>
    ))}
  </SimpleGrid>
);
