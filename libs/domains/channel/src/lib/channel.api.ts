/* eslint-disable @nx/enforce-module-boundaries */
import {
  CreateMessageRequest,
  DeleteMessageRequest,
  GetMessageFromChannelRequest,
  GetPinnedMessageRequest,
  MessageEntity,
  PinMessageRequest,
  ShowMessageRequest,
  UpdateMessageRequest,
  backendUrl,
} from '@beep/contracts'
import { messageActions } from '@beep/message'
import { TransmitSingleton } from '@beep/transmit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // const { user } = getState() as RootState;
    // headers.set('Authorization', `Bearer ${user.tokens.accessToken}`);
    // return headers;
  },
})

export const channelApi = createApi({
  reducerPath: 'channelApi',
  baseQuery,
  tagTypes: ['message', 'users'],
  endpoints: (builder) => ({
    getMessagesByChannelId: builder.query<
      MessageEntity[],
      GetMessageFromChannelRequest
    >({
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        if (arg.before) {
          dispatch(
            messageActions.addPaginated({
              channelId: arg.channelId,
              messages: data,
            })
          )
        } else {
          dispatch(
            messageActions.syncRemoteState({
              channelId: arg.channelId,
              messages: data,
            })
          )
        }
      },
      query: (request) => {
        let baseUrl = `/channels/${request.channelId}/messages?limit=${request.limit}`
        if (request.before) {
          baseUrl += `&before=${request.before}`
        }
        return baseUrl
      },
    }),
    createMessage: builder.mutation<MessageEntity, CreateMessageRequest>({
      query: (request) => {
        const uid = TransmitSingleton.getInstance().uid
        return ({
          url: `/channels/${request.channelId}/messages?transmitClientId=${uid}`,
          method: 'POST',
          body: request.body,
          formData: true,
        })
      },
    }),
    getOneMessage: builder.query<MessageEntity, ShowMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages/${request.messageId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, request) => [
        { type: 'message', id: request.messageId },
      ],
    }),
    updateMessage: builder.mutation<MessageEntity, UpdateMessageRequest>({
      query: (request) => ({
        url: `channels/${request.channelId}/messages/${request.messageId}`,
        method: 'PATCH',
        body: { content: request.content },
        formData: true,
      }),
      invalidatesTags: (_result, _error, request) => [
        { type: 'message', id: request.messageId },
      ],
    }),
    deleteMessage: builder.mutation<void, DeleteMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages/${request.messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, request) => [
        { type: 'message', id: request.messageId },
      ],
    }),
    fetchAttachmentImage: builder.query<string, string>({
      query: (id) => ({
        url: `/storage/files/secure/attachment/${id}`,
        responseHandler: async (response) => {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        },
      }),
    }),
    pinMessage: builder.mutation<MessageEntity, PinMessageRequest>({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages/${request.messageId}/pinning?action=${request.action}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, request) => [
        {
          type: 'message',
          id: `LIST-PINNED-${request.channelId}`,
        },
      ],
    }),
    fetchPinnedMessages: builder.query<
      MessageEntity[],
      GetPinnedMessageRequest
    >({
      query: (request) => ({
        url: `/channels/${request.channelId}/messages/pinned`,
        method: 'GET',
      }),
      providesTags: (result, _error, req) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'message' as const, id: id })),
            { type: 'message', id: `LIST-PINNED-${req.channelId}` },
          ]
          : [{ type: 'message', id: `LIST-PINNED-${req}` }],
    }),
  }),
})

export const {
  useGetMessagesByChannelIdQuery,
  useCreateMessageMutation,
  useGetOneMessageQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useFetchAttachmentImageQuery,
  usePinMessageMutation,
  useFetchPinnedMessagesQuery,
  useLazyGetMessagesByChannelIdQuery,
} = channelApi
