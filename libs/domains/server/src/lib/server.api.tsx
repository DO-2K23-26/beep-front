import {
  backendUrl,
  ChannelEntity,
  CreateChannelRequest,
  CreateChannelResponse,
  CreateServerRequest,
  CreateInvitationRequest,
  CreateInvitationResponse,
  OccupiedChannelEntity,
  SearchServerRequest,
  ServerEntity,
  UserDisplayedEntity,
  JoinInvitationResponse,
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
  tagTypes: ['servers', 'channels', 'streamingUsers', 'users', 'publicServers'],
  endpoints: (builder) => ({
    getServers: builder.query<ServerEntity[], void>({
      query: () => `/servers`,
      providesTags: ['servers'],
    }),
    discoverServers: builder.query<ServerEntity[], SearchServerRequest>({
      query: (params) => {
        const url = new URL(`/servers/discover`, backendUrl)
        Object.entries(params).forEach(([key, value]) =>
          url.searchParams.append(key, value)
        )
        return { url: url.toString() }
      },

      providesTags: ['publicServers'],
    }),
    createServer: builder.mutation<string, FormData>({
      query: (request: FormData) => ({
        url: `/servers`,
        method: 'POST',
        formData: true,
        body: request,
      }),
      invalidatesTags: ['servers'],
    }),
    createInvitation: builder.mutation<
      CreateInvitationResponse,
      CreateInvitationRequest
    >({
      query: (request) => ({
        url: `/servers/${request.serverId}/invitation`,
        method: 'POST',
        body: {
          isUnique: request.isUnique,
          expiration: request.expiration,
        },
      }),
    }),
    joinPrivateServer: builder.mutation<JoinInvitationResponse, string>({
      query: (inviteId) => ({
        url: `/servers/join/${inviteId}`,
        method: 'POST',
      }),
      invalidatesTags: ['servers'],
    }),
    joinPublicServer: builder.mutation<void, string>({
      query: (serverId) => ({
        url: `/servers/${serverId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['servers'],
    }),
    deleteServer: builder.mutation<string, string>({
      query: (serverId) => ({
        url: `/servers/${serverId}`,
        method: 'DELETE',
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
      invalidatesTags: ['channels'],
    }),
    getServerChannels: builder.query<ChannelEntity[], string>({
      query: (serverId) => `/servers/${serverId}/channels`,
      providesTags: ['channels'],
    }),
    joinVoiceChannel: builder.mutation<
      void,
      { serverId: string; channelId: string }
    >({
      query: ({ serverId, channelId }) => ({
        url: `/servers/${serverId}/channels/${channelId}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'streamingUsers', channelId: arg.channelId },
      ],
    }),
    leaveVoiceChannel: builder.mutation<void, void>({
      query: () => ({
        url: `/servers/channels/leave`,
        method: 'POST',
      }),
      invalidatesTags: ['streamingUsers'],
    }),
    getCurrentStreamingUsers: builder.query<OccupiedChannelEntity[], string>({
      query: (serverId) => `/servers/${serverId}/streaming/users`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ channelId }) => ({
                type: 'streamingUsers' as const,
                channelId,
              })),
              'streamingUsers',
            ]
          : ['streamingUsers'],
    }),
    getUsersByServerId: builder.query<UserDisplayedEntity[], string>({
      query: (serverId) => `servers/${serverId}/users`,
      providesTags: (result, error, serverId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'users' as const, id })),
              { type: 'users', id: `LIST-${serverId}` },
            ]
          : [{ type: 'users', id: `LIST-${serverId}` }],
    }),

    updateServer: builder.mutation<
      ServerEntity,
      { serverId: string; updatedServer: Partial<ServerEntity> }
    >({
      query: (request) => ({
        url: `/servers/${request.serverId}`,
        method: 'PATCH',
        body: request.updatedServer,
      }),
      invalidatesTags: ['servers'],
    }),

    updateBanner: builder.mutation<
      void,
      { serverId: string; formData: FormData }
    >({
      query: ({ serverId, formData }) => ({
        url: `/servers/${serverId}/banner`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['servers'],
    }),

    updatePicture: builder.mutation<
      void,
      { serverId: string; formData: FormData }
    >({
      query: ({ serverId, formData }) => ({
        url: `/servers/${serverId}/picture`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['servers'],
    }),

    transmitBanner: builder.query<string, string>({
      query: (serverId) => ({
        url: `/servers/${serverId}/banner`,
        responseHandler: async (response) => {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        },
      }),
    }),

    transmitPicture: builder.query<string, string>({
      query: (serverId) => ({
        url: `/servers/${serverId}/picture`,
        responseHandler: async (response) => {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        },
      }),
    }),
  }),
})

export const {
  useGetServersQuery,
  useCreateInvitationMutation,
  useJoinPublicServerMutation,
  useJoinPrivateServerMutation,
  useCreateServerMutation,
  useGetServerChannelsQuery,
  useCreateChannelInServerMutation,
  useJoinVoiceChannelMutation,
  useLeaveVoiceChannelMutation,
  useGetCurrentStreamingUsersQuery,
  useGetUsersByServerIdQuery,
  useUpdateServerMutation,
  useUpdateBannerMutation,
  useUpdatePictureMutation,
  useTransmitBannerQuery,
  useTransmitPictureQuery,
  useDeleteServerMutation,
  useDiscoverServersQuery,
} = serverApi
