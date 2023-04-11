import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';

import { IPlans, PLAN_TYPE, UserDataType } from 'src/types';
import Plan from 'src/components/Payment/Plan';
import Skeleton from 'src/components/Skeleton';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import { getPlans, subscriptionFreePlan } from 'src/services/http/restApi';
import { createLoadingToast, updateToast } from 'src/utils/Toast';
import { errorHandler } from 'src/utils/helpers';

const Subscriptions = ({ refetch }: { refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<UserDataType>> }) => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<IPlans[]>();

  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      const getPlansRes = await getPlans();
      setPlans(getPlansRes.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      errorHandler(error);
    }
    setLoading(false);
  };

  const subscribePlan = async () => {
    const toastId = createLoadingToast();
    try {
      await subscriptionFreePlan();
      if (refetch) {
        await refetch();
      }

      navigate(PROTECTED_ROUTES.ROOT);
      updateToast({ id: toastId, message: 'Successfully subscribed to free plan', type: 'success' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      updateToast({ id: toastId, message: error?.response?.data?.error });
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className='container mx-auto my-10'>
      {loading && !plans ? (
        <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Skeleton type='Plan' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
        </div>
      ) : null}
      {!loading && plans ? (
        <div className='grid justify-center grid-cols-12 gap-8 sm:flex-wrap sm:flex sm:grid-cols-none '>
          {plans?.map(plan => {
            return <Plan key={plan._id} plan={plan} subscribePlan={plan.type === PLAN_TYPE.FREE ? subscribePlan : undefined} />;
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Subscriptions;
