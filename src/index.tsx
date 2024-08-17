import { createRoot } from 'react-dom/client';
import App from 'app/App';
import '@mantine/core/styles.css';
import { BrowserRouter } from 'react-router-dom';
import { ZustandDevtools } from 'react-zustand-devtools';
import { Button } from '@mantine/core';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
