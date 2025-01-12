import {
  AssignMemberToRoleRequest,
  backendUrl,
  ChangeParentChannelRequest,
  ChannelEntity,
  ChannelType,
  CreateChannelRequest,
  CreateChannelResponse,
  CreateInvitationRequest,
  CreateInvitationResponse,
  CreateRoleRequest,
  DeleteChannelRequest,
  DeleteRoleRequest,
  GetChannelRequest,
  GetChannelsResponse,
  GetMemberRequest,
  GetMyMemberRequest,
  GetRoleMembersRequest,
  JoinInvitationResponse,
  Member,
  MemberEntity,
  MoveChannelRequest,
  OccupiedChannelEntity,
  RawRole,
  Role,
  SearchServerRequest,
  ServerEntity,
  UnassignMemberToRoleRequest,
  UpdateChannelRequest,
  UpdateMemberRequest,
  UpdateRoleRequest,
} from '@beep/contracts'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
})

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery,
  tagTypes: [
    'servers',
    'roles',
    'channel',
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
        url: `/v1/servers/${request.serverId}/invitation`,
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
      queryFn: async (request, queryApi, _extraOptions, fetchWithBQ) => {
        const response = await fetchWithBQ({
          url: `/servers/${request.serverId}/channels`,
          method: 'POST',
          body: {
            name: request.name,
            type: +request.type,
            parentId: request.parentId,
          },
        })

        if (response.error) {
          return { error: response.error }
        }

        return { data: response.data as CreateChannelResponse }
      },

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
          ? [{ type: `channel`, id: result.id }]
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
        if (result) return [{ type: `channel`, id: result.id }]
        return []
      },
    }),
    getServerChannels: builder.query<ChannelEntity[], string>({
      query: (serverId) => `/servers/${serverId}/channels?group=true`,
      providesTags: (result, _error, serverId) =>
        [{ type: 'channel', id: `LIST-${serverId}` }]
    }),
    joinVoiceChannel: builder.mutation<
      { token: string },
      {
        serverId: string
        channelId: string
        userState: {
          muted: boolean
          voiceMuted: boolean
          camera: boolean
        }
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
        { type: 'members', id: `${serverId}:${result?.id}` },
      ],
    }),

    getMembers: builder.query<Member[], string>({
      query: (serverId) => `v1/servers/${serverId}/members`,
      // transformResponse: (response: MemberEntity[]) =>
      providesTags: (result, _error, serverId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'members' as const, id })),
              { type: 'members', id: `LIST-${serverId}` },
            ]
          : [{ type: 'members', id: `LIST-${serverId}` }],
    }),
    getRoles: builder.query<Role[], string>({
      query: (serverId) => `servers/${serverId}/roles`,
      transformResponse: (response: RawRole[]) =>
        response.map((role) => new Role(role)),
      providesTags: (result, _error, serverId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'roles' as const, id })),
              { type: 'roles', id: `LIST-${serverId}` },
            ]
          : [{ type: 'roles', id: `LIST-${serverId}` }],
    }),
    updateServerRole: builder.mutation<Role, UpdateRoleRequest>({
      query: ({ serverId, role }) => ({
        url: `/servers/${serverId}/roles/${role.id}`,
        method: 'PUT',
        body: {
          name: role.name,
          permissions: role.getRawPermissions(),
        },
      }),
      transformResponse: (response: RawRole) => new Role(response),
      invalidatesTags: (_result, _error, req) => [
        { type: 'roles', id: `LIST-${req.serverId}` },
      ],
    }),
    deleteRole: builder.mutation<void, DeleteRoleRequest>({
      query: (request) => ({
        url: `/servers/${request.serverId}/roles/${request.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, req) => [
        { type: 'roles', id: `LIST-${req.serverId}` },
      ],
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
    patchChannelPosition: builder.mutation<ChannelEntity, MoveChannelRequest>({
      query: (request) => ({
        url: `/servers/${request.serverId}/channels/${request.channelId}`,
        method: 'PUT',
        body: {
          position: request.position,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'channel', id: `LIST-${arg.serverId}` },
      ],
    }),
    moveChannelToFolder: builder.mutation<
      ChannelEntity,
      ChangeParentChannelRequest
    >({
      query: (request) => ({
        url: `/servers/${request.serverId}/channels/${request.channelId}`,
        method: 'PUT',
        body: {
          parentId: request.parentId,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'channel', id: `LIST-${arg.serverId}` },
      ],
    }),
    getMyMember: builder.query<MemberEntity, GetMyMemberRequest>({
      query: (req) => ({
        url: `/v1/servers/${req.serverId}/members/@me`,
        method: 'GET',
      }),
      transformResponse: (response: MemberEntity) => new Member(response),
      providesTags: (res, error, req) => [
        { type: 'members', id: 'me' + req.serverId },
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
    getRoleMembers: builder.query<MemberEntity[], GetRoleMembersRequest>({
      query: (req) => `/v1/servers/${req.serverId}/roles/${req.roleId}/members`,
      providesTags: (result, _error, req) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'members' as const, id })),
              { type: 'members', id: `role-${req.roleId}` },
            ]
          : [{ type: 'members', id: `role-${req.roleId}` }],
    }),
    assignMembersToRole: builder.mutation<void, AssignMemberToRoleRequest>({
      query: ({ serverId, roleId, memberIds }) => ({
        url: `/v1/servers/${serverId}/roles/${roleId}/assignation`,
        method: 'POST',
        body: { memberIds },
      }),
      invalidatesTags: (_res, _error, req) => [
        { type: 'members', id: `role-${req.roleId}` },
      ],
    }),
    unassignMemberFromRole: builder.mutation<void, UnassignMemberToRoleRequest>(
      {
        query: ({ serverId, roleId, memberId }) => ({
          url: `/v1/servers/${serverId}/members/${memberId}/roles/${roleId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (_res, _error, req) => [
          { type: 'members', id: `role-${req.roleId}` },
        ],
      }
    ),
    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: ({ serverId, role }) => ({
        url: `/servers/${serverId}/roles`,
        method: 'POST',
        body: {
          name: role.name,
          permissions: role.getRawPermissions(),
        },
      }),
      invalidatesTags: (_res, _error, req) => [
        { type: 'roles', id: `LIST-${req.serverId}` },
      ],
    }),
    updateMemberNickname: builder.mutation<MemberEntity, UpdateMemberRequest>({
      query: ({ serverId, nickname, memberId }) => ({
        url: `/v1/servers/${serverId}/members/${memberId}/nickname`,
        method: 'PUT',
        body: {
          nickname: nickname,
        },
      }),
      invalidatesTags: (_result, _error, req) => [
        { type: 'members', id: `LIST-${req.serverId}` },
        { type: 'members', id: `${req.serverId}:${req.memberId}` },
      ],

      createWebHook: builder.mutation<
        void,
        {
          serverId: string
          channelId: string
          name: string
          profilePicture: File
        }
      >({
        query: (request) => ({
          url: `/servers/${request.serverId}/channels/${request.channelId}/webhook`,
          method: 'POST',
          body: {
            name: request.name,
            profilePicture: request.profilePicture,
          },
        }),
      }),
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
  useGetRolesQuery,
  useUpdateServerRoleMutation,
  useDeleteRoleMutation,
  useUpdateServerMutation,
  useUpdateBannerMutation,
  useUpdatePictureMutation,
  useTransmitBannerQuery,
  useTransmitPictureQuery,
  useDeleteServerMutation,
  useDiscoverServersQuery,
  usePatchChannelPositionMutation,
  useGetRoleMembersQuery,
  useAssignMembersToRoleMutation,
  useUnassignMemberFromRoleMutation,
  useCreateRoleMutation,
  useGetMyMemberQuery,
  useUpdateMemberNicknameMutation,
  useMoveChannelToFolderMutation,
  useCreateWebHookMutation,
} = serverApi
