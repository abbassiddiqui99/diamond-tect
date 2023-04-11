import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';

import config from 'src/config.env';
import PaymentForm from './PaymentForm';
import { useLocation } from 'react-router-dom';
import { UserDataType } from 'src/types';

const PUBLIC_KEY = config.STRIPE_PUBLIC_KEY;
const stripeTestPromise = loadStripe(PUBLIC_KEY);

type stateType = { state: { _id: string; price: string } };

const StripePayment = ({ refetch }: { refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<UserDataType>> }) => {
  const { state } = useLocation() as stateType;

  return (
    <div className='container mx-auto'>
      <div className='grid px-4 mx-auto lg:grid-cols-2 md:grid-cols-2 sm:px-8 sm:mt-10 sm:rounded-2xl '>
        <div className='flex-1'>
          <div className='flex justify-center px-4 py-12 mt-10 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md'>
              <div className='flex items-center'>
                <p className='text-lg'>Heera Digital</p>
                <span className='p-1 mt-1 ml-2 text-xs text-red-600 bg-yellow-400 rounded-md'>Test Mode</span>
              </div>
              <p className='text-gray-500'>Subscribe to our Premium Plan to unlock all platform features</p>
              <div className='flex items-center'>
                <p className='text-lg font-semibold'>{`US$${state.price}`}</p>
                <div className='p-1 text-xs font-semibold text-gray-500'>
                  per <br /> month
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-1 mb-10 shadow-2xl rounded-2xl sm:mb-0'>
          <Elements stripe={stripeTestPromise}>
            <PaymentForm refetch={refetch} planId={state._id} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;
