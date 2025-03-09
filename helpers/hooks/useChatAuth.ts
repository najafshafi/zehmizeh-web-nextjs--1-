"use client";
import { useState, useEffect } from 'react';
import { talkJSAccessTokenApi } from '@/helpers/http/common';
import { isStagingEnv } from '@/helpers/utils/helper';
import { ChatAuthState } from '@/helpers/types/chat.type';

export const useChatAuth = (userId: string) => {
  const [chatAuth, setChatAuth] = useState<ChatAuthState>({
    loading: false,
    token: '',
  });

  const talkjsAccessTokenHandler = async () => {
    try {
      setChatAuth((prev) => ({ ...prev, loading: true }));
      const response = await talkJSAccessTokenApi();

      if (response?.token) {
        setChatAuth({ loading: false, token: response.token });
      } else {
        setChatAuth((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setChatAuth((prev) => ({ ...prev, loading: false }));
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
    }
  };

  useEffect(() => {
    if (userId && !isStagingEnv()) {
      talkjsAccessTokenHandler();
    }
  }, [userId]);

  return chatAuth;
};
