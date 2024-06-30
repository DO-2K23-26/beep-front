/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/rules-of-hooks */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  ChannelEntity, 
  CreateChannelRequest, 
  CreateChannelResponse, 
  CreateMessageRequest, 
  DeleteMessageRequest, 
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

    getChannel: builder.query<any, { serverId: string, channelId: string }>({
      query: (request: { serverId: string, channelId: string }) => ({
        url: `/servers/${request.serverId}/channels/${request.channelId}`,
        //   responseHandler : async (response: Response) => {
        //   const data = await response.json();
        //   if (response.ok) {
        //     for (const message of data.messages) {
        //       message.owner.profilePicture = useFetchProfilePictureQuery(message.owner.id);
        //       for (const attachment of message.attachments) {
        //         attachment.url = useFetchAttachmentImageQuery(attachment.id);
        //       }
        //     }
        //     return data;
        //   } else {
        //     return Promise.reject(data);
        //   }
        // }
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
    getAttachments: builder.query({
      query: (payload) => `/channels/${payload.channelId}/attachments`,
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
  useGetAttachmentsQuery,
  useCreateMessageMutation,
  useGetOneMessageQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useFetchAttachmentImageQuery,
  usePinMessageMutation,
  useFetchPinnedMessagesQuery,
  useFindAndDeleteMessageMutation
} = channelApi
