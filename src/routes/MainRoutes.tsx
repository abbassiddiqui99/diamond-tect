import { useRecoilValue } from 'recoil';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { isAuthenticated } from 'src/providers';
import Background from 'src/components/Background';
import PublicRoutes from 'src/routes/PublicRoutes';
import { getBrowserName } from 'src/utils/helpers';
import { BROWSERS } from 'src/constant/commonConstants';
import ProtectedRoutes from 'src/routes/ProtectedRoutes';

const MainRoutes: React.FC = () => {
  const isAuth = useRecoilValue(isAuthenticated);
  const browser = getBrowserName();

  return (
    <BrowserRouter>
      {browser !== BROWSERS.Firefox ? (
        <Background />
      ) : (
        <div className='fixed w-full h-full bg-gradient-to-r from-secondary-blue/10 to-secondary-purple/10 -z-20 blur-[100px]'></div>
      )}

      <Routes>{isAuth ? <Route path='*' element={<ProtectedRoutes />} /> : <Route path='*' element={<PublicRoutes />} />}</Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
