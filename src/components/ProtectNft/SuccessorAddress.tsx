import { Controller, useForm } from 'react-hook-form';

import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import PopupModal from 'src/components/PopupModal';
import FormInput from 'src/components/InputField/FormInput';
import { WALLET_ADDRESS_REGEX } from 'src/constant/commonConstants';

interface ISuccessorAddress {
  show: boolean;
  loading: boolean;
  data?: {
    lossPrevention: boolean;
    successionManagement: boolean;
    counterfeitMonitoring: boolean;
  };
  onClose: () => void;
  onSubmit: (data: ProtectionForm) => void;
}

interface ProtectionForm {
  successorWallet?: string;
  successorForLossWallet?: string;
}

const SuccessorAddress: React.FC<ISuccessorAddress> = ({ show, data, loading, onClose, onSubmit }) => {
  const { control, handleSubmit } = useForm<ProtectionForm>();

  return (
    <PopupModal show={show} onClose={onClose} title='Wallet address' persistent closeBtn={!loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {data?.successionManagement ? (
          <>
            <Heading type='base' text='Succession Management' className='flex-center' />
            <Controller
              name='successorWallet'
              control={control}
              defaultValue=''
              render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                <FormInput
                  type='text'
                  name={name}
                  value={value}
                  disabled={loading}
                  onChange={onChange}
                  error={error?.message}
                  placeholder='Enter Successor wallet address'
                />
              )}
              rules={{
                required: 'Successor Wallet Address is Required',
                pattern: { value: WALLET_ADDRESS_REGEX, message: 'Invalid Wallet Address' },
              }}
            />
          </>
        ) : null}
        {data?.lossPrevention ? (
          <>
            <Heading type='base' text='Loss Prevention' className='text-center' />
            <Controller
              name='successorForLossWallet'
              control={control}
              defaultValue=''
              render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                <FormInput
                  type='text'
                  name={name}
                  value={value}
                  disabled={loading}
                  onChange={onChange}
                  error={error?.message}
                  placeholder='Enter Successor for Loss wallet address'
                />
              )}
              rules={{
                required: 'Successor Wallet Address for Loss is Required',
                pattern: { value: WALLET_ADDRESS_REGEX, message: 'Invalid Wallet Address' },
              }}
            />
            {/* <span className='text-sm'>Succession End Days</span>
            <Controller
              name='successionEndDays'
              control={control}
              defaultValue={90}
              render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                <FormInput
                  type='number'
                  name={name}
                  min={90}
                  value={`${value}`}
                  disabled={loading}
                  onChange={onChange}
                  error={error?.message}
                  placeholder='Enter succession end days'
                />
              )}
              rules={{
                required: 'Successor Wallet Address for Loss is Required',
              }}
            /> */}
          </>
        ) : null}
        <Button type='submit' btnText='Submit' disabled={loading} loading={loading} full />
      </form>
    </PopupModal>
  );
};

export default SuccessorAddress;
