import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import { appTheme } from 'themes/app';
import '@mantine/core/styles.css';
import { BrowserRouter } from 'react-router-dom';
import {
  Center,
  Flex,
  Image,
  Loader,
  MantineProvider,
  useComputedColorScheme
} from '@mantine/core';
import logo from 'assets/images/logo.svg';
import PageTransition from 'components/App/PageTransition';

// Lazy load the App component
const LazyApp = lazy(() => import('./app/App'));

const AppWrapper = () => {
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });
  const isDarkTheme = computedColorScheme === 'dark';
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <PageTransition duration={0.1}>
            <Center style={{ width: '100%', height: '100vh' }}>
              <Flex direction="column" align="center" justify="center">
                <Image
                  src={logo}
                  style={{
                    filter: isDarkTheme ? 'invert()' : ''
                  }}
                  alt="Loading..."
                />
                <Loader size="md" type="bars" color="dark.5" mt={24} />
              </Flex>
            </Center>
          </PageTransition>
        }
      >
        <LazyApp />
      </Suspense>
    </BrowserRouter>
  );
};

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <MantineProvider theme={appTheme} defaultColorScheme="dark">
    <AppWrapper />
  </MantineProvider>
);
