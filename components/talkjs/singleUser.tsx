import BlurredImage from '@/components/ui/BlurredImage';
import { useMemo, useState } from 'react';
import { SingleUserChatAction, UnreadCount } from './style';
import cns from 'classnames';
import { convertToTitleCase } from '@/helpers/utils/misc';
import { ChatSingleUser } from '@/pages/messaging/messaging.styled';
import { useAuth } from '@/helpers/contexts/auth-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/redux/store';
import { isClosedorDeclined } from '@/helpers/utils/helper';

interface Prop {
  conversation: ChatUser;
  onSelectChat: (conversation: ChatUser) => void;
}

const SingleUser = ({ conversation, onSelectChat }: Prop) => {
  const { user } = useAuth();
  const user_type = user?.user_type ?? '';
  const [showImg, setShowImg] = useState<boolean>(false);

  const { selectedConversation } = useSelector((state: RootState) => state.talkJsChat);

  const selectedConversationId = selectedConversation?.id ?? '';

  const userImage = useMemo(() => {
    let url = '/images/default_avatar.png';

    if (user_type === 'client' && 'freelancerUserImg' in conversation.custom)
      url = conversation?.custom?.freelancerUserImg;

    if (user_type === 'freelancer' && 'clientUserImg' in conversation.custom) url = conversation?.custom?.clientUserImg;

    return url;
  }, [conversation]);

  return (
    <ChatSingleUser
      chatType={conversation.custom.type}
      className={cns('d-flex align-items-center', { active: conversation.id === selectedConversationId })}
      onClick={() => onSelectChat(conversation)}
      title={`${convertToTitleCase(conversation?.custom?.projectName)}`}
    >
      <div className="userlistitem__avatar chat-user-list">
        <BlurredImage
          state={[showImg, setShowImg]}
          src={userImage}
          height="48px"
          width="48px"
          overlayText="Click to view"
        />
      </div>

      <div className="userlistitem__info flex-1">
        <span className="fs-12 conversation-type-text">{conversation.custom.type}</span>
        <div
          className={cns('userlistitem--info-name text-capitalize', {
            'fw-700': true,
          })}
        >
          {conversation.custom[user_type === 'client' ? 'freelancerName' : 'clientName']}
        </div>
        <SingleUserChatAction chatType={conversation.custom.type}>
          <div className="userlistitem--info-msg capital-first-ltr">
            <span>{conversation.custom.projectName}</span>
            {isClosedorDeclined(conversation) && (
              <div className="closed-project">{isClosedorDeclined(conversation)}</div>
            )}
          </div>
        </SingleUserChatAction>
      </div>
      {conversation.unreadMessageCount > 0 && (
        <UnreadCount chatType={conversation.custom.type}>{conversation.unreadMessageCount}</UnreadCount>
      )}
    </ChatSingleUser>
  );
};
export default SingleUser;
