import { useEffect, useMemo } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { IUser } from 'src/types';
import Details from 'src/screens/Details';
import ListNft from 'src/screens/ListNft';
import LoadNft from 'src/screens/LoadNft';
import MintNft from 'src/screens/MintNft';
import Profile from 'src/screens/Profile';
import Banner from 'src/components/Banner';
import RemintNft from 'src/screens/RemintNft';
import Dashboard from 'src/screens/Dashboard';
import RootLoading from 'src/routes/RootLoading';
import { GET_USER_QUERY } from 'src/graphql/query';
import ProtectedNft from 'src/screens/ProtectedNft';
import Header from 'src/components/Skeleton/Header';
import Notifications from 'src/screens/Notifications';
import { LayoutsWithNavbar } from './LayoutsWithNavbar';
import Subscriptions from 'src/screens/Payments/Subscriptions';
import StripePayment from 'src/screens/Payments/StripePayment';
import SkeletonGenerator from 'src/components/SkeletonGenerator';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import { ListRemintNFTs } from 'src/screens/ListNft/ListRemintNFTs';
import { SUBSCRIPTION_NOTIFICATION_BADGE } from 'src/graphql/mutation';
import { authUser, notificationsBadge, walletChain } from 'src/providers';
import { networkDetails, networkNames, OneNetworkName, TEST_NETS } from 'src/constant/WalletConstants';

interface PaymentGuardType {
  component: React.FC;
  isAuth: boolean;
}

const PaymentGuard: React.FC<PaymentGuardType> = ({ component: Component, isAuth, ...props }) => {
  if (isAuth) {
    return <Component {...props} />;
  }
  return <Navigate to={PROTECTED_ROUTES.PAYMENT} />;
};

const ProtectedRoutes = () => {
  const location = useLocation();
  const chain = useRecoilValue(walletChain);
  const [auth, setAuthUser] = useRecoilState(authUser);
  const setNotificationBadge = useSetRecoilState(notificationsBadge);

  const { data, loading, refetch } = useQuery(GET_USER_QUERY, { fetchPolicy: 'network-only' });
  const { data: subscriptionData } = useSubscription(SUBSCRIPTION_NOTIFICATION_BADGE, {
    variables: { userId: auth?.user?._id },
  });

  const user = useMemo(() => {
    return data?.getUser as IUser | null;
  }, [data]);

  const isSubscribed = useMemo(() => {
    return Boolean(user?.activePlan?.name);
  }, [user?.activePlan?.name]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setAuthUser(prev => {
      return {
        ...prev,
        user: {
          ...prev?.user,
          ...user,
        },
      };
    });
  }, [user, setAuthUser]);

  useEffect(() => {
    if (subscriptionData?.notificationBadge) {
      setNotificationBadge(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionData]);

  if (loading) {
    if (location.pathname === PROTECTED_ROUTES.ROOT) return <RootLoading />;

    return (
      <div>
        <Header />
        <SkeletonGenerator location={location.pathname} />
      </div>
    );
  }

  return (
    <>
      {TEST_NETS.includes(chain) ? (
        <Banner type='warning' sticky text={`You are currently on Testnet (${networkNames[chain as OneNetworkName] || chain})`} />
      ) : null}
      {chain === networkDetails.polygon.chainId ? <Banner type='warning' text='Polygon is not supported yet by Heera Digital' /> : null}
      <Routes>
        <Route path='/' element={<LayoutsWithNavbar />}>
          <Route path={PROTECTED_ROUTES.NOTIFICATION} element={<PaymentGuard component={Notifications} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.TRADITIONAL} element={<PaymentGuard component={Details} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.GASLESS} element={<PaymentGuard component={Details} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.PROFILE} element={<PaymentGuard component={Profile} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.MINT_NFT} element={<PaymentGuard component={MintNft} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.LIST_NFT} element={<PaymentGuard component={ListNft} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.LIST_REMINT_NFT} element={<PaymentGuard component={ListRemintNFTs} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.LOAD_NFT} element={<PaymentGuard component={LoadNft} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.REMINT_NFT} element={<PaymentGuard component={RemintNft} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.ROOT} element={<PaymentGuard component={Dashboard} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.PROTECTED_NFTS} element={<PaymentGuard component={ProtectedNft} isAuth={isSubscribed} />} />
          <Route path={PROTECTED_ROUTES.ALL} element={<Navigate to={PROTECTED_ROUTES.ROOT} />} />
          <Route
            path={PROTECTED_ROUTES.PAYMENT}
            element={isSubscribed ? <Navigate to={PROTECTED_ROUTES.ROOT} /> : <Subscriptions refetch={refetch} />}
          />
          <Route path={PROTECTED_ROUTES.UPDATE_PAYMENT} element={<Subscriptions refetch={refetch} />} />
          <Route path={PROTECTED_ROUTES.STRIPE_PAYMENT} element={<StripePayment refetch={refetch} />} />
        </Route>
      </Routes>
    </>
  );
};

export default ProtectedRoutes;
