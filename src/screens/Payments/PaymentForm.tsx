import { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

import Button from 'src/components/Button';
import useOnSubmit from 'src/hooks/useOnSubmit';
import { stripePayment } from 'src/services/http/restApi';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import StripeInput from 'src/components/InputField/StripeInput/StripeInput';
import { UserDataType } from 'src/types';

interface IFormInput {
  email: string;
  nameOnCard: string;
}

const PaymentForm = ({
  refetch,
  planId,
}: {
  refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<UserDataType>>;
  planId: string;
}) => {
  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IFormInput>();
  const [cardError, setCardError] = useState('');
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  const { error, loading, onSubmit: handleOnSubmit } = useOnSubmit(stripePayment);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const ValidateFields = (email: string, nameOnCard: string) => {
    if (!email) {
      setError('email', {
        type: 'manual',
        message: 'REQUIRED',
      });
    } else {
      clearErrors('email');
    }
    if (!nameOnCard) {
      setError('nameOnCard', {
        type: 'manual',
        message: 'REQUIRED',
      });
    } else {
      clearErrors('nameOnCard');
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBtnDisabled(true);
    setCardError('');
    const { email, nameOnCard } = getValues();
    ValidateFields(email, nameOnCard);

    if (stripe && elements) {
      const cardNumber = elements.getElement(CardNumberElement);

      if (cardNumber) {
        const { error: e, token } = await stripe.createToken(cardNumber);

        if (!e && !errors?.email && !errors?.nameOnCard && token && planId) {
          await handleOnSubmit({
            customerEmail: email,
            cardholderName: nameOnCard,
            stripeToken: token.id,
            subscriptionPlanId: planId,
          });
          if (refetch) {
            await refetch();
          }
          navigate(PROTECTED_ROUTES.ROOT);
        } else if (e && e?.message) {
          setCardError(e.message.toLocaleUpperCase());
        }
      }
    }
    setIsBtnDisabled(false);
  };

  return (
    <div className='min-h-full px-2 py-12 bg-white flex-center sm:px-6 lg:px-8 rounded-2xl'>
      <div className='w-full max-w-md mx-5 space-y-8 sm:mx-0'>
        <form onSubmit={onSubmit}>
          <h2 className='text-2xl'>Pay with card</h2>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            render={({ field: { name, value, onChange }, fieldState: { error: err } }) => (
              <StripeInput
                type='text'
                label='Email Address'
                name={name}
                value={value}
                disabled={loading || isBtnDisabled}
                onChange={onChange}
                error={err?.message}
              />
            )}
          />
          <div className='-space-y-px'>
            <div className='mb-1 ml-1 flex-between'>
              <p className='mb-1 ml-1 text-xs text-gray-500'>Card information</p>
              {error || cardError ? <p className='text-xs text-red-500'>{cardError}</p> : null}
            </div>
            <CardNumberElement
              className={classNames(`block w-full border rounded-t-md stripe-inputfield bg-white`, {
                'border-red-500': error || cardError,
              })}
              options={{
                disabled: loading || isBtnDisabled,
              }}
            />
            <CardExpiryElement
              className={classNames(`inline-block w-6/12 border rounded-bl-md stripe-inputfield bg-white`, {
                'border-red-500': error || cardError,
              })}
              options={{
                disabled: loading || isBtnDisabled,
              }}
            />
            <CardCvcElement
              className={classNames(`inline-block w-6/12 border-y border-r rounded-br-md stripe-inputfield bg-white`, {
                'border-red-500': error || cardError,
              })}
              options={{
                disabled: loading || isBtnDisabled,
              }}
            />
          </div>
          <Controller
            name='nameOnCard'
            control={control}
            defaultValue=''
            render={({ field: { name, value, onChange }, fieldState: { error: err } }) => (
              <StripeInput
                type='text'
                label='Name on card'
                name={name}
                value={value}
                onChange={onChange}
                error={err?.message}
                disabled={loading || isBtnDisabled}
              />
            )}
          />
          <Button full type='submit' disabled={loading || isBtnDisabled}>
            Subscribe
          </Button>
          <p className='mt-3 text-xs text-center text-gray-500'>
            By confirming your subscription, you allow Markovian Studios to charge your card for this payment and future payments in
            accordance with their terms.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
