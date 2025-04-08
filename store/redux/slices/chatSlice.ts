import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "@/helpers/http";
import * as I from "./chat.interface";
import { AxiosResponse, CancelToken } from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";
import { scrollToBottom } from "@/helpers/utils/helper";
import messageService from "@/helpers/http/message";

const initialState: I.InitialState = {
  chatList: {
    invities: [],
    jobs: [],
    proposals: [],
  },
  activeChat: null,
  messages: [],
  errors: {
    messages: "",
  },
  unreadMessages: {
    invities: 0,
    jobs: 0,
    proposals: 0,
  },
  loading: {
    list: false,
    message: false,
    sendingMessage: false,
  },
  search: {
    chatList: "",
  },
  tabs: [
    { id: 1, label: "Projects", key: "jobs" },
    { id: 2, label: "Proposals", key: "proposals" },
    {
      id: 3,
      label: "Invited", //user?.user_type === 'client' ? 'Invited' : 'Invites',
      key: "invities",
    },
  ],
  activeTab: "jobs",
  showImg: false,
};

export const fetchChatList = createAsyncThunk<
  any,
  { cancelToken: CancelToken }
>("chats/fetch-chat-list", async ({ cancelToken }, { rejectWithValue }) => {
  try {
    const { data, status }: AxiosResponse<{ data: I.ChatListAPIResponse }> =
      await apiClient.post(
        "/message/manage-message",
        {
          action: "message_user_list",
          keyword: "",
        },
        {
          cancelToken: cancelToken,
        }
      );

    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

export const selectChatHandler = createAsyncThunk<
  any,
  {
    chatItem: I.Invite & I.Proposal & I.Job;
    index: number;
    remoteUserId: string;
  }
>(
  "chats/fetch-messages",
  async ({ chatItem, index, remoteUserId }, { dispatch }) => {
    try {
      dispatch(updateSelectChat({ chatItem, index }));

      const { data }: AxiosResponse<{ data: I.MessagesApiResponse }> =
        await apiClient.post("/message/manage-message", {
          action: "get_messages",
          jobId: chatItem._job_post_id,
          proposalId: chatItem.proposal_id,
          inviteId: chatItem.invite_id,
          remoteUserId,
          keyword: "",
        });

      return { messages: data.data, index };
    } catch (error: any) {
      throw new Error(error?.toString() || "An error occurred");
    }
  }
);

export const addNewMessage = createAsyncThunk<
  any,
  { message: I.AddMessagePayload }
>("/chats/add-message", async ({ message }, { rejectWithValue }) => {
  try {
    message.action = "add_message";

    const {
      data: new_message,
    }: AxiosResponse<{ data: I.MessagesApiResponse }> = await apiClient.post(
      "/message/manage-message",
      message
    );

    return { new_message };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    chatTabTitleHandler: (state, { payload }: PayloadAction<string>) => {
      state.tabs[2].label = payload === "client" ? "Invited" : "Invites";
    },
    onTabChange: (
      state,
      { payload }: PayloadAction<keyof I.UnreadMessages>
    ) => {
      state.activeTab = payload;
      state.activeChat = null;

      //reseting search terms if any
      state.search.chatList = "";
    },

    resetActiveChat: (state) => {
      state.activeChat = null;
      state.messages = [];
    },

    onParamKeyHandler: (
      state,
      { payload }: PayloadAction<{ tab: keyof I.ChatList }>
    ) => {
      state.activeTab = payload.tab;
    },

    updateSelectChat: (
      state,
      {
        payload,
      }: PayloadAction<{
        chatItem: I.Invite & I.Proposal & I.Job;
        index: number;
      }>
    ) => {
      if (state.activeChat !== payload.chatItem)
        state.activeChat = payload.chatItem;
    },
    updateMesssageTab: (
      state,
      { payload }: PayloadAction<{ updatedTabs: I.TabObject[] }>
    ) => {
      state.tabs = payload.updatedTabs;
    },
    onNewMessage: (
      state,
      { payload }: PayloadAction<{ newMessage: I.PusherNewMessage }>
    ) => {
      const { newMessage: message } = payload;

      const { activeChat } = state;
      let appendMessage: boolean = false;

      if (activeChat !== null) {
        /*
           Check if the user is on the same chat if yes then just append the message. 
           If No then update the unread count for tabs, messages and header. 
        */
        if (
          message.tab === "jobs" &&
          message._job_post_id === activeChat._job_post_id
        ) {
          appendMessage = true;
        }

        if (
          message.tab === "proposals" &&
          message.proposal_id === activeChat.proposal_id
        ) {
          appendMessage = true;
        }

        if (
          message.tab === "invities" &&
          message.invite_id === activeChat.invite_id
        ) {
          appendMessage = true;
        }
      }

      if (appendMessage) {
        message.chat_id = message.custom_chat_id;
        delete message.custom_chat_id;
        state.messages.push(message);

        /* seen message API */
        const seenMessagePayload: I.SeenMessagePayload = {
          job_post_id: message._job_post_id,
          proposal_id: message.proposal_id,
          invite_id: message.invite_id,
        };
        messageService.seenMessage(seenMessagePayload);

        setTimeout(() => scrollToBottom("message-container"), 10);
      } else {
        // Updating message count for header.
        state.unreadMessages[message.tab] += 1;

        const tabKeys: Array<keyof I.ChatList> = state.tabs.map((tb) => tb.key);

        tabKeys.forEach((tab) => {
          const index = state.chatList[tab].findIndex((chat: any) => {
            if (tab === "jobs")
              return chat._job_post_id === message._job_post_id;

            if (tab === "invities")
              return (
                chat._job_post_id === message._job_post_id &&
                chat?.invite_id === message?.invite_id
              );

            if (tab === "proposals")
              return (
                chat._job_post_id === message._job_post_id &&
                chat?.proposal_id === message?.proposal_id
              );

            return false;
          });

          if (state.chatList[tab][index])
            state.chatList[tab][index].unread_count += 1;
        });
      }

      setTimeout(() => scrollToBottom("message-container"), 10);
    },
    onSeenMessage: (
      state,
      { payload }: PayloadAction<I.SeenMessageResponse>
    ) => {
      let flag = false;
      const { activeChat } = state;

      if (activeChat) {
        if (activeChat._job_post_id === payload.job_post_id) {
          if (
            !payload.invite_id &&
            !payload.proposal_id &&
            payload.job_post_id === activeChat._job_post_id
          ) {
            flag = true;
          }

          if (
            payload.proposal_id &&
            activeChat.proposal_id === payload.proposal_id
          ) {
            flag = true;
          }

          if (payload.invite_id && activeChat.invite_id === payload.invite_id) {
            flag = true;
          }
        }
      }

      if (flag) {
        state.messages = state.messages.map((mess) => {
          mess.is_seen = 1;
          return mess;
        });
      }
    },
    handleBlurImage: (state, { payload }: PayloadAction<boolean>) => {
      state.showImg = payload;
    },
    appendNewMessage: (
      state,
      { payload }: PayloadAction<I.AddMessagePayload>
    ) => {
      const newPayload = { ...payload };
      newPayload.chat_id = payload.custom_chat_id;
      // Create a new object instead of deleting the property
      const { custom_chat_id, ...restPayload } = newPayload;
      state.messages.push(newPayload);
      setTimeout(() => scrollToBottom("message-container"), 10);
    },
    replaceChatId: (state, { payload }: PayloadAction<I.ReplaceChatId>) => {
      const { chat_id, custom_chat_id } = payload;

      const index = state.messages.findIndex(
        (mess) => mess.chat_id === custom_chat_id
      );
      if (state.messages[index]) state.messages[index].chat_id = chat_id;
    },

    deleteChatFromMessages: (
      state,
      { payload }: PayloadAction<{ chat_id: number }>
    ) => {
      state.messages = state.messages.filter(
        (ct) => ct.chat_id !== payload.chat_id
      );
    },
    searchChatList: (
      state,
      { payload }: PayloadAction<{ searchTerm: string }>
    ) => {
      state.search.chatList = payload.searchTerm;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatList.pending, (state) => {
      state.loading.list = true;
    });

    builder.addCase(
      fetchChatList.fulfilled,
      (state, { payload }: PayloadAction<I.ChatListAPIResponse>) => {
        if (typeof payload === "object") {
          state.loading.list = false;
          state.unreadMessages = payload.unreadMessages;
          state.chatList = payload.chatList;
        }
      }
    );

    builder.addCase(fetchChatList.rejected, (state) => {
      state.loading.list = false;
    });

    builder.addCase(selectChatHandler.pending, (state) => {
      state.loading.message = true;
      state.errors.messages = "";
    });

    builder.addCase(
      selectChatHandler.fulfilled,
      (
        state,
        { payload }: PayloadAction<{ messages: I.ChatMessage[]; index: number }>
      ) => {
        const totalReadMessages =
          state.chatList[state.activeTab][payload.index].unread_count;
        if (typeof totalReadMessages === "number")
          state.unreadMessages[state.activeTab] -= totalReadMessages;

        state.chatList[state.activeTab][payload.index].unread_count = 0;
        state.messages = payload.messages;
        state.loading.message = false;
        setTimeout(() => scrollToBottom("message-container"), 10);
      }
    );

    builder.addCase(selectChatHandler.rejected, (state, { payload }) => {
      state.errors.messages =
        "It looks like we encountered an unexpected error while fetching messages. Please refresh the page to resolve the issue.";
      state.loading.message = false;
    });

    builder.addCase(addNewMessage.pending, (state) => {
      state.loading.sendingMessage = true;
    });

    builder.addCase(addNewMessage.rejected, (state, { payload }) => {
      console.log("api error ===========: ", payload);
      state.loading.sendingMessage = false;
    });

    builder.addCase(
      addNewMessage.fulfilled,
      (
        state,
        { payload }: PayloadAction<{ new_message: I.AddMessageResponse }>
      ) => {
        console.log("responseresponse: ", payload);
        // state.loading.sendingMessage = false;
        // const { new_message } = payload;
        // const index = state.messages.findIndex((mess) => mess.chat_id === new_message.custom_chat_id);
        // if (index !== -1) state.messages[index].chat_id = new_message.chat_id;
      }
    );
  },
});

export const {
  chatTabTitleHandler,
  onTabChange,
  updateSelectChat,
  updateMesssageTab,
  onNewMessage,
  appendNewMessage,
  onParamKeyHandler,
  resetActiveChat,
  replaceChatId,
  deleteChatFromMessages,
  searchChatList,
  onSeenMessage,
  handleBlurImage,
} = chatSlice.actions;

export default chatSlice.reducer;
