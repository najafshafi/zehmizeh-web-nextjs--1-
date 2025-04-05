"use client";

import { Session, Chatbox, Inbox } from "@talkjs/react";
import ChatLoading from "@/public/icons/waiting.svg";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { useAuth } from "@/helpers/contexts/auth-context";
import { talkjsApiKey, isStagingEnv } from "@/helpers/utils/helper";
import { talkJSAccessTokenApi } from "@/helpers/http/common";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  closeModal: () => void;
  conversationId: string;
  freelancerName: string;
  theme: "proposal" | "invite";
}

// TalkJS theme options interface
interface ThemeOptions {
  // Theme options properties
  [key: string]: string | number | boolean | ThemeOptions | undefined;
}

// Define interface for TalkJsChat state
interface TalkJsChatState {
  themes: {
    [key: string]: string | ThemeOptions;
  };
}

const ChatModal = ({
  show,
  closeModal,
  conversationId,
  freelancerName,
  theme,
}: Props) => {
  const { themes } = useSelector(
    (state: RootState) =>
      (state as unknown as { talkJsChat: TalkJsChatState }).talkJsChat
  );
  const { user } = useAuth();
  const [chatAuth, setChatAuth] = useState<{ token: string; loading: boolean }>(
    {
      loading: false,
      token: "",
    }
  );

  const loadingComponent = (
    <div className="flex items-center justify-center gap-4 p-4">
      <ChatLoading />
      <p className="text-lg">Your chat is loading...</p>
    </div>
  );

  const talkjsAccessTokenHandler = useCallback(async () => {
    try {
      setChatAuth((prevState) => ({ ...prevState, loading: true }));

      const response = await talkJSAccessTokenApi();
      if (response?.token) {
        setChatAuth({ loading: false, token: response.token });
      } else {
        setChatAuth((prevState) => ({ ...prevState, loading: false }));
        toast.error("Failed to get chat token");
      }
    } catch (error) {
      console.error("Error fetching chat token:", error);
      setChatAuth((prevState) => ({ ...prevState, loading: false }));
      toast.error("Chat authentication failed");
    }
  }, []);

  useEffect(() => {
    if (user.user_id && !isStagingEnv() && show) {
      talkjsAccessTokenHandler();
    }
  }, [user, show, talkjsAccessTokenHandler]);

  // Get session parameters based on environment and token
  const sessionParams = useMemo(() => {
    if (isStagingEnv()) return {};
    return { token: chatAuth.token };
  }, [chatAuth.token]);

  // Ensure talkjsApiKey never returns undefined
  const apiKey = useMemo(() => talkjsApiKey() || "", []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[767px] bg-white rounded-lg shadow-xl mx-4">
        {/* Header */}
        {freelancerName && (
          <div className="p-4 border-b">
            <p className="text-lg font-medium">{freelancerName}</p>
          </div>
        )}

        {/* Body */}
        <div className="p-4 h-[80vh]">
          {!conversationId && <div>No Chat found.</div>}

          {conversationId && (
            <div className="h-full">
              {!isStagingEnv() && !chatAuth.token && chatAuth.loading && (
                <div className="text-center">
                  <p className="mt-5 text-lg">authenticating chat...</p>
                </div>
              )}

              {((chatAuth.token && !chatAuth.loading) || isStagingEnv()) && (
                <Session
                  {...sessionParams}
                  appId={apiKey}
                  userId={user.user_id}
                >
                  <Chatbox
                    messageField={{
                      placeholder: "Type your message here...",
                      spellcheck: true,
                    }}
                    showChatHeader={false}
                    loadingComponent={loadingComponent}
                    theme={themes[theme]}
                    style={{ height: "100%" }}
                    conversationId={conversationId}
                  />
                </Session>
              )}
              <Inbox />
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
