import { useRecoilValue } from 'recoil';
import classnames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import Card from 'src/components/Card';
import { authUser } from 'src/providers';
import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import { ReactComponent as Tick } from 'src/assets/svgs/tick.svg';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import { FeatureTypeToString, IPlans, LIMIT_TYPE, LimitTypeToString, PLAN_TYPE } from 'src/types';

interface IPlan {
  plan: IPlans;
  subscribePlan?: () => Promise<void>;
}

const Plan: React.FC<IPlan> = ({ plan, subscribePlan }) => {
  const auth = useRecoilValue(authUser);

  const { currency, price, name, type, _id, features, description } = plan;
  const btnText = type === PLAN_TYPE.MARKET_PLACE ? 'Contact us' : 'Get started';
  const navigate = useNavigate();

  const onPressFiat = () => {
    navigate(PROTECTED_ROUTES.STRIPE_PAYMENT, { state: { _id, price } });
  };

  return (
    <Card
      className={classnames(
        'col-span-10 col-start-2 sm:col-auto sm:flex sm:flex-col pt-0 px-0 justify-between max-w-lg mx-4 sm:max-w-sm sm:m-0 transition duration-300 ease-in-out delay-150 shadow-2xl hover:z-10 hover:-translate-y-1 hover:scale-105',
        {
          'cursor-not-allowed': auth?.user?.activePlan?.type === type,
        },
      )}
    >
      <div>
        <div className='flex-col flex-between'>
          {type === PLAN_TYPE.FREE || type === PLAN_TYPE.PREMIUM ? (
            <div className='w-full pt-4 pb-2 text-white flex-center primary-gradient rounded-t-3xl'>
              <Heading text={currency + price} />
              <Heading type='base' text='/month' className='mb-0' />
            </div>
          ) : null}
          {type === PLAN_TYPE.MARKET_PLACE ? (
            <div className='w-full p-4 text-white flex-center rounded-t-3xl primary-gradient'>
              <Heading type='heading' text='Contact Us' />
            </div>
          ) : null}

          <Heading type='heading' text={name} className='mt-3 text-center' />
        </div>

        <div className='px-10 text-sm text-center'>{description}</div>

        <div className='px-10 mt-4'>
          <div className='grid grid-cols-none text-sm sm:grid-cols-2'>
            {features.map((feature, index) => {
              return (
                <span key={`planDetail${index}`} className='flex items-center gap-2 my-2'>
                  <div>
                    <Tick />
                  </div>
                  <div>
                    {`${FeatureTypeToString[feature?.feature]} ${
                      feature.limitType === LIMIT_TYPE.LIMITED ? '' : LimitTypeToString[feature.limitType]
                    }`}
                  </div>
                </span>
              );
            })}

            {type === PLAN_TYPE.PREMIUM ? (
              <>
                <span className='flex items-center gap-2 my-2'>
                  <div>
                    <Tick />
                  </div>
                  Add to Registry
                </span>
                <span className='flex items-center gap-2 my-2'>
                  <div>
                    <Tick />
                  </div>
                  Infringement Notifications
                </span>
              </>
            ) : null}
          </div>
        </div>
        {type === PLAN_TYPE.PREMIUM && auth?.user?.activePlan?.type !== type ? (
          <div className='flex items-center gap-4 px-10'>
            <Button
              btnText='Pay with fiat'
              textSize='sm'
              full
              onClick={onPressFiat}
              className='hover:border-2 hover:border-current hover:primary-gradient hover:text-white'
            />
            <Button
              btnText='Pay with crypto'
              textSize='sm'
              full
              onClick={() => console.log('working needed')}
              className='hover:border-2 hover:border-current hover:primary-gradient hover:text-white'
            />
          </div>
        ) : null}
      </div>

      {auth?.user?.upcomingPlan?.type === type ? (
        <div className='h-12 px-3 mx-10 my-3 text-xs text-center text-white border sm:text-sm primary-gradient flex-center rounded-3xl'>
          Free plan will be automatically subscribed when premium plan expires
        </div>
      ) : null}

      {auth?.user?.activePlan?.type === type ? (
        <div className='h-12 px-3 mx-10 my-3 text-xs text-white border sm:px-0 sm:text-sm primary-gradient flex-center rounded-3xl'>
          You are already subscribed to this plan
        </div>
      ) : null}
      {type !== PLAN_TYPE.PREMIUM && auth?.user?.activePlan?.type !== type && auth?.user?.upcomingPlan?.type !== type ? (
        <div className='flex-center'>
          <Button
            onClick={subscribePlan}
            btnText={btnText}
            className='w-40 text-xs hover:border-2 hover:border-current hover:primary-gradient hover:text-white sm:text-base'
          />
        </div>
      ) : null}
    </Card>
  );
};

export default Plan;
