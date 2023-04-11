import * as React from 'react';
import classNames from 'classnames';
import { Controller, useForm } from 'react-hook-form';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

import Button from 'src/components/Button';
import useOnSubmit from 'src/hooks/useOnSubmit';
import PopupModal from 'src/components/PopupModal';
import { emailRegex } from 'src/constant/AuthConstants';
import { stripeProtectionOneTimePayment } from 'src/services/http/restApi';
import StripeInput from 'src/components/InputField/StripeInput/StripeInput';

interface IPaymentModal {
  assetId: string;
  show: boolean;
  formData?: {
    lossPrevention: boolean;
    successionManagement: boolean;
    counterfeitMonitoring: boolean;
  };
  onClose: () => void;
  onSuccess: () => void;
}

interface IFormInput {
  email: string;
  nameOnCard: string;
}

const PaymentModal: React.FC<IPaymentModal> = ({ assetId, show, formData, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { control, handleSubmit } = useForm<IFormInput>();
  const [cardError, setCardError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { error, loading: isLoading, onSubmit: handleOnSubmit } = useOnSubmit(stripeProtectionOneTimePayment);

  const onSubmit = async (data: IFormInput) => {
    setLoading(true);
    if (stripe && elements) {
      const cardNumber = elements.getElement(CardNumberElement);

      if (cardNumber) {
        const { error: e, token } = await stripe.createToken(cardNumber);

        if (!e && token && formData) {
          await handleOnSubmit({
            assetId,
            stripeToken: token.id,
            customerEmail: data.email,
            cardholderName: data.nameOnCard,
            lossPrevention: formData.lossPrevention,
            successionManagement: formData.successionManagement,
          });
          onSuccess();
        } else if (e && e?.message) {
          setCardError(e.message.toLocaleUpperCase());
        }
      }
    }
    setLoading(false);
  };

  return (
    <PopupModal {...{ show, onClose }} title='Pay with Card' closeBtn={!isLoading} persistent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='email'
          control={control}
          defaultValue=''
          rules={{
            required: 'Email is Required',
            pattern: { value: emailRegex, message: 'Invalid Email Address' },
          }}
          render={({ field: { name, value, onChange }, fieldState: { error: err } }) => (
            <StripeInput
              type='text'
              label='Email Address'
              name={name}
              value={value}
              onChange={onChange}
              error={err?.message}
              disabled={loading || isLoading}
            />
          )}
        />
        <div className='-space-y-px'>
          <div className='mb-1 ml-1 flex-between'>
            <p className='mb-1 ml-1 text-xs text-gray-500'>Card information</p>
            {cardError ? (
              <p className='text-xs text-red-500'>
                {cardError}
                {error}
              </p>
            ) : null}
          </div>
          <CardNumberElement
            className={classNames(`block w-full border rounded-t-md stripe-inputfield bg-white`, {
              'border-red-500': cardError,
            })}
            options={{
              disabled: loading || isLoading,
            }}
          />
          <CardExpiryElement
            className={classNames(`inline-block w-6/12 border rounded-bl-md stripe-inputfield bg-white`, {
              'border-red-500': cardError,
            })}
            options={{
              disabled: loading || isLoading,
            }}
          />
          <CardCvcElement
            className={classNames(`inline-block w-6/12 border-y border-r rounded-br-md stripe-inputfield bg-white`, {
              'border-red-500': cardError,
            })}
            options={{
              disabled: loading || isLoading,
            }}
          />
        </div>
        <Controller
          name='nameOnCard'
          control={control}
          defaultValue=''
          rules={{
            required: 'Name is Required',
          }}
          render={({ field: { name, value, onChange }, fieldState: { error: err } }) => (
            <StripeInput
              type='text'
              label='Name on card'
              name={name}
              value={value}
              onChange={onChange}
              error={err?.message}
              disabled={loading || isLoading}
            />
          )}
        />
        <Button full type='submit' disabled={isLoading || loading} loading={loading || isLoading} btnText='Pay' />
      </form>
    </PopupModal>
  );
};

export default PaymentModal;
