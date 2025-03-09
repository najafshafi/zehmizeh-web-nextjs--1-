// src/helpers/types/chat.type.ts
import { chatType, ChatUser, ChatPayload, Custom } from 'redux/slices/talkjs.interface';

export interface ChatAuthState {
  loading: boolean;
  token: string;
}

export interface ChatSessionProps {
  sessionConfig: {
    token?: string;
    desktopNotificationEnabled: boolean;
    appId: string;
    userId: string;
  };
  selectedConversation: ChatUser;
  themes: Record<chatType, any>;
  sendMessageDisabledText: React.ReactNode;
  chatAuth: ChatAuthState;
}

export interface ChatSidebarProps {
  open: boolean;
  totalUnreadMessages: number;
  loading: boolean;
  chatUsers: ChatUser[];
  permission: NotificationPermission;
  requestPermission: () => void;
  onSelectChat: (conversation: ChatUser) => void;
}

export interface ChatFilterProps {
  filters: {
    job: string;
    type: string;
    status: string;
  };
  onFilterChange: (type: string, value: string) => void;
}

export interface ChatNavbarProps {
  singleConversation?: string;
  setOpen: (value: boolean) => void;
  setShowChatFilter: (value: boolean) => void;
  selectedConversation?: ChatUser;
}

export interface TalkJSProps {
  singleConversation?: string;
}

export interface TalkJSReduxState {
  chatlist: ChatUser[];
  loading: boolean;
  selectedConversation: ChatUser | null;
  filters: {
    job: string;
    type: string;
    status: string;
  };
  themes: Record<chatType, any>;
}

export interface SendMessageDisabledState {
  isDisabled: boolean;
  message?: React.ReactNode;
  type?: 'proposal' | 'invite' | 'job';
  date?: string;
}

// Hook return types
export interface UseChatMessagesReturn {
  chatUsers: ChatUser[];
  totalUnreadMessages: number;
}

export interface UseSendMessageDisabledReturn {
  sendMessageDisabledText: React.ReactNode | undefined;
}

// Utility types
export interface ChatFilters {
  job: string;
  type: string;
  status: string;
}

export interface MessageStatus {
  isDisabled: boolean;
  message?: string;
  conversationType?: chatType;
  date?: string;
}

// Theme types
export interface ChatTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  messageStyles: {
    sent: {
      background: string;
      text: string;
    };
    received: {
      background: string;
      text: string;
    };
  };
}

export interface ChatThemes {
  job: ChatTheme;
  invite: ChatTheme;
  proposal: ChatTheme;
}
