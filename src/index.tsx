import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import '@mantine/core/styles.css';
import { BrowserRouter } from 'react-router-dom';

// Lazy load the App component
const LazyApp = lazy(() => import('./app/App'));

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <LazyApp />
    </Suspense>
  </BrowserRouter>
);
