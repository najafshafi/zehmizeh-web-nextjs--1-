import { useEffect, useMemo, useState } from 'react';
import { convertToTitleCase } from 'helpers/utils/misc';
import { getUserName } from '../controllers/useUsers';
import cns from 'classnames';
import { Spinner } from 'react-bootstrap';
import SearchBox from 'components/ui/SearchBox';
import { useNavigate } from 'react-router-dom';
import BlurredImage from 'components/ui/BlurredImage';
import { AppDispatch, RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { handleBlurImage, onTabChange, searchChatList, selectChatHandler } from '../../../redux/slices/chatSlice';
import { Invite, Job, Proposal, UnreadMessages } from '../../../redux/slices/chat.interface';
import { LiaAngleDownSolid } from 'react-icons/lia';
import { IoSearchOutline } from 'react-icons/io5';
import { useAuth } from 'helpers/contexts/auth-context';
import queryString from 'query-string';
import { MessageSidebarHeader, ChatSingleUser, Wrapper, SingleUserChatAction } from '../messaging.styled';
import { chatType } from 'redux/slices/talkjs.interface';

function UserList() {
  const { user } = useAuth();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { invite_id, proposal_id } = queryString.parse(location.search);
  const [chatTypes] = useState<{ id: number; label: string; key: keyof UnreadMessages }[]>([
    {
      id: 1,
      label: 'Jobs',
      key: 'jobs',
    },
    {
      id: 2,
      label: 'Proposals',
      key: 'proposals',
    },
    {
      id: 3,
      label: 'Invitees',
      key: 'invities',
    },
  ]);

  const [show, setShow] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const { chatList, loading, activeTab, activeChat, unreadMessages, search } = useSelector(
    (state: RootState) => state.chat
  );
  const totalMessages = unreadMessages.invities + unreadMessages.jobs + unreadMessages.proposals;

  // const [searchTerm, setSearchTerm] = useState<string>('');

  const onSelectChatHandler = (chatItem: Invite & Proposal & Job, index: number) => {
    if (loading.message) return;

    const remoteUserId =
      user.user_id !== chatItem._from_user_data.user_id ? chatItem._from_user_data : chatItem._to_user_data;

    dispatch(selectChatHandler({ chatItem, index, remoteUserId: remoteUserId.user_id }));
  };

  const paramsChatSelectHandler = () => {
    if (chatList[activeTab].length === 0) return;

    const flag = invite_id ? 'invities' : 'proposals';
    const id: number = flag === 'invities' ? Number(invite_id) : Number(proposal_id);

    if (typeof id !== 'number' || chatList[flag].length === 0) return;

    chatList[activeTab].map((chat: Invite & Job & Proposal, index: number) => {
      if ((flag === 'invities' && chat.invite_id === id) || (flag === 'proposals' && chat.proposal_id === id)) {
        onSelectChatHandler(chat, index);
        navigate('/messages-new');
      }
    });
  };

  const showToggle = (flag) => {
    if (flag === 'dropdown') setShow(!show);
    else setShowSearch(!showSearch);
  };

  const onChangeChatType = (type: keyof UnreadMessages) => {
    if (window.location.pathname !== '/messages') navigate('/messages');
    dispatch(onTabChange(type));
    setShow(false);
  };

  useEffect(() => {
    paramsChatSelectHandler();
  }, [chatList, activeTab]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest(`.message-type-dropdown-toggle`)) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <>
      <MessageSidebarHeader className="m-panel--header">
        <div>
          <span className="title text-uppercase">Inbox</span>
          {totalMessages > 0 && <span className="fs-20 fw-400 ms-1">({totalMessages})</span>}
        </div>

        <div className="message-sidebar-header-right">
          <div
            className="message-type-dropdown-toggle d-flex align-items-center gap-2"
            onClick={() => showToggle('dropdown')}
          >
            <p className="mb-0 cursor-pointer text-capitalize">{activeTab === 'invities' ? 'Invitees' : activeTab} </p>
            <LiaAngleDownSolid size={20} />
          </div>
          <IoSearchOutline className="message-type-dropdown-toggle" onClick={() => showToggle('search')} size={18} />

          <ul className={`message-dropdown-options ${show ? 'd-block' : 'd-none'}`}>
            {chatTypes.map((ct, index) => (
              <li onClick={() => onChangeChatType(ct.key)} key={`chat-types-${ct.id}-${index}`}>
                {ct.label}
              </li>
            ))}
          </ul>
        </div>

        {/* {users?.unseen_count > 0 && <span className="fs-20 fw-400 ms-1">({users.unseen_count})</span>} */}
      </MessageSidebarHeader>
      {showSearch && (
        <SearchBox
          value={search.chatList}
          onChange={(e) => dispatch(searchChatList({ searchTerm: e.target.value }))}
          enableBorder={true}
        />
      )}
      <Wrapper>
        {loading.list ? (
          <div className="text-center">
            <Spinner animation="grow" />
            <p>Loading chats...</p>
          </div>
        ) : (
          <>
            {chatList[activeTab].map((usr: Invite & Job & Proposal, index: number) => {
              if (search.chatList) {
                const remoteUser =
                  user.user_id !== usr._from_user_data.user_id ? usr._from_user_data : usr._to_user_data;

                const remoteUserFullName = `${remoteUser.first_name} ${remoteUser.last_name}`.toLocaleLowerCase();

                if (!remoteUserFullName.includes(search.chatList.toLocaleLowerCase())) return <></>;
              }
              return (
                <UserListItem
                  data={usr}
                  className={cns({
                    active: usr._job_post_id === activeChat?._job_post_id && usr.proposal_id === activeChat.proposal_id,
                  })}
                  key={`${usr._job_post_id}_${index}`}
                  onSelectChat={() => onSelectChatHandler(usr, index)}
                />
              );
            })}
          </>
        )}

        {!loading.list && chatList[activeTab].length === 0 ? <div className="p-2 fs-18">No Messages</div> : null}
      </Wrapper>
    </>
  );
}

const UserListItem = ({
  className,
  data,
  onSelectChat,
}: {
  className?: string;
  data: Invite & Job & Proposal;
  onSelectChat: () => void;
}) => {
  const { user, isLoading } = useAuth();

  // Only showing it to freelancer and proposals tab in message page
  // If project was deleted or assigned to someone else then it'll show "Closed"
  const isClosedorDeclined = useMemo(() => {
    if (data?.proposal_status || data?.invite_status)
      if (['deleted', 'active', 'closed'].includes(data?.job_status)) {
        return 'Closed';
      } else if (data?.proposal_status === 'denied') {
        return 'Declined';
      } else if (data?.invite_status === 'canceled') {
        return 'Canceled';
      }
    return '';
  }, [data]);

  const { activeChat, activeTab } = useSelector((state: RootState) => state.chat);
  const [showImg, setShowImg] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const remoteUser = user.user_id !== data._from_user_data.user_id ? data._from_user_data : data._to_user_data;

  const handleBlur = () => {
    let check: boolean = false;

    if (!activeChat) return;
    if (activeTab === 'jobs' && activeChat._job_post_id === data._job_post_id) {
      check = true;
    }

    if (activeTab === 'proposals' && activeChat.proposal_id === data.proposal_id) {
      check = true;
    }

    if (activeTab === 'invities' && activeChat.invite_id === data.invite_id) {
      check = true;
    }

    if (check === true) dispatch(handleBlurImage(showImg));
  };

  useEffect(() => {
    handleBlur();
  }, [showImg]);

  if (isLoading) return <></>;

  const activeTheme: chatType = activeTab === 'invities' ? 'invite' : activeTab === 'jobs' ? 'job' : 'proposal';

  return (
    <ChatSingleUser
      chatType={activeTheme}
      className={`d-flex align-items-center ${className}`}
      onClick={onSelectChat}
      title={`Project: ${convertToTitleCase(data.job_title)}`}
    >
      <div className="userlistitem__avatar chat-user-list">
        <BlurredImage
          state={[showImg, setShowImg]}
          src={remoteUser?.user_image || '/images/default_avatar.png'}
          height="48px"
          width="48px"
          overlayText="Click to view"
        />
      </div>
      <div className="userlistitem__info flex-1">
        <div
          className={cns('userlistitem--info-name text-capitalize', {
            'fw-700': data.unread_count > 0,
          })}
        >
          {remoteUser ? getUserName(remoteUser) : ''}
        </div>
        <SingleUserChatAction chatType={activeTheme}>
          <div className="userlistitem--info-msg capital-first-ltr">
            <span>{convertToTitleCase(data.job_title)}</span>
          </div>
          {isClosedorDeclined && <span className="closed-project">{isClosedorDeclined}</span>}
        </SingleUserChatAction>
      </div>
      {data.unread_count > 0 ? <div className="userlistitem__count">{data.unread_count}</div> : null}
    </ChatSingleUser>
  );
};

export default UserList;
