import { MantineProvider } from '@mantine/core';
import { AppRoutes } from 'routes/Router';
import { appTheme } from 'themes/app';
import { Header } from 'components/Header';

import 'assets/app/index.css';

function App() {
  return (
    <>
      <MantineProvider theme={appTheme} defaultColorScheme="dark">
        <Header />
        <AppRoutes />
      </MantineProvider>
    </>
  );
}

export default App;
