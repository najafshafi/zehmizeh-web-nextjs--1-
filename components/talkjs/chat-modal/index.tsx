import { StyledModal } from 'components/styled/StyledModal';
import { Session, Chatbox, Inbox } from '@talkjs/react';
import { ReactComponent as ChatLoading } from 'assets/icons/waiting.svg';
import TalkJS from 'pages/talk-js';
import * as T from 'pages/talk-js/style';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useAuth } from 'helpers/contexts/auth-context';
import { talkjsApiKey, isStagingEnv } from 'helpers/utils/helper';
import { talkJSAccessTokenApi } from 'helpers/http/common';
import toast from 'react-hot-toast';

interface Prop {
  show: boolean;
  closeModal: () => void;
  conversationId: string;
  freelancerName: string;
  theme: 'proposal' | 'invite';
}

const ChatModal = ({ show, closeModal, conversationId, freelancerName, theme }: Prop) => {
  const { themes } = useSelector((state: RootState) => state.talkJsChat);
  const { user } = useAuth();
  const [chatAuth, setChatAuth] = useState<{ token: string; loading: boolean }>({ loading: false, token: '' });

  const loadingComponent = (
    <T.Loading>
      <div className="d-flex align-items-center justify-content-center gap-4">
        <ChatLoading />
        <p>Your chat is loading...</p>
      </div>
    </T.Loading>
  );

  const talkjsAccessTokenHandler = async () => {
    try {
      setChatAuth({ ...chatAuth, loading: true });

      const response = await talkJSAccessTokenApi();
      if (response && response?.token) {
        setChatAuth({ loading: false, token: response.token });
      } else {
        setChatAuth({ ...chatAuth, loading: false });
        toast.error('Failed to get chat token');
      }
    } catch (error) {
      setChatAuth({ ...chatAuth, loading: false });
      toast.error('Chat authentication failed');
    }
  };

  useEffect(() => {
    if (user.user_id && !isStagingEnv() && show) {
      talkjsAccessTokenHandler();
    }
  }, [user, show]);

  // Get session parameters based on environment and token
  const sessionParams = useMemo(() => {
    if (isStagingEnv()) return {};
    return { token: chatAuth.token };
  }, [chatAuth.token]);

  return (
    <StyledModal maxwidth={767} show={show} size="sm" onHide={closeModal} centered>
      {freelancerName && (
        <Modal.Header>
          <p className="mb-0 fs-5" style={{ fontWeight: 500 }}>
            {freelancerName}
          </p>
        </Modal.Header>
      )}

      <Modal.Body style={{ padding: '1rem', height: '80vh' }}>
        {!conversationId && <div>No Chat found.</div>}

        {conversationId && (
          <T.Chatbox style={{ height: '100%' }}>
            {!isStagingEnv() && !chatAuth.token && chatAuth.loading && (
              <div className="text-center">
                <p className="mt-5 lead">authenticating chat...</p>
              </div>
            )}

            {((chatAuth.token && !chatAuth.loading) || isStagingEnv()) && (
              <Session {...sessionParams} appId={talkjsApiKey()} userId={user.user_id}>
                <Chatbox
                  messageField={{
                    placeholder: 'Type your message here...',
                    spellcheck: true,
                  }}
                  showChatHeader={false}
                  loadingComponent={loadingComponent}
                  theme={themes[theme]}
                  style={{ height: '100%' }}
                  conversationId={conversationId}
                />
              </Session>
            )}
            <Inbox />
          </T.Chatbox>
        )}
      </Modal.Body>
    </StyledModal>
  );
};

export default ChatModal;
