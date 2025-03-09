import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { talkJsFetchMyConversation, talkJsFetchSingleConversation } from '@/helpers/http/common';
import {
  ChatFilterAction,
  chatTypeWithAll,
  ChatUser,
  MessagesApiResponse,
  MyChatsResponse,
  SelectOption,
  WebhookMessageSent,
} from './talkjs.interface';
import { AxiosResponse } from 'axios';
import { AddMessagePayload } from './chat.interface';
import { apiClient } from '@/helpers/http';

interface InitialStateProp {
  loading: boolean;
  chatlist: ChatUser[];
  selectedConversation: null | ChatUser;
  activeTab: chatTypeWithAll;
  isFilterApplied: boolean;
  filters: {
    job: string;
    status: string;
    type: string;
  };
  themes: {
    job: 'zehmizeh_project';
    invite: 'zehmizeh_invities';
    proposal: 'zehmizeh_proposals';
  };
}

const initialState: InitialStateProp = {
  loading: false,
  chatlist: [],
  selectedConversation: null,
  filters: {
    job: '',
    status: '',
    type: '',
  },
  isFilterApplied: false,
  activeTab: 'jobs',
  themes: {
    job: 'zehmizeh_project',
    invite: 'zehmizeh_invities',
    proposal: 'zehmizeh_proposals',
  },
};

export const fetchMyConversation = createAsyncThunk<MyChatsResponse, string>(
  'talkjs/fetchconversation',
  async (selectedConversationId, { rejectWithValue, signal }) => {
    try {
      const response = await talkJsFetchMyConversation(signal);
      if (selectedConversationId) response.selectedConversationId = selectedConversationId;
      return response;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const addNewMessage = createAsyncThunk<any, { message: AddMessagePayload }>(
  '/chats/add-message',
  async ({ message }, { rejectWithValue }) => {
    try {
      message.action = 'add_message';

      const { data: new_message }: AxiosResponse<{ data: MessagesApiResponse }> = await apiClient.post(
        '/message/manage-message',
        message
      );

      return { new_message };
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

const talkJsSlice = createSlice({
  name: 'talkjs',
  initialState,
  reducers: {
    newMessageReciever: (state, { payload }: PayloadAction<WebhookMessageSent>) => {
      const index = state.chatlist.findIndex((usr) => usr.id === payload.conversationId);
      if (index !== -1) {
        state.chatlist[index].unreadMessageCount += 1;
      }
    },
    resetConversation: (state) => {
      state.selectedConversation = null;
    },
    seenMessageAction: (state, { payload }: PayloadAction<WebhookMessageSent>) => {
      const index = state.chatlist.findIndex((usr) => usr.id === payload.conversationId);
      if (index !== -1 && state.chatlist[index].unreadMessageCount > 0) {
        state.chatlist[index].unreadMessageCount -= 1;
      }
    },
    singleConversationById: (state, { payload: conversationId }: PayloadAction<string>) => {
      state.selectedConversation = state.chatlist.find((usr) => usr.id === conversationId);
      const index = state.chatlist.findIndex((usr) => usr.id === conversationId);
      if (index !== -1) {
        state.chatlist[index].unreadMessageCount = 0;
        const chatType = state.chatlist[index].custom.type;
        if (chatType === 'job') {
          state.activeTab = 'jobs';
        } else if (chatType === 'invite') {
          state.activeTab = 'invities';
        } else {
          state.activeTab = 'proposals';
        }
      }
    },
    changeChatType: (state, { payload }: PayloadAction<chatTypeWithAll>) => {
      state.activeTab = payload;
      state.selectedConversation = null;
    },

    filterHandler: (state, { payload }: PayloadAction<{ action: ChatFilterAction; selectedOption?: SelectOption }>) => {
      if (payload.action === 'reset') {
        state.isFilterApplied = false;
        state.filters = initialState.filters;
      } else {
        state.filters[payload.action] = payload.selectedOption.value;
      }
      state.isFilterApplied = JSON.stringify(state.filters) !== JSON.stringify(initialState.filters);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyConversation.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchMyConversation.fulfilled, (state, { payload }) => {
      state.filters = initialState.filters;
      state.loading = false;
      if (payload.success) state.chatlist = payload.data;
      if (payload.selectedConversationId) {
        state.selectedConversation = state.chatlist.find((usr) => usr.id === payload.selectedConversationId);
        const index = state.chatlist.findIndex((usr) => usr.id === payload.selectedConversationId);
        if (index !== -1) {
          state.chatlist[index].unreadMessageCount = 0;
        }
      }
    });

    builder.addCase(fetchMyConversation.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  singleConversationById,
  changeChatType,
  filterHandler,
  newMessageReciever,
  seenMessageAction,
  resetConversation,
} = talkJsSlice.actions;

export default talkJsSlice.reducer;
