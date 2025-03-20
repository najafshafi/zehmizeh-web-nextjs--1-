import * as T from "./style";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsBell, BsBellSlash } from "react-icons/bs";
import { ChatSidebarProps } from "@/helpers/types/chat.type";
import SingleUser from "@/components/talkjs/singleUser";

export const ChatSidebar = ({
  open,
  totalUnreadMessages,
  loading,
  chatUsers,
  permission,
  requestPermission,
  onSelectChat,
}: ChatSidebarProps) => {
  return (
    <T.Sidebar openState={open ? "open" : ""}>
      <T.ChatListHeader>
        <div className="header-content">
          <p className="inbox-title">
            Inbox {totalUnreadMessages > 0 ? `(${totalUnreadMessages})` : "(1)"}
          </p>
          <T.NotificationToggle
            active={permission === "granted"}
            onClick={() => {
              if (permission === "granted") {
                alert(
                  "To disable notifications, please use your browser settings"
                );
              } else {
                requestPermission();
              }
            }}
            title={
              permission === "granted"
                ? "Notifications enabled"
                : "Enable notifications"
            }
          >
            {permission === "granted" ? <BsBell /> : <BsBellSlash />}
          </T.NotificationToggle>
          <Link to="/messages">Older chats</Link>
        </div>
      </T.ChatListHeader>

      {loading && chatUsers.length === 0 && (
        <div className="flex items-center justify-center gap-2 mt-5 fetching-chat-loader">
          <Spinner animation="border" size="sm" />
          <p className="mb-0">fetching chatlist...</p>
        </div>
      )}

      {!loading && chatUsers.length === 0 && (
        <div className="text-center py-5">
          <p>No Chats Found.</p>
        </div>
      )}

      {(!loading || chatUsers.length > 0) &&
        chatUsers.map((conversation, index) => (
          <SingleUser
            onSelectChat={onSelectChat}
            conversation={conversation}
            key={`talkjs-single-user-${index}`}
          />
        ))}
    </T.Sidebar>
  );
};
