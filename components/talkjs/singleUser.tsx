import BlurredImage from "@/components/ui/BlurredImage";
import { useMemo } from "react";
import { SingleUserChatAction, UnreadCount } from "./style";
import cns from "classnames";
import { convertToTitleCase } from "@/helpers/utils/misc";
import { ChatSingleUser } from "@/components/messaging-page/messaging.styled";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { isClosedorDeclined } from "@/helpers/utils/helper";
import { ChatUser, chatType } from "@/store/redux/slices/talkjs.interface";

interface Prop {
  conversation: ChatUser;
  onSelectChat: (conversation: ChatUser) => void;
}

// Define a minimal interface for what we actually need from the talkJsChat state
interface MinimalTalkJsState {
  selectedConversation?: { id?: string } | null;
}

const SingleUser = ({ conversation, onSelectChat }: Prop) => {
  const { user } = useAuth();
  const user_type = user?.user_type ?? "";

  // Use a safer approach with unknown cast first
  const talkJsState = useSelector(
    (state: RootState) =>
      (state as unknown as { talkJsChat?: MinimalTalkJsState }).talkJsChat
  ) || { selectedConversation: null };

  const selectedConversationId = talkJsState.selectedConversation?.id ?? "";

  const userImage = useMemo(() => {
    let url = "/images/default_avatar.png";

    if (user_type === "client" && "freelancerUserImg" in conversation.custom)
      url = conversation?.custom?.freelancerUserImg || url;

    if (user_type === "freelancer" && "clientUserImg" in conversation.custom)
      url = conversation?.custom?.clientUserImg || url;

    return url;
  }, [conversation, user_type]);

  return (
    <ChatSingleUser
      $chatType={conversation.custom.type as chatType}
      className={cns("flex items-center", {
        active: conversation.id === selectedConversationId,
      })}
      onClick={() => onSelectChat(conversation)}
      title={`${convertToTitleCase(conversation?.custom?.projectName || "")}`}
    >
      <div className="userlistitem__avatar chat-user-list text-xs">
        <BlurredImage
          src={userImage}
          height="48px"
          width="48px"
          overlayText="Click to view"
        />
      </div>

      <div className="userlistitem__info flex-1">
        <span className="fs-12 conversation-type-text">
          {conversation.custom.type}
        </span>
        <div
          className={cns("userlistitem--info-name capitalize", {
            "fw-700": true,
          })}
        >
          {
            conversation.custom[
              user_type === "client" ? "freelancerName" : "clientName"
            ]
          }
        </div>
        <SingleUserChatAction $chatType={conversation.custom.type as chatType}>
          <div className="userlistitem--info-msg capital-first-ltr">
            <span>{conversation.custom.projectName}</span>
            {isClosedorDeclined(conversation) && (
              <div className="closed-project">
                {isClosedorDeclined(conversation)}
              </div>
            )}
          </div>
        </SingleUserChatAction>
      </div>
      {conversation.unreadMessageCount > 0 && (
        <UnreadCount $chatType={conversation.custom.type as chatType}>
          {conversation.unreadMessageCount}
        </UnreadCount>
      )}
    </ChatSingleUser>
  );
};
export default SingleUser;
