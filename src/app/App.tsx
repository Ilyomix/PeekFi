import { Container, MantineProvider } from '@mantine/core';
import { AppRoutes } from 'routes/Router';
import { appTheme } from 'themes/app';
import { Header } from 'components/App/Header';
import 'assets/app/index.css';

/**
 * The main App component that sets up the theme and layout for the application.
 * It includes the Header and the main application routes.
 */
function App() {
  return (
    <MantineProvider theme={appTheme} defaultColorScheme="dark">
      <Container size="xxl">
        <Header />
        <AppRoutes />
      </Container>
    </MantineProvider>
  );
}

export default App;
