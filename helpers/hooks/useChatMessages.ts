import { useMemo } from 'react';
import { isClosedorDeclined } from '@/helpers/utils/helper';
import { ChatFilters, UseChatMessagesReturn } from '@/helpers/types/chat.type';
import { ChatUser } from "../../store/redux/slices/talkjs.interface";

export const useChatMessages = (chatlist: ChatUser[], filters: ChatFilters): UseChatMessagesReturn => {
  const chatUsers = useMemo(() => {
    let filteredChats = [...chatlist];

    if (filters.job !== '') {
      filteredChats = filteredChats.filter((chat) => chat.custom.jobPostId === filters.job);
    }

    if (filters.type !== '') {
      filteredChats = filteredChats.filter((chat) => chat.custom.type === filters.type);
    }

    if (filters.status !== '') {
      if (filters.status === 'open') {
        filteredChats = filteredChats.filter((chat) => !isClosedorDeclined(chat));
      } else {
        filteredChats = filteredChats.filter((chat) => isClosedorDeclined(chat));
      }
    }

    return filteredChats;
  }, [chatlist, filters]);

  const totalUnreadMessages = useMemo(
    () => chatlist.reduce((total, chat) => total + chat.unreadMessageCount, 0),
    [chatlist]
  );

  return { chatUsers, totalUnreadMessages };
};
