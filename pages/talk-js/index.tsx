import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/helpers/contexts/auth-context';
import { AppDispatch, RootState } from '@/store/redux/store';
import { fetchMyConversation, resetConversation, singleConversationById } from '@/store/redux/slices/talkjsSlice';
import useResponsive from '@/helpers/hooks/useResponsive';
import { useNotification } from '@/helpers/hooks/useNotification';
import { talkjsApiKey, isStagingEnv } from '@/helpers/utils/helper';
import * as T from './style';
import { useChatAuth } from '@/helpers/hooks/useChatAuth';
import { useChatMessages } from '@/helpers/hooks/useChatMessages';
import { ChatUser } from '@/store/redux/slices/talkjs.interface';
import { ChatSession } from '@/components/talkjs/ChatSession';
import { EmptyChatState } from '@/components/talkjs/EmptyChatState';
import { ChatSidebar } from '@/components/talkjs/ChatSidebar';
import { messageDisabled } from '@/components/talkjs/MessageDisabled';
import Note from '@/components/talkjs/Note';
import ChatFilter from '@/components/talkjs/chatFilter';
import ChatNavbar from '@/components/talkjs/chatNavbar';

interface Props {
  singleConversation?: string;
}

const TalkJS = ({ singleConversation }: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  const [showChatFilter, setShowChatFilter] = useState<boolean>(true);

  const { chatlist, loading, selectedConversation, filters, themes } = useSelector(
    (state: RootState) => state.talkJsChat
  );

  const { isDesktop } = useResponsive();
  const { user } = useAuth();
  const { conversationId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const { isSupported, permission, showModal, requestPermission } = useNotification();
  const chatAuth = useChatAuth(user.user_id);
  const { chatUsers, totalUnreadMessages } = useChatMessages(chatlist, filters);

  const sessionConfig = useMemo(
    () => ({
      ...(!isStagingEnv() ? { token: chatAuth.token } : {}),
      desktopNotificationEnabled: permission === 'granted',
      appId: talkjsApiKey(),
      userId: user.user_id,
    }),
    [chatAuth.token, permission, user.user_id]
  );

  const onSelectChat = (conversation: ChatUser) => {
    dispatch(singleConversationById(conversation.id));
    setOpen(false);
  };

  useEffect(() => {
    let controller;

    if (!singleConversation) {
      controller = dispatch(fetchMyConversation(conversationId ?? ''));
    } else {
      dispatch(singleConversationById(singleConversation));
    }

    return () => {
      dispatch(resetConversation());
      if (controller) controller?.abort();
    };
  }, [singleConversation, conversationId, dispatch]);

  const sendMessageDisabledText = messageDisabled({ selectedConversation, userType: user.user_type });

  return (
    <>
      <T.Wrapper className="container">
        {!singleConversation && (
          <>
            <Note />
            <ChatSidebar
              open={open}
              totalUnreadMessages={totalUnreadMessages}
              loading={loading}
              chatUsers={chatUsers}
              permission={permission}
              requestPermission={requestPermission}
              onSelectChat={onSelectChat}
            />
          </>
        )}

        <T.Content>
          {!singleConversation && showChatFilter && <ChatFilter />}
          {selectedConversation?.id ? (
            <>
              <ChatNavbar
                singleConversation={singleConversation}
                setOpen={setOpen}
                setShowChatFilter={setShowChatFilter}
              />
              <T.Chatbox>
                <ChatSession
                  sessionConfig={sessionConfig}
                  selectedConversation={selectedConversation}
                  themes={themes}
                  sendMessageDisabledText={sendMessageDisabledText}
                  chatAuth={chatAuth}
                />
              </T.Chatbox>
            </>
          ) : (
            <EmptyChatState isDesktop={isDesktop} />
          )}
        </T.Content>
      </T.Wrapper>
    </>
  );
};

export default TalkJS;
