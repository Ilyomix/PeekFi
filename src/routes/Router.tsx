import { Routes, Route } from 'react-router-dom';
import Pair from 'pages/Pair';
import Screener from 'pages/Screener';
import PageTransition from 'components/PageTransition';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Screener />}></Route>
      <Route path="/pair/:pair" element={<Pair />}></Route>
      <Route path="*" element={<PageTransition>404</PageTransition>}></Route>
    </Routes>
  );
};

export default AppRoutes;
