import DeletePrompt from '@/components/ui/DeletePropmpt';
import { useAuth } from '@/helpers/contexts/auth-context';
import messageService from '@/helpers/http/message';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { MessageProps } from '../messaging.types';
import MessageBubble from './MessageBubble';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/redux/store';
import { deleteChatFromMessages } from '@/store/redux/slices/chatSlice';
import { useDispatch } from 'react-redux';
import { breakpoints } from '@/helpers/hooks/useResponsive';
import { useNonInitialEffect } from '@/helpers/hooks/useNonInitialEffect';
import { TimezoneUI } from './TimezoneUI';

const maxHeight = 530;

const Wrapper = styled.div`
  flex: 1;
  padding: 0 1.125rem;
  display: flex;
  flex-direction: column;
  max-height: ${maxHeight}px;
  overflow-y: auto;
  position: relative;
`;

const MessageDate = styled.div<{ isFromSingleMessaging }>`
  position: sticky;
  top: 10px;
  display: inline;
  margin: 4px;
  span {
    background: ${(props) => props.theme.colors.gray2};
    padding: 4px 14px;
    border-radius: 20px;
  }
  @media ${breakpoints.tablet} {
    top: ${(props) => (props.isFromSingleMessaging ? '' : '36px')};
  }
`;

const Conversation = ({
  searchedChat,
  showMilestoneAlert,
  isFromSingleMessaging = false,
}: {
  searchedChat?: MessageProps;
  showMilestoneAlert?: boolean;
  isFromSingleMessaging?: boolean;
}) => {
  const { user } = useAuth();
  const dispatch: AppDispatch = useDispatch();
  const { loading: messageLoading, activeChat, messages, showImg } = useSelector((state: RootState) => state.chat);
  const [blurFlag, setBlurFlag] = useState<boolean>(showImg);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [deletePromptState, setDeletePromptState] = React.useState<{
    show: boolean;
    chatId?: number;
  }>({
    show: false,
  });

  const remoteUser =
    user?.user_id !== activeChat?._from_user_data?.user_id ? activeChat?._from_user_data : activeChat?._to_user_data;

  useEffect(() => {
    setBlurFlag(showImg);
  }, [showImg]);

  const isRemote = (message: MessageProps) => {
    return message._from_user_id !== user.user_id;
  };

  /** @function This function will open the delete prompt
   * @param {number} chatId - to be deleted
   */
  const handleDeleteAttachment = (chatId: number) => () => {
    setDeletePromptState({
      show: true,
      chatId,
    });
  };

  /** @function This will close the delete prompt */
  const closeDeletePrompt = () => {
    setDeletePromptState({
      show: false,
    });
  };

  /** @function This will call an api to delete the message (Attchament) */
  const onDeleteAttachment = () => {
    setLoading(true);
    const promise = messageService.deleteMessage(deletePromptState.chatId);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: (res) => {
        closeDeletePrompt();
        setLoading(false);
        dispatch(deleteChatFromMessages({ chat_id: deletePromptState.chatId }));
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const searchChatHandler = () => {
    if (!searchedChat) return null;
    if (!searchedChat.chat_id) return null;

    const message = document.getElementById(`single-message-${searchedChat.chat_id}`);
    if (message) message.scrollIntoView({ behavior: 'smooth' });
  };

  useNonInitialEffect(() => {
    searchChatHandler();
    // if (searchedChat) {
    //   searchMessages({
    //     type: 'up',
    //     chat: searchedChat,
    //     cb: scrollChatToBottom,
    //   });
    // } else {
    //   fetchMessages({
    //     cb: scrollChatToBottom,
    //     chat: activeChat,
    //   });
    //   return () => {
    //     clearInterval(intervalRef.current);
    //   };
    // }
  }, [searchedChat]);

  const messagesByDate = useMemo(() => {
    if (messages) {
      return messages.reduce((acc, item) => {
        let currentDate = moment(item?.date_created).format('MMM Do YYYY');
        if (currentDate === 'Invalid date') currentDate = moment().format('MMM Do YYYY');
        if (currentDate in acc) {
          acc[currentDate].push(item);
        } else {
          acc[currentDate] = [item];
        }
        return acc;
      }, {});
    }
    return {};
  }, [messages]);

  /* START ----------------------------------------- IF it receives message proposal is opened then showing yellow scrollable line below message */
  const isProposalReopenedText = useMemo(() => {
    if (activeChat?.status_change_timestamp?.pending_date) {
      if (user.user_type === 'client') {
        return `You reopened this proposal - ${moment(activeChat.status_change_timestamp.pending_date).format(
          'MMM DD, YYYY'
        )}`;
      }
      if (user.user_type === 'freelancer') {
        return `The client has reopened your project proposal - ${moment(
          activeChat.status_change_timestamp.pending_date
        ).format('MMM DD, YYYY')}`;
      }
    }
  }, [activeChat?.status_change_timestamp?.pending_date, user?.user_type]);
  /* END ------------------------------------------- IF it receives message proposal is opened then showing yellow scrollable line below message */

  if (showMilestoneAlert)
    return (
      <Wrapper id="message-container">
        <div className="p-5 fs-18">
          {user.user_type === 'freelancer' ? (
            <p>
              Before submitting your first milestone or hours submission, message your client on the project details
              page -{' '}
              <Link style={{ color: '#f2b420' }} to={`/job-details/${activeChat?._job_post_id}/messages`}>
                {' '}
                here.
              </Link>
            </p>
          ) : (
            <p>
              Before the freelancer submits the first milestone or hours submission, message them on the project details
              page -{' '}
              <Link style={{ color: '#f2b420' }} to={`/client-job-details/${activeChat?._job_post_id}/messages`}>
                {' '}
                HERE.
              </Link>
            </p>
          )}

          <p className="mt-5">
            Messages in this chat will still be marked <b>'Unread'</b> until they're seen on the project details page.
          </p>
        </div>
      </Wrapper>
    );
  return (
    <Wrapper id="message-container">
      {messageLoading.message ? <div className="text-center fs-14"> Loading...</div> : null}

      {Object.entries(messagesByDate).map(([key, value]: [string, MessageProps[]]) => {
        return (
          <>
            {value?.length > 0 && (
              <MessageDate className="text-center my-3" isFromSingleMessaging={isFromSingleMessaging}>
                <span>{key}</span>
              </MessageDate>
            )}
            {value?.length > 0 &&
              value.map((message, index) => {
                // Blur image id for chatProvider context state

                return (
                  <>
                    <MessageBubble
                      key={`chat-key-${message.chat_id}`}
                      author={isRemote(message) ? 'remote' : 'self'}
                      data={message}
                      handleDelete={handleDeleteAttachment(message.chat_id)}
                      state={[blurFlag, setBlurFlag]}
                    />
                    {/* START ----------------------------------------- Checking message "Proposal has beed reopened" from admin then showing yellow line */}
                    {(message?.message_text || '').includes('Project proposal has been reopened') &&
                      (message?.message_text || '').includes('Message from ZMZ Admin') &&
                      isProposalReopenedText && (
                        <div className="message-limit-note-warn mb-3">{isProposalReopenedText}</div>
                      )}
                    {/* END ------------------------------------------- Checking message "Proposal has beed reopened" from admin then showing yellow line */}
                  </>
                );
              })}
          </>
        );
      })}

      <DeletePrompt
        loading={loading}
        show={deletePromptState.show}
        toggle={closeDeletePrompt}
        text="Are you sure you want to delete this message?"
        onDelete={onDeleteAttachment}
        cancelButtonText="Cancel"
      />
    </Wrapper>
  );
};

export default Conversation;
