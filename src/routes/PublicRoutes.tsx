import { Routes, Route, Navigate } from 'react-router-dom';

import Login from 'src/screens/Auth/Login';
import Register from 'src/screens/Auth/Register';
import VerifyOtp from 'src/screens/Auth/VerifyOtp';
import VerifyEmail from 'src/screens/Auth/VerifyEmail';
import { PROTECTED_ROUTES, ROUTES } from 'src/constant/NavigationConstant';
import ResetPassword from 'src/screens/Auth/ResetPassword';
import ForgotPassword from 'src/screens/Auth/ForgotPassword';
import Dashboard from 'src/screens/Dashboard';
import { LayoutsWithNavbar } from 'src/routes/LayoutsWithNavbar';
import Details from 'src/screens/Details';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LayoutsWithNavbar />}>
        <Route path={PROTECTED_ROUTES.ROOT} element={<Dashboard />} />
        <Route path={PROTECTED_ROUTES.TRADITIONAL} element={<Details />} />
        <Route path={PROTECTED_ROUTES.GASLESS} element={<Details />} />
      </Route>

      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.ALL} element={<Navigate to={ROUTES.LOGIN} />} />
    </Routes>
  );
};

export default PublicRoutes;
