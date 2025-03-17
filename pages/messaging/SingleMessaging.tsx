import { useEffect, useRef, useState } from 'react';
import { MessageContainer } from './messaging.styled';
import ChatPanel from './partials/ChatPanel';
import { useAuth } from '@/helpers/contexts/auth-context';
import { AppDispatch, RootState } from '@/store/redux/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchChatList, selectChatHandler } from '@/store/redux/slices/chatSlice';
import axios, { CancelTokenSource } from 'axios';
import * as I from '@/store/redux/slices/chat.interface';
import { Spinner } from 'react-bootstrap';
import { talkJsFetchSingleConversation } from '@/helpers/http/common';
import TalkJS from '@/pages/talk-js';

function SingleMessaging({ id }: { id: string }) {
  const { chatList, loading } = useSelector((state: RootState) => state.chat);

  // checking for the chat thred  in talkjs
  const [newChatLoading, setNewChatLoading] = useState<boolean>(true);
  const [isChatExist, setIsChatExist] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const cancelTokenRef = useRef<CancelTokenSource>();
  const { user } = useAuth();

  const onSelectChat = (chatItem: I.Invite & I.Proposal & I.Job, index: number) => {
    const remoteUserId =
      user.user_id !== chatItem._from_user_data.user_id ? chatItem._from_user_data : chatItem._to_user_data;

    const payload = { chatItem, index, remoteUserId: remoteUserId.user_id };
    dispatch(selectChatHandler(payload));
  };

  const handleChatToActive = () => {
    // const chatItem: I.Invite & I.Proposal & I.Job = chatList['jobs'].find(
    //   (job: I.Invite & I.Proposal & I.Job) => job._job_post_id === id
    // );
    // const index: number = chatList['jobs'].findIndex((job: I.Invite & I.Proposal & I.Job) => job._job_post_id === id);
    // if (!chatItem) return null;

    // dispatch(selectChatHandler({ chatItem, index }));
    chatList['jobs'].map((chatItem: I.Invite & I.Proposal & I.Job, index: number) => {
      if (chatItem._job_post_id === id) onSelectChat(chatItem, index);
    });
  };

  useEffect(() => {
    if (newChatLoading === false) {
      if (user.user_id) {
        cancelTokenRef.current = axios.CancelToken.source();
        dispatch(fetchChatList({ cancelToken: cancelTokenRef.current.token }));
      }

      return () => {
        if (cancelTokenRef.current) cancelTokenRef.current.cancel();
      };
    }
  }, [user, newChatLoading]);

  const checkChatInTalkJs = async () => {
    try {
      const { conversation } = await talkJsFetchSingleConversation(id);
      setNewChatLoading(false);
      setIsChatExist(conversation?.data !== null);
    } catch (error) {
      setNewChatLoading(false);
      setIsChatExist(false);
    }
  };

  useEffect(() => {
    if (chatList.jobs.length > 0 && newChatLoading === false) handleChatToActive();
  }, [chatList, user, newChatLoading]);

  useEffect(() => {
    if (id && newChatLoading === true) checkChatInTalkJs();
  }, [id]);

  if (isChatExist)
    return (
      <MessageContainer>
        <TalkJS key={'single-chat-talkjs'} singleConversation={id} />
      </MessageContainer>
    );

  return (
    <MessageContainer>
      <>
        {loading.list || loading.message || newChatLoading ? (
          <div
            className="text-center py-5"
            style={{
              flex: 1,
            }}
          >
            <div className="d-flex align-items-center justify-content-center gap-4">
              <Spinner animation="border" />
              <p className="mb-0">loading messages...</p>
            </div>
          </div>
        ) : (
          <ChatPanel showMilestoneAlert={false} isFromSingleMessaging />
        )}
      </>
    </MessageContainer>
  );
}

export default SingleMessaging;
