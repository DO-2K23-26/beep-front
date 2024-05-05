import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store';
import { ChannelEntity, CreateChannelRequest, CreateChannelResponse, UserEntity, backendUrl } from '@beep/contracts';

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
    getChannels: builder.query<ChannelEntity[], number>({
      query: (params) => `/server/${params}/channels`,
      providesTags: ['channels']
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
    createChannel: builder.mutation<CreateChannelResponse, CreateChannelRequest>({
      query: (channel) => ({
        url: `channel`,
        method: 'POST',
        body: channel,
      }),
      invalidatesTags: ['channels'],
    }),
  })
})

export const {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useGetMessagesByChannelIdQuery
} = channelApi
