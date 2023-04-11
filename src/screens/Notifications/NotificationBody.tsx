import dayjs from 'dayjs';
import * as React from 'react';
import classNames from 'classnames/bind';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiLock2Line,
  RiMailLine,
  RiMailOpenLine,
  RiShieldCheckLine,
} from 'react-icons/ri';

import Tooltip from 'src/components/Tooltip';
import { errorHandler } from 'src/utils/helpers';
import { INotification, NotificationStatus, NotificationType } from 'src/types';

dayjs.extend(relativeTime);

const NotificationIcon = {
  [NotificationType['FOUND_DUPLICATE_NFT']]: <RiErrorWarningLine size={40} className='text-yellow-600' />,
  [NotificationType['SETUP_LOSS_PREVENTION']]: <RiLock2Line size={40} className='text-slate-600' />,
  [NotificationType['SETUP_POLICING']]: <RiShieldCheckLine size={40} className='text-blue-600' />,
  [NotificationType['SETUP_SUCCESSION']]: <RiShieldCheckLine size={40} className='text-blue-600' />,
  [NotificationType['SUCCESSION_WARNING']]: <RiErrorWarningLine size={40} className='text-yellow-600' />,
  [NotificationType['SUCCESSION_RECEIVED']]: <RiInformationLine size={40} className='text-blue-600' />,
  [NotificationType['SUCCESSION_TRANSFERRED']]: <RiCheckboxCircleLine size={40} className='text-green-600' />,
};

interface INotificationBody {
  notification: INotification;
  loading: boolean;
  menu?: boolean;
  onUpdateStatus: (notificationIds: string[], status: NotificationStatus) => Promise<void>;
}

const NotificationBody: React.FC<INotificationBody> = ({ notification, menu, loading, onUpdateStatus }) => {
  const [isRead, setIsRead] = React.useState(false);

  React.useEffect(() => {
    setIsRead(notification.status === NotificationStatus.READ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markNotification = async () => {
    try {
      await onUpdateStatus([notification.id], isRead ? NotificationStatus.SENT : NotificationStatus.READ);
      setIsRead(!isRead);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    }
  };

  return (
    <div
      className={classNames('p-3 text-sm border-b-[1px] hover:bg-slate-50 transition', {
        'bg-secondary-blue/10': !isRead,
      })}
    >
      <div className='flex gap-3'>
        <div>{NotificationIcon[notification.type]}</div>
        <div className='w-full gap-5 text-xs md:text-sm flex-between'>
          <div>{notification.message}</div>
          <div className='gap-2 flex-center'>
            <p className='text-xs text-gray-400 whitespace-nowrap'>{dayjs(notification.createdAt).fromNow()}</p>
            {!menu ? (
              <div
                className={classNames('text-gray-600', {
                  'cursor-pointer': !loading,
                  'cursor-not-allowed': loading,
                })}
                onClick={markNotification}
              >
                {notification.status === NotificationStatus.SENT ? (
                  <Tooltip text='Mark as read' icon={<RiMailOpenLine />} />
                ) : (
                  <Tooltip text='Mark as unread' icon={<RiMailLine />} />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBody;
