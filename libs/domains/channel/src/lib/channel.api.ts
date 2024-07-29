/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/rules-of-hooks */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ChannelEntity,
  CreateChannelRequest,
  CreateChannelResponse,
  CreateMessageRequest,
  DeleteMessageRequest,
  GetChannelRequest,
  GetMessageFromChannelRequest,
  MessageEntity,
  PinMessageRequest,
  ShowMessageRequest,
  UpdateMessageRequest,
  UserEntity,
  backendUrl
} from '@beep/contracts';
import { RootState } from '@beep/store';

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { user } = getState() as RootState;
    headers.set('Authorization', `Bearer ${user.tokens.accessToken}`);
    return headers;
  },
});

export const channelApi = createApi({
  reducerPath: 'channelApi',
  baseQuery,
  tagTypes: ['channels', 'messages', 'users'],
  endpoints: (builder) => ({
    getChannels: builder.query<ChannelEntity[], void>({
      query: () => ({
        url: `/channels`,
        method: 'GET',
      }),
      providesTags: ['channels']
    }),

    getChannel: builder.query<ChannelEntity, GetChannelRequest>({
      query: (request) => ({
        url: `/servers/${request.serverId}/channels/${request.channelId}`,
      })
    }),
    getUsers: builder.query<UserEntity[], void>({
      query: (credentials) => ({
        url: `/users`,
        method: 'GET',
        body: credentials,
      }),
    }),
    getMessagesByChannelId: builder.query<MessageEntity[], GetMessageFromChannelRequest>({
      query: (request) => `/channels/${request.channelId}/messages`,
      providesTags: ['messages'],
    }),
    createChannel: builder.mutation<CreateChannelResponse, CreateChannelRequest>({
      query: (channel) => ({
        url: `channels`,
        method: 'POST',
        body: channel,
      }),
      invalidatesTags: ['channels'],
    }),
    createMessage: builder.mutation<MessageEntity, CreateMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages`,
        method: 'POST',
        body: request.body,
        formData: true
      }),
      invalidatesTags: ['messages']
    }),
    getOneMessage: builder.query<MessageEntity, ShowMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages`,
        method: 'GET',
      }),
    }),
    updateMessage: builder.mutation<MessageEntity, UpdateMessageRequest>({
      query: (request) => ({
        url: `channels/${request.channelId}/messages/${request.messageId}`,
        method: 'PATCH',
        body: { content: request.content },
        formData: true,
      }),
      invalidatesTags: ['messages']
    }),
    deleteMessage: builder.mutation<void, DeleteMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages/${request.messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['messages']
    }),
    fetchAttachmentImage: builder.query<string, string>({
      query: (id) => ({
        url: `/storage/files/secure/attachment/${id}`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      })
    }),
    pinMessage: builder.mutation<MessageEntity, PinMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages/${request.messageId}/pin`,
        body: request,
        method: 'PATCH',
      }),
      invalidatesTags: ['messages']
    }),
    fetchPinnedMessages: builder.query<MessageEntity[], string>({
      query: (channelId) => ({
        url: `/channels/${channelId}/messages/pinned`,
        method: 'GET',
      }),
      providesTags: ['messages'],
    }),
    findAndDeleteMessage: builder.mutation<MessageEntity, DeleteMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages/${request.messageId}/find-and-delete`,
        method: 'DELETE',
        body: request,
      }),
      invalidatesTags: ['messages']
    }),
  })
})

export const {
  useGetChannelsQuery,
  useGetChannelQuery,
  useGetUsersQuery,
  useGetMessagesByChannelIdQuery,
  useCreateChannelMutation,
  useCreateMessageMutation,
  useGetOneMessageQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useFetchAttachmentImageQuery,
  usePinMessageMutation,
  useFetchPinnedMessagesQuery,
  useFindAndDeleteMessageMutation
} = channelApi
