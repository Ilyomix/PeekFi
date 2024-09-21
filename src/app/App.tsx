import { Container } from '@mantine/core';
import { AppRoutes } from 'routes/Router';
import { Header } from 'components/App/Header';
import 'assets/app/index.css';

/**
 * The main App component that sets up the theme and layout for the application.
 * It includes the Header and the main application routes.
 */
function App() {
  return (
    <Container size="xxl" className="app-container">
      <Header />
      <AppRoutes />
    </Container>
  );
}

export default App;
