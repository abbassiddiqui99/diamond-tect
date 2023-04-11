import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { GET_NOTIFICATIONS } from 'src/graphql/query';
import { INotification, NotificationStatus } from 'src/types';
import { UPDATE_NOTIFICATION_STATUS } from 'src/graphql/mutation';
import { INITIAL_FETCH_LIMIT } from 'src/constant/commonConstants';

interface NotificationResponse {
  getNotifications: INotification[];
  getNotificationsAggregate: {
    total: number;
  };
}

export const useNotifications = () => {
  const [updateNotificationStatus] = useMutation(UPDATE_NOTIFICATION_STATUS);
  const { loading, data, error, fetchMore, refetch } = useQuery<NotificationResponse>(GET_NOTIFICATIONS, {
    fetchPolicy: 'network-only',
    variables: {
      offset: 0,
      limit: INITIAL_FETCH_LIMIT,
    },
  });

  const hasMore = useMemo((): boolean => {
    const total = data?.getNotificationsAggregate?.total || 0;
    const loaded = data?.getNotifications?.length || 0;
    return total - loaded > 0;
  }, [data]);

  const onLoadMore = () => {
    if (hasMore) {
      fetchMore({
        variables: {
          offset: data?.getNotifications?.length,
          limit: INITIAL_FETCH_LIMIT,
        },
      });
    }
  };

  const onUpdateStatus = async (notificationIds: string[], status: NotificationStatus) => {
    try {
      await updateNotificationStatus({
        variables: {
          input: notificationIds.map(id => ({
            id,
            status,
          })),
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return { data, loading, error, hasMore, onLoadMore, onUpdateStatus, refetch };
};
