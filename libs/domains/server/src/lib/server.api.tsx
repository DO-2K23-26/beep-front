import {
  backendUrl,
  ChannelEntity,
  CreateChannelRequest,
  CreateChannelResponse,
  ServerEntity,
} from '@beep/contracts'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { user } = getState() as RootState
    headers.set('Authorization', `Bearer ${user.tokens.accessToken}`)
  },
})

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery,
  tagTypes: ['servers', 'channels'],
  endpoints: (builder) => ({
    getServers: builder.query<ServerEntity[], void>({
      query: (params) => `/servers`,
      providesTags: ['servers'],
    }),
    joinServer: builder.mutation<void, string>({
      query: (serverId) => ({
        url: `/servers`,
        method: 'POST',
        body: {
          name: serverId,
        },
      }),
      invalidatesTags: ['servers'],
    }),
    createChannelInServer: builder.mutation<
      CreateChannelResponse,
      CreateChannelRequest
    >({
      query: (request) => ({
        url: `/servers/${request.serverId}/channels`,
        method: 'POST',
        body: {
          name: request.name,
          type: request.type,
        },
      }),
      invalidatesTags: ['servers'],
    }),
    getServerChannels: builder.query<ChannelEntity[], string>({
      query: (serverId) => `/servers/${serverId}/channels`,
      providesTags: ['channels'],
    }),
  }),
})

export const {
  useGetServersQuery,
  useJoinServerMutation,
  useGetServerChannelsQuery,
  useCreateChannelInServerMutation,
} = serverApi
