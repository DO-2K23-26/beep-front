/* eslint-disable @nx/enforce-module-boundaries */
import { MessageEntity, MessageState, PaginatedMessage, ReplaceMessage, SendMessageForm, SyncMessages } from '@beep/contracts';
import { RootState } from '@beep/store';
import { createSlice } from '@reduxjs/toolkit';
import { sortMessagesByCreation, toFormData, toMessage } from './utils';

export const MESSAGE_KEY = 'message'

const initialState: MessageState = {
  channels_messages: {}
}

export const messageSlice = createSlice({
  name: MESSAGE_KEY,
  initialState: initialState,
  selectors: {
    selectMessages: (state: MessageState) => state.channels_messages
  },
  reducers: {
    // This method is called every time the user selects a new channel
    syncRemoteState(state, { payload }: {
      payload: SyncMessages
    }) {
      if (!state.channels_messages[payload.channelId])
        state.channels_messages[payload.channelId] = []
      state.channels_messages[payload.channelId] = sortMessagesByCreation(payload.messages)
    },
    addPaginated(state, { payload }: {
      payload: PaginatedMessage
    }) {
      if (payload.messages.length === 0) return;
      const currentMessages = state.channels_messages[payload.channelId] || [];
      state.channels_messages[payload.channelId] = sortMessagesByCreation([...currentMessages, ...payload.messages]);
    },
    // Append a message from the local client to the state
    // This message will be later sent by message-feature.tsx
    send(state, { payload }: { payload: SendMessageForm }) {
      const messageReq = toFormData(payload);
      const message = toMessage(payload, messageReq);
      const currentMessages = state.channels_messages[payload.channelId] || [];
      currentMessages.push(message);
      state.channels_messages[payload.channelId] = sortMessagesByCreation(currentMessages);
    },
    // When a message is sent by the local client
    // We wait for the server to send back the message
    // Once it is done we replace the temporary message with the one from the server
    replaceFromServer(state, { payload }: { payload: ReplaceMessage }) {
      const currentMessages = state.channels_messages[payload.message.channelId] || [];
      const index = currentMessages.findIndex((message) => message.id === payload.messageId);
      currentMessages[index] = payload.message;
      state.channels_messages[payload.message.channelId] = sortMessagesByCreation(currentMessages);
    },
    // This method is used to handle new messages from the SSE connection
    create(state, { payload }: { payload: MessageEntity }) {
      const currentMessages = state.channels_messages[payload.channelId] || [];
      if (payload.createdAt || payload.isSentByCurrentClient) {
        currentMessages.push(payload);
      }
      state.channels_messages[payload.channelId] = sortMessagesByCreation(currentMessages);
    },
    update(state, { payload }: { payload: MessageEntity }) {
      const currentMessages = state.channels_messages[payload.channelId] || [];
      const index = currentMessages.findIndex((message) => message.id === payload.id);
      currentMessages[index] = payload;
      state.channels_messages[payload.channelId] = sortMessagesByCreation(currentMessages);
    },
    delete(state, { payload }: { payload: MessageEntity }) {
      const currentMessages = state.channels_messages[payload.channelId] || [];
      state.channels_messages[payload.channelId] = currentMessages.filter((message) => message.id !== payload.id);
    },
    // When a message is sent by the local client
    // We remove the request from the state to avoid side effects
    removeRequest(state, { payload }: { payload: MessageEntity }) {
      const currentMessages = state.channels_messages[payload.channelId] || [];
      const index = currentMessages.findIndex((message) => message.id === payload.id);
      delete currentMessages[index].request;
      state.channels_messages[payload.channelId] = currentMessages;
    }
  }
});

export const messageReducer = messageSlice.reducer;
export const messageActions = messageSlice.actions;
export const { syncRemoteState, create, update, delete: deleteMessage } = messageActions;
export const {
  selectMessages
} = messageSlice.getSelectors((state: RootState) => state[MESSAGE_KEY]);

export const getMessageState = (root: RootState) => root[MESSAGE_KEY];
