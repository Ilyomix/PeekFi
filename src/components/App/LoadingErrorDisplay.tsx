import React from 'react';
import PageTransition from './PageTransition';
import { Center, Flex, Loader } from '@mantine/core';

type LoadingErrorDisplayProps = {
  loading: boolean;
  error: string | null;
};

export const LoadingErrorDisplay: React.FC<LoadingErrorDisplayProps> = ({
  loading,
  error
}) => {
  if (loading)
    return (
      <PageTransition duration={0.1}>
        <Center style={{ width: '100%', height: '100vh' }}>
          <Flex direction="column" align="center" justify="center">
            <Loader size="xl" type="bars" color="dark.5" mt={14} />
          </Flex>
        </Center>
      </PageTransition>
    );
  if (error) return <div>Error: {error}</div>;
  return null;
};
