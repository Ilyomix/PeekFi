import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Screener = lazy(() => import('pages/Screener'));
const Pair = lazy(() => import('pages/Pair'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Screener />} />
        <Route path="/pair/:pair" element={<Pair />} />
        {/* other routes */}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
