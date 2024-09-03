import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load the Screener and Pair components
const Screener = lazy(() => import('pages/Screener'));
const Pair = lazy(() => import('pages/Pair'));

/**
 * AppRoutes component handles the routing for the application.
 * It uses React's lazy and Suspense for lazy loading the components.
 */
export function AppRoutes() {
  return (
    // Suspense component is used to show a fallback UI while the lazy-loaded components are being fetched.
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Redirect the root path to the Screener component with page 1 */}
        <Route path="/" element={<Navigate to="screener/page/1" replace />} />

        {/* Route for the Screener component, with dynamic page parameter */}
        <Route path="screener/page/:page" element={<Screener />} />

        {/* Route for the Pair component, with dynamic pair parameter */}
        <Route path="/pair/:pair" element={<Pair />} />

        {/* Add other routes here as needed */}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
