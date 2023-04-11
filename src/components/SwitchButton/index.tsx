import classnames from 'classnames/bind';
import { Switch } from '@headlessui/react';

interface SwitchButtonType {
  enabled?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const SwitchButton: React.FC<SwitchButtonType> = ({ enabled = false, disabled, onChange }) => {
  const setEnabled = (checked: boolean) => {
    if (onChange) {
      onChange(checked);
    }
  };
  return (
    <Switch
      checked={enabled}
      disabled={disabled}
      onChange={setEnabled}
      className={classnames(
        'relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75',
        {
          'primary-gradient': enabled,
          'bg-gray-400': !enabled,
        },
      )}
    >
      <span
        aria-hidden='true'
        className={classnames(
          'pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200',
          {
            'translate-x-9': enabled,
            'translate-x-0': !enabled,
          },
        )}
      />
    </Switch>
  );
};

export default SwitchButton;
