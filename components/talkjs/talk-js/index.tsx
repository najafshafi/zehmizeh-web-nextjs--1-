"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/helpers/contexts/auth-context";
import { AppDispatch } from "@/store/redux/store";
import {
  fetchMyConversation,
  resetConversation,
  singleConversationById,
} from "@/store/redux/slices/talkjsSlice";
import useResponsive from "@/helpers/hooks/useResponsive";
import { useNotification } from "@/helpers/hooks/useNotification";
import { talkjsApiKey, isStagingEnv } from "@/helpers/utils/helper";
import * as T from "./style";
import { useChatAuth } from "@/helpers/hooks/useChatAuth";
import { useChatMessages } from "@/helpers/hooks/useChatMessages";
import { ChatUser } from "@/store/redux/slices/talkjs.interface";
import { ChatSession } from "@/components/talkjs/ChatSession";
import { EmptyChatState } from "@/components/talkjs/EmptyChatState";
import { ChatSidebar } from "@/components/talkjs/ChatSidebar";
import { messageDisabled } from "@/components/talkjs/MessageDisabled";
import Note from "@/components/talkjs/Note";
import ChatFilter from "@/components/talkjs/chatFilter";
import ChatNavbar from "@/components/talkjs/chatNavbar";

interface Props {
  singleConversation?: string;
  conversationId?: string;
}

interface TalkJsState {
  chatlist: any[];
  loading: boolean;
  selectedConversation: any;
  filters: any;
  themes: any;
}

const TalkJS = ({ singleConversation, conversationId }: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  const [showChatFilter, setShowChatFilter] = useState<boolean>(true);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);

  const { chatlist, loading, selectedConversation, filters, themes } =
    useSelector((state: any) => (state.talkJsChat as TalkJsState) || {});

  const { isDesktop } = useResponsive();
  const { user } = useAuth();
  const dispatch: AppDispatch = useDispatch();
  const { permission, requestPermission } = useNotification();
  const chatAuth = useChatAuth(user?.user_id);
  const { chatUsers, totalUnreadMessages } = useChatMessages(chatlist, filters);

  const appId = talkjsApiKey();

  useEffect(() => {
    if (!appId) {
      console.error(
        "TalkJS API key is missing. Please set NEXT_PUBLIC_TALKJS_APP_ID in your environment variables."
      );
      setApiKeyError(true);
    }
  }, [appId]);

  const sessionConfig = useMemo(
    () => ({
      ...(!isStagingEnv() ? { token: chatAuth.token } : {}),
      desktopNotificationEnabled: permission === "granted",
      appId: appId || "",
      userId: user?.user_id,
    }),
    [chatAuth.token, permission, user?.user_id, appId]
  );

  const onSelectChat = (conversation: ChatUser) => {
    dispatch(singleConversationById(conversation.id));
    setOpen(false);
  };

  useEffect(() => {
    let controller: { abort?: () => void } = {};

    if (!singleConversation) {
      controller = dispatch(fetchMyConversation(conversationId ?? ""));
    } else {
      dispatch(singleConversationById(singleConversation));
    }

    return () => {
      dispatch(resetConversation());
      if (controller && typeof controller.abort === "function") {
        controller.abort();
      }
    };
  }, [singleConversation, conversationId, dispatch]);

  const sendMessageDisabledText = messageDisabled({
    selectedConversation,
    userType: user?.user_type,
  });

  return (
    <T.Wrapper className="xl:w-[1320px]">
      {apiKeyError && (
        <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
          TalkJS API key is missing. Please check your environment
          configuration.
        </div>
      )}

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
        {selectedConversation?.id && !apiKeyError ? (
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
  );
};

export default TalkJS;
