export interface UserData {
  user_id: string;
  timezone: string;
  last_name: string;
  user_type: string;
  first_name: string;
  user_image: string;
}

export interface Invite {
  invite_id: number;
  invite_status: string;
  invite_modified_date: string | null;
  _from_user_data: UserData;
  _to_user_data: UserData;
  unread_count: number;
  message: string;
  message_date_created: string;
  _job_post_id: string;
  job_title: string;
  job_status: string;
  job_start_date: string | null;
  job_end_date: string | null;
  date_modified: string | null;
  total_milestones: number;
  job_type: string;
}

export interface Proposal {
  proposal_id: number;
  proposal_status: string;
  status_change_timestamp: Record<string, string>;
  proposal_modified_date: string;
  _from_user_data: UserData;
  _to_user_data: UserData;
  unread_count: number;
  message: string;
  message_date_created: string;
  _job_post_id: string;
  job_title: string;
  job_status: string;
  job_start_date: string | null;
  job_end_date: string | null;
  date_modified: string;
  total_milestones: number;
  job_type: string;
}

export interface Job {
  _from_user_data: UserData;
  _to_user_data: UserData;
  unread_count: number;
  message: string;
  message_date_created: string;
  _job_post_id: string;
  job_title: string;
  job_status: string;
  job_start_date: string;
  job_end_date: string | null;
  date_modified: string;
  total_milestones: number;
  job_type: string;
}

export interface UnreadMessages {
  jobs: number;
  proposals: number;
  invities: number;
}

export interface ChatList {
  invities: Invite[];
  proposals: Proposal[];
  jobs: Job[];
}

export interface ChatListAPIResponse {
  unreadMessages: UnreadMessages;
  chatList: ChatList;
}

export interface TabObject {
  id: number;
  label: string;
  // key: string;
  key: keyof ChatList;
}

export interface InitialState {
  chatList: ChatList;
  activeChat: (Invite & Proposal & Job) | null;
  messages: (ChatMessage | PusherNewMessage | AddMessagePayload)[];
  // messages: any[];
  unreadMessages: UnreadMessages;
  loading: {
    list: boolean;
    message: boolean;
    sendingMessage: boolean;
  };
  tabs: TabObject[];
  activeTab: keyof ChatList;
  errors: {
    messages: string;
  };
  search: {
    chatList: string;
  };
  showImg: boolean;
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

export interface PusherNewMessage {
  _from_user_id: string;
  _to_user_id: string;
  _job_post_id: string;
  type: string;
  message_text: string;
  date_created: string;
  invite_id?: number;
  proposal_id?: number;
  chat_id?: number;
  custom_chat_id?: number;
  tab: keyof ChatList;
  is_seen?: number;
}

export interface AddMessagePayload {
  action?: 'add_message';
  to_user_id: string;
  job_post_id: string;
  _from_user_id?: string;
  type: 'TEXT' | 'FILE';
  message_text: string;
  tab: string;
  invite_id?: number;
  proposal_id?: number;
  date_created?: string;
  custom_chat_id: number;
  chat_id?: number;
  is_seen?: number;
}

export interface AddMessageResponse {
  _from_user_id: string;
  _to_user_id: string;
  _job_post_id: string;
  type: string;
  message_text: string;
  custom_chat_id: number;
  chat_id: number;
}

export interface ReplaceChatId {
  custom_chat_id: number;
  chat_id: number;
  remote_user_id: string;
}

export interface SeenMessagePayload {
  job_post_id: string;
  proposal_id?: number;
  invite_id?: number;
}
export interface SeenMessageResponse {
  job_post_id: string;
  proposal_id?: number;
  invite_id?: number;
  seen_message_by: string;
}

export interface DeleteChatId {
  chat_id: number;
  remote_user_id: string;
}
