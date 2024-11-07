import {
  ChannelEntity,
  CreateChannelRequest,
  CreateChannelResponse,
  CreateInvitationRequest,
  CreateInvitationResponse,
  DeleteChannelRequest,
  GetChannelRequest,
  JoinInvitationResponse,
  OccupiedChannelEntity,
  SearchServerRequest,
  ServerEntity,
  UpdateChannelRequest,
  MemberEntity,
  GetChannelsResponse,
  backendUrl,
  GetMembersResponse,
  GetMemberRequest,
} from '@beep/contracts'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // const { user } = getState() as RootState
    // headers.set('Authorization', `Bearer ${user.tokens.accessToken}`)
  },
})

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery,
  tagTypes: [
    'servers',
    'channel',
    'textChannel',
    'voiceChannel',
    'streamingUsers',
    'members',
    'publicServers',
    'transmitPicture',
    'transmitBanner',
  ],
  endpoints: (builder) => ({
    getMyServers: builder.query<ServerEntity[], void>({
      query: () => ({
        url: `/v1/users/@me/servers`,
        method: 'GET',
      }),
      providesTags: [{ type: 'servers' }],
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
        url: `/v1/servers/join/${inviteId}`,
        method: 'POST',
      }),
      invalidatesTags: ['servers'],
    }),
    joinPublicServer: builder.mutation<void, string>({
      query: (serverId) => ({
        url: `/v1/servers/${serverId}/join`,
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

      invalidatesTags: (_result, _error, req) => [
        { type: 'channel', id: `LIST-${req.serverId}` },
      ],
    }),
    updateChannelInServer: builder.mutation<
      ChannelEntity,
      UpdateChannelRequest
    >({
      query: (request) => ({
        url: `/servers/${request.serverId}/channels/${request.channelId}`,
        method: 'PUT',
        body: {
          name: request.name,
          description: request.description,
        },
      }),
      invalidatesTags: (result, __, req) =>
        result
          ? [{ type: `${result.type}Channel`, id: result.id }]
          : [{ type: 'channel', id: `LIST-${req.serverId}` }],
    }),
    deleteChannelInServer: builder.mutation<
      ChannelEntity,
      DeleteChannelRequest
    >({
      query: (request) => ({
        url: `/servers/${request.serverId}/channels/${request.channelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, __, req) =>
        result
          ? [{ type: 'channel', id: result.id }]
          : [{ type: 'channel', id: `LIST-${req.serverId}` }],
    }),
    getChannel: builder.query<ChannelEntity, GetChannelRequest>({
      query: (request) => ({
        url: `/servers/${request.serverId}/channels/${request.channelId}`,
      }),
      providesTags: (result, _error, _request) => {
        if (result) return [{ type: `${result.type}Channel`, id: result.id }]
        return []
      },
    }),
    getServerChannels: builder.query<GetChannelsResponse, string>({
      query: (serverId) => `/servers/${serverId}/channels`,
      transformResponse: (response: ChannelEntity[]) => {
        const voice = response.filter((channel) => channel.type === 'voice')
        const text = response.filter((channel) => channel.type === 'text')
        return { voiceChannels: voice, textChannels: text }
      },
      providesTags: (result, _error, serverId) =>
        result
          ? [
              ...result.voiceChannels.map(({ id }) => ({
                type: 'voiceChannel' as const,
                id,
              })),
              ...result.textChannels.map(({ id }) => ({
                type: 'textChannel' as const,
                id,
              })),
              { type: 'channel', id: `LIST-${serverId}` },
            ]
          : [{ type: 'channel', id: `LIST-${serverId}` }],
    }),
    joinVoiceChannel: builder.mutation<
      void,
      {
        serverId: string
        channelId: string
        userState: { muted: boolean; voiceMuted: boolean; camera: boolean }
      }
    >({
      query: ({ serverId, channelId, userState }) => ({
        url: `/servers/${serverId}/channels/${channelId}/join`,
        method: 'POST',
        body: userState,
      }),
      invalidatesTags: (_result, _error, arg) => [
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
      providesTags: (result, _error, _arg) =>
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
    getMember: builder.query<MemberEntity, GetMemberRequest>({
      query: ({ serverId, userId }) =>
        `v1/servers/${serverId}/members/${userId}`,
      providesTags: (result, _error, { serverId, userId }) => [
        { type: 'members', id: `${serverId}:${userId}` },
      ],
    }),

    getMembers: builder.query<MemberEntity[], string>({
      query: (serverId) => `v1/servers/${serverId}/members`,
      transformResponse: (response: GetMembersResponse) => {
        return response.data
      },
      providesTags: (result, _error, serverId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'members' as const, id })),
              { type: 'members', id: `LIST-${serverId}` },
            ]
          : [{ type: 'members', id: `LIST-${serverId}` }],
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
      providesTags: (_result, _error, id) => [
        { type: 'transmitBanner', id: id },
      ],
    }),

    transmitPicture: builder.query<string, string>({
      query: (serverId) => ({
        url: `/servers/${serverId}/picture`,
        responseHandler: async (response) => {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        },
      }),
      providesTags: (_result, _error, id) => [
        { type: 'transmitPicture', id: id },
      ],
    }),
  }),
})

export const {
  useGetMyServersQuery,
  useGetMembersQuery,
  useGetMemberQuery,
  useCreateInvitationMutation,
  useJoinPublicServerMutation,
  useJoinPrivateServerMutation,
  useCreateServerMutation,
  useGetServerChannelsQuery,
  useGetChannelQuery,
  useCreateChannelInServerMutation,
  useUpdateChannelInServerMutation,
  useDeleteChannelInServerMutation,
  useJoinVoiceChannelMutation,
  useLeaveVoiceChannelMutation,
  useGetCurrentStreamingUsersQuery,
  useUpdateServerMutation,
  useUpdateBannerMutation,
  useUpdatePictureMutation,
  useTransmitBannerQuery,
  useTransmitPictureQuery,
  useDeleteServerMutation,
  useDiscoverServersQuery,
} = serverApi
