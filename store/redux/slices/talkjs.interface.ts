interface ChatParticipant {
  access: string;
  notify: boolean;
  isUnread: boolean;
}

interface LastMessage {
  id: string;
  type: string;
  origin: string;
  location: string | null;
  text: string;
  attachment: string | null;
  custom: Custom;
  conversationId: string;
  createdAt: number;
  senderId: string;
  editedAt: number | null;
  referencedMessageId: string | null;
  readBy: string[];
}

export interface ChatPayload {
  job_post_id?: string;
  job_status?: string;
  proposal_id?: string;
  proposal_status?: string;
  invite_id?: string;
  invite_status?: string;
  job_end_date?: string;
  job_date_modified?: string;
  proposal_date_modified?: string;
  invite_date_modified?: string;
  job_start_date?: string;
}

export type chatType = 'invite' | 'job' | 'proposal';
export type chatTypeWithAll = 'invities' | 'jobs' | 'proposals';
export interface Custom {
  clientId?: string;
  clientName?: string;
  clientTimezone?: string;
  freelancerId?: string;
  freelancerName?: string;
  freelancerTimezone?: string;
  freelancerUserImg?: string;
  clientUserImg?: string;
  projectName?: string;
  jobPostId?: string;
  type?: chatType;
  payload?: ChatPayload;
}

export interface ChatUser {
  access: string;
  id: string;
  notify: boolean;
  participants: Record<string, ChatParticipant>;
  custom: Custom;
  subject: string;
  isUnread: boolean;
  unreadMessageCount: number;
  createdAt: number;
  photoUrl: string | null;
  welcomeMessages: any[];
  lastMessage: LastMessage;
  lastMessageAt: number;
}

export interface MyChatsResponse {
  success: boolean;
  message: string;
  data: ChatUser[];
  selectedConversationId?: string;
}

export interface RemoteUserProp {
  type?: string;
  projectName?: string;
  username?: string;
  userId?: string;
  timezone?: string;
  userType: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type ChatFilterAction = 'job' | 'status' | 'type' | 'reset';

export interface WebhookMessageSent {
  conversationId: string;
  senderId: string;
}

export interface WebhookMessageSentPayload {
  createdAt: number;
  data: {
    conversation: {
      createdAt: number;
      custom: {
        clientId: string;
        clientName: string;
        clientTimezone: string;
        clientUserImg: string;
        freelancerId: string;
        freelancerName: string;
        freelancerTimezone: string;
        freelancerUserImg: string;
        jobPostId: string;
        projectName: string;
        type: string;
      };
      id: string;
      participants: {
        [key: string]: {
          access: 'ReadWrite';
          isUnread: boolean;
          notify: boolean;
        };
      };
      photoUrl: string;
      subject: string;
      topicId: string | null;
      welcomeMessages: string | null;
    };
    message: {
      attachment: string | null;
      conversationId: string;
      createdAt: number;
      custom: Record<string, unknown>;
      editedAt: number | null;
      id: string;
      location: string | null;
      origin: string;
      readBy: string[];
      referencedMessageId: string | null;
      senderId: string;
      text: string;
      type: string;
    };
    sender: {
      availabilityText: string | null;
      createdAt: number;
      custom: {
        email_id: string;
        first_name: string;
        id: string;
        last_name: string;
        user_image: string;
        user_type: string;
      };
      email: string[];
      id: string;
      locale: string | null;
      name: string;
      phone: string | null;
      photoUrl: string;
      pushTokens: Record<string, unknown>;
      role: string;
      welcomeMessage: string | null;
    };
  };
  id: string;
  type: string;
}

export interface ChatMessage {
  chat_id: number;
  _from_user_id: string;
  _to_user_id: string;
  _job_post_id: string;
  type: string;
  message_text: string;
  is_delivered: number;
  delivered_date: string | null;
  is_seen: number;
  seen_date: string | null;
  status: string;
  date_created: string;
  date_modified: string;
  is_deleted: number;
  proposal_id: number;
  invite_id: number | null;
}

export interface MessagesApiResponse {
  data: ChatMessage[];
  message: string;
  success: boolean;
}
