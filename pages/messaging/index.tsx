import { Container } from 'react-bootstrap';
import useResponsive from 'helpers/hooks/useResponsive';
import { MessageContainer, MessageHeader, TabsContainer } from './messaging.styled';
import ChatPanel from './partials/ChatPanel';
import UserList from './partials/UserList';
import Tabs from 'components/ui/Tabs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  onTabChange,
  fetchChatList,
  chatTabTitleHandler,
  updateMesssageTab,
  onParamKeyHandler,
  selectChatHandler,
  resetActiveChat,
} from '../../redux/slices/chatSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { ChatList } from 'redux/slices/chat.interface';
import { useAuth } from 'helpers/contexts/auth-context';
import axios, { CancelTokenSource } from 'axios';
import queryString from 'query-string';

function Messaging() {
  const { isDesktop } = useResponsive();
  const { user } = useAuth();
  const { invite_id, proposal_id } = queryString.parse(location.search);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const cancelTokenRef = useRef<CancelTokenSource>();

  const { activeChat, loading, chatList } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    cancelTokenRef.current = axios.CancelToken.source();
    dispatch(fetchChatList({ cancelToken: cancelTokenRef.current.token }));

    return () => {
      // if (!invite_id && !proposal_id) dispatch(resetActiveChat());
      if (cancelTokenRef.current) cancelTokenRef.current.cancel();
    };
  }, []);

  /* START ----------------------------------------- Resetting activetab when leaving messages component */
  // Task-86899ajwe It was causing issue when user opens proposals tab on messages page then navigates
  // to job details and opens messages page then activeTab was proposals and it was showing incorrect value
  useEffect(() => {
    return () => {
      dispatch(onTabChange('jobs'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* END ------------------------------------------- Resetting activetab when leaving messages component */

  useEffect(() => {
    dispatch(chatTabTitleHandler(user.user_type));
  }, [user]);

  useEffect(() => {
    if (!loading.list) chatParamsHandler();
  }, [loading, chatList]);

  const chatParamsHandler = () => {
    if (!invite_id && !proposal_id) return;

    const flag = invite_id ? 'invities' : 'proposals';

    const id: number = flag === 'invities' ? Number(invite_id) : Number(proposal_id);
    if (typeof id !== 'number' || chatList[flag].length === 0) return;

    // Change the tab to respectivily to the param
    dispatch(onParamKeyHandler({ tab: flag }));
  };

  return (
    <Container className="mb-5 mt-4 content-hfill">
      {/* <MessageHeader>
        <h1 className="fs-32 mb-0">Messages</h1>
        <TabsContainer className="tabs">
          <Tabs
            tabs={[
              {
                id: 1,
                label: 'Projects',
                key: 'jobs',
              },
              {
                id: 2,
                label: 'Proposals',
                key: 'proposals',
              },
              {
                id: 3,
                label: 'Invited',
                key: 'invities',
              },
            ]}
            counts={{ ...unreadMessages }}
            activeTab={activeTab}
            onTabChange={(tab: keyof ChatList) => {
              if (window.location.pathname !== '/messages') navigate('/messages');
              dispatch(onTabChange(tab));
            }}
            breakPoint="1200px"
            className="tabs-container"
          />
        </TabsContainer>
      </MessageHeader> */}

      <MessageContainer>
        {!isDesktop && activeChat === null ? (
          <div className="m-userlist--wrapper">
            {/* {!inviteId && <UserList proposalId={proposalId} />}
            {!proposalId && inviteId && <UserList inviteId={inviteId} />} */}
            <UserList />
          </div>
        ) : null}
        {isDesktop ? (
          <div className="m-userlist--wrapper">
            {/* {!inviteId && <UserList proposalId={proposalId} />}
            {!proposalId && inviteId && <UserList inviteId={inviteId} />} */}
            <UserList />
          </div>
        ) : null}
        {!isDesktop && activeChat !== null ? <ChatPanel /> : null}
        {isDesktop ? <ChatPanel /> : null}
      </MessageContainer>
    </Container>
  );
}

export default Messaging;
