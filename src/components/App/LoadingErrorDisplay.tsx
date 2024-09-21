import React from 'react';
import PageTransition from './PageTransition';
import { Center, Flex, Loader, Button, Text, Image } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

type LoadingErrorDisplayProps = {
  loading: boolean;
  error: string | null;
  onRetry?: () => void; // Optional retry function
};

export const LoadingErrorDisplay: React.FC<LoadingErrorDisplayProps> = ({
  loading,
  error,
  onRetry
}) => {
  if (loading)
    return (
      <PageTransition duration={0.1}>
        <Center style={{ width: '100%', height: '100vh' }}>
          <Flex direction="column" align="center" justify="center">
            <Loader size="xl" variant="bars" color="dark.5" mt={14} />
            <Text size="lg" mt="sm" color="dark.5">
              Loading, please wait...
            </Text>
          </Flex>
        </Center>
      </PageTransition>
    );

  if (error)
    return (
      <PageTransition duration={0.2}>
        <Center style={{ width: '100%', height: '100vh' }}>
          <Flex direction="column" align="center" justify="center">
            <Image
              src="https://via.placeholder.com/400x300?text=Error+Image" // Replace with a suitable error image or illustration
              alt="Error"
              width={400}
              height={300}
              mb="md"
            />
            <Text size="lg" fw={500} c="red" ta="center">
              Oops! Something went wrong.
            </Text>
            <Text size="md" c="gray" ta="center" mt="xs" mb="lg">
              {error}
            </Text>
            {onRetry ? (
              <Button leftSection={<IconRefresh size={18} />} onClick={onRetry}>
                Try Again
              </Button>
            ) : (
              <Button
                leftSection={<IconRefresh size={18} />}
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            )}
          </Flex>
        </Center>
      </PageTransition>
    );

  return null;
};
