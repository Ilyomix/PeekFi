import { Container, MantineProvider } from '@mantine/core';
import { AppRoutes } from 'routes/Router';
import { appTheme } from 'themes/app';
import { Header } from 'components/Header';
import { ZustandDevtools } from 'react-zustand-devtools';
import { Button } from '@mantine/core';

import 'assets/app/index.css';
import { IconDatabase } from '@tabler/icons-react';

function App() {
  return (
    <>
      <MantineProvider theme={appTheme} defaultColorScheme="dark">
        <Container size="xl">
          <Header />
          <AppRoutes />
        </Container>
        <ZustandDevtools>
          <Button
            pos="fixed"
            style={{ zIndex: 10000, bottom: 14, right: 14 }}
            radius="xl"
            color="black"
            leftSection={<IconDatabase />}
          >
            Store
          </Button>
        </ZustandDevtools>
      </MantineProvider>
    </>
  );
}

export default App;
