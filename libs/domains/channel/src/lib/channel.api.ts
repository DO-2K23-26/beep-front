import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@beep/store';
import { UserEntity } from '@beep/contracts';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND,
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
    getChannels: builder.query<any, string>({
      query: (params) => `/channels?${params}`,
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
    getMessagesByChannelId: builder.query<any, string>({
      query: (id: string) => `/channels/${id}?messages=true`,
      providesTags: ['messages'],
    }),

    createChannel: builder.mutation({
      query: (channel) => ({
        url: `channels`,
        method: 'POST',
        body: channel,
      }),
      invalidatesTags: ['channels'],
    }),
    createMessage: builder.mutation<any, FormData>({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['messages']
    })
  })
})

export const {
  useGetChannelQuery,
  useGetChannelsQuery,
  useCreateChannelMutation,
  useGetMessagesByChannelIdQuery,
  useCreateMessageMutation,
} = channelApi
