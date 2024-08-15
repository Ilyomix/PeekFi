import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'app/App';
import '@mantine/core/styles.css';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
