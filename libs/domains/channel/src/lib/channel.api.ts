import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store';
import { UserEntity, backendUrl, CreateChannelRequest, CreateChannelResponse, ChannelEntity, GetMessagesResponse, CreateMessageRequest, MessageEntity, UpdateMessageRequest } from '@beep/contracts';

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { user } = getState() as RootState;
    headers.set('Authorization', `Bearer ${user.tokens.accessToken}`);
  },
});

export const channelApi = createApi({
  reducerPath: 'channelApi',
  baseQuery,
  tagTypes: ['channels', 'messages'],
  endpoints: (builder) => ({
    getChannels: builder.query<ChannelEntity[], void>({
      query: () => ({
        url: `/channels`,
        method: 'GET',
      }),
      providesTags: ['channels']
    }),
    getChannel: builder.query<any, string>({
      query: (id: string) => `/channels/${id}?messages=true`,
    }),
    getUsers: builder.query<UserEntity[], void>({
      query: (credentials) => ({
        url: `/users`,
        method: 'GET',
        body: credentials,
      }),
    }),
    getMessagesByChannelId: builder.query<GetMessagesResponse, string>({
      query: (id: string) => `/channels/${id}?messages=true`,
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
    createMessage: builder.mutation<MessageEntity, FormData>({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['messages']
    }),
    updateMessage: builder.mutation<MessageEntity, UpdateMessageRequest>({
      query: (message) => ({
        url: `/messages/${message.id}`,
        method: 'PUT',
        body: message,
      }),
      invalidatesTags: ['messages']
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['messages']
    })
  })
})

export const {
  useGetChannelsQuery,
  useGetChannelQuery,
  useCreateChannelMutation,
  useGetMessagesByChannelIdQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = channelApi
