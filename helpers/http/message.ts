import { CancelToken } from 'axios';
import { apiClient } from './index';
import { PusherNewMessage, SeenMessagePayload } from '../../store/redux/slices/chat.interface';

const manageMessage = (data?: any, cancelToken?: CancelToken) =>
  apiClient.post('/message/manage-message', data, { cancelToken }).then((res) => {
    if (!res.data.status) {
      throw new Error(res.data.message);
    }
    return res.data;
  });

const messageService = {
  getUserList(keyword?: string, action = 'get_user_list') {
    return manageMessage({
      action: action,
      keyword,
    });
  },
  getUnreadMessages() {
    return manageMessage({
      action: 'unread_messages',
    });
  },
  getMessages({ job_post_id, type, chat_id, remote_user_id, action = 'get_message', cancelToken }: any) {
    const payload: any = {
      action,
      job_post_id,
      limit: action == 'invite_get_message' ? 10 : 20,
    };
    if (type) payload.type = type;
    if (chat_id) payload.chat_id = chat_id;
    if (remote_user_id) payload.remote_user_id = remote_user_id;
    return manageMessage(payload, cancelToken);
  },
  sendMessage(payload: { to_user_id: string; job_post_id: string; type: string; message_text: string }) {
    return manageMessage({
      action: 'add_message',
      ...payload,
    });
  },
  seenMessage(payload: SeenMessagePayload) {
    return manageMessage({
      action: 'seen_message',
      ...payload,
    });
  },
  deleteMessage(chat_id: number) {
    return manageMessage({
      action: 'delete_message',
      chat_id,
    });
  },

  removeFileFromS3(fileUrl: string) {
    apiClient
      .post('/general/image/delete', { fileUrl })
      .then((res) => {
        if (!res.data.status) {
          throw new Error(res.data.message);
        }
        return res.data;
      })
      .catch((err) => err.message);
  },
  searchMessages(payload: { job_id: string; remote_user_id: string; limit: number; page: number; text: string }) {
    return apiClient.post('/message/search', payload).then((res) => {
      if (!res.data.status) {
        throw new Error(res.data.message);
      }
      return res.data;
    });
  },
};

export default messageService;
