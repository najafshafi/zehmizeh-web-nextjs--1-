import { Session, Chatbox } from '@talkjs/react';
import * as T from './style';
import React, { useMemo } from 'react';
import { isStagingEnv } from '@/helpers/utils/helper';
import { ChatSessionProps } from '@/helpers/types/chat.type';
import { LoadingChat } from './LoadingChat';

export const ChatSession = ({
  sessionConfig,
  selectedConversation,
  themes,
  sendMessageDisabledText,
  chatAuth,
}: ChatSessionProps) => {
  // Enhanced logic for message-sending allowance
  const isUserAllowedToSendMessages = !(
    sendMessageDisabledText &&
    React.isValidElement(sendMessageDisabledText) &&
    React.Children.toArray(sendMessageDisabledText.props.children).some(
      (child) => typeof child === 'string' && child.trim().length > 0
    )
  );

  if (!isStagingEnv() && !chatAuth.token && chatAuth.loading) {
    return (
      <div className="text-center">
        <p className="mt-5 lead">authenticating chat...</p>
      </div>
    );
  }

  if ((chatAuth.token && !chatAuth.loading) || isStagingEnv()) {
    return (
      <>
        <Session {...sessionConfig}>
          <Chatbox
            messageField={{
              visible: isUserAllowedToSendMessages,
              placeholder: 'Type your message here...',
              spellcheck: true,
            }}
            showChatHeader={false}
            loadingComponent={<LoadingChat />}
            theme={themes[selectedConversation?.custom?.type] ?? themes['job']}
            className="talkjs-chatbox"
            conversationId={selectedConversation.id}
          />
        </Session>
        <T.SendMessageDisabledText>{sendMessageDisabledText}</T.SendMessageDisabledText>
      </>
    );
  }

  return null;
};
