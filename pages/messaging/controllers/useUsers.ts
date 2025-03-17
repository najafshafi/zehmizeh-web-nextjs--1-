import { useAuth } from '@/helpers/contexts/auth-context';
import messageService from '@/helpers/http/message';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { MessageUser, MessageUserItem } from '../messaging.types';
import { getToken } from '@/helpers/services/auth';
import { UserData } from '@/store/redux/slices/chat.interface';

export default function useUsers(debouncedSearchQuery?: string, action?: string) {
  const { user } = useAuth();
  const { data, isLoading, refetch, isRefetching } = useQuery(
    ['message', 'users', debouncedSearchQuery, action]
    // () => user && messageService.getUserList(debouncedSearchQuery, action)
  );
  const token = getToken();

  useEffect(() => {
    if (user && action && typeof action === 'string' && token) refetch();
  }, [action, user]);
  const getRemoteUser = (userItem: MessageUserItem) => {
    const currentUserId = user?.user_id;
    if (!currentUserId) return null;
    const { _from_user_data, _to_user_data } = userItem;
    return [_from_user_data, _to_user_data].find((item) => item.user_id !== currentUserId);
  };

  return { data, isLoading, getRemoteUser, isRefetching, refetch };
}

export const getUserName = (user: UserData) => {
  return [user?.first_name, user?.last_name].join(' ');
};
