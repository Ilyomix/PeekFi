import { Routes, Route } from 'react-router-dom';
import Pair from 'pages/Pair';
import Screener from 'pages/Screener';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Pair />}></Route>
      <Route path="/pair/:pair" element={<Screener />}></Route>
      {/* <Route path="*" element={<NotFound />}></Route> */}
    </Routes>
  );
};

export default AppRoutes;
