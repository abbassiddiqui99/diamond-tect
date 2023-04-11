import InfiniteScroll from 'react-infinite-scroller';

import Heading from 'src/components/Heading';
import Skeleton from 'src/components/Skeleton';
import { NotificationStatus } from 'src/types';
import { errorHandler } from 'src/utils/helpers';
import { useNotifications } from 'src/hooks/useNotifications';
import NotificationBody from 'src/screens/Notifications/NotificationBody';

const Notifications: React.FC = () => {
  const { loading, data, error, hasMore, onLoadMore, onUpdateStatus, refetch } = useNotifications();
  const notifications = data?.getNotifications;

  const markNotificationRead = async (id: string[]) => {
    try {
      await onUpdateStatus(id, NotificationStatus.READ);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    }
  };
  const notificationIds: string[] = [];

  notifications?.forEach(notification => {
    if (notification.status === NotificationStatus.SENT) {
      notificationIds.push(notification.id);
    }
  });

  return (
    <div className='mt-10 mb-40'>
      <InfiniteScroll pageStart={0} loadMore={onLoadMore} hasMore={hasMore} loader={<Skeleton key={0} type='Dots' />}>
        <div className='grid grid-cols-12 sm:grid-cols-12 md:grid-cols-7 lg:grid-cols-10'>
          <div className='col-span-10 col-start-2 bg-white rounded-lg md:col-span-5 md:col-start-2 lg:col-span-6 lg:col-start-3'>
            <div className='p-3 flex-between'>
              <Heading type='subheading' text='Notifications' className='mb-0' />
              {/* show mark all as read if there is are notifications unread */}
              {notificationIds?.length ? (
                <p className='text-xs cursor-pointer text-secondary-blue' onClick={() => markNotificationRead(notificationIds)}>
                  Mark all as read
                </p>
              ) : null}
            </div>
            {/* Skeleton */}
            {loading ? (
              <div className='p-3 h-96'>
                <Skeleton type='Notification' repeat={3} />
              </div>
            ) : null}
            {notifications?.map((notification, idx) => (
              <NotificationBody
                key={`${notification.id}_${idx}`}
                notification={notification}
                loading={loading}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            {/* No Notifications */}
            {!loading && !notifications?.length ? <div className='p-3 text-sm flex-center h-96'>No new notifications</div> : null}
          </div>
          {error ? <div className='text-red-500 flex-center'>{error}</div> : null}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Notifications;
