import {
  BaseQueryApi,
  BaseQueryArg,
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  backendUrl,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  GetMultipleUsersRequest,
  GetUserRequest,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
  ResetPasswordRequest,
  UpdateMicRequest,
  UpdateUserResponse,
  UserConnectedEntity,
  UserDisplayedEntity,
  UserEntity
} from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries


const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
})
export const baseQueryWithReauth = async (
  args: BaseQueryArg<any>,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const result = await baseQuery(args, api, extraOptions)

  // Check if we got a 401 response
  if (result.error && result.error.status === 401) {
    // Handle the 401 status code - for example, dispatch a logout action
    // Or you can navigate to the login page (if using react-router)
    const refreshResult = await fetch(backendUrl + '/authentication/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (refreshResult.ok) {
      // Retry the original request
      // result = await baseQuery(args, api, extraOptions)
      window.location.reload()
    }
  }

  return result
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['users', 'profilePicture', 'me', 'servers', 'friends'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/authentication/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, FormData>({
      query: (data) => ({
        url: '/authentication/signup',
        method: 'POST',
        body: data,
        formData: true,
      }),
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: '/authentication/refresh',
        method: 'POST',
        credentials: 'include',
      }),
    }),

    updateMe: builder.mutation<UpdateUserResponse, FormData>({
      query: (data) => ({
        url: '/users/@me',
        method: 'PUT',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['profilePicture', 'me'],
    }),
    getMe: builder.query<UserEntity, void>({
      query: () => ({
        url: '/users/@me',
        method: 'GET',
      }),
      providesTags: ['me'],
    }),
    getUsersFrom: builder.query<UserEntity[], GetMultipleUsersRequest>({
      query: (request) => ({
        url: `/users?${request.userIds
          .map((id, i) => `ids[${i}]=${id}`)
          .join('&')}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'users' as const, id: id }))]
          : [{ type: 'users' }],
    }),
    fetchProfilePicture: builder.query<string, string>({
      query: (id) => ({
        url: `/storage/files/secure/profilePicture/${id}`,
        responseHandler: async (response: Response) => {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        },
      }),
      providesTags: (_, __, id) => [{ type: 'profilePicture', id: id }],
    }),
    confirmEmail: builder.mutation<void, ConfirmEmailRequest>({
      query: (data) => ({
        url: `/users/@me/email`,
        method: 'PUT',
        body: data,
      }),
    }),
    fetchAllUsers: builder.query<UserConnectedEntity[], void>({
      query: () => '/users/display',
      providesTags: ['users'],
    }),
    fetchAllUsersConnected: builder.query<UserConnectedEntity[], void>({
      query: () => '/users/onlines',
      providesTags: ['users'],
    }),
    sendEmail: builder.mutation<undefined, void>({
      query: () => ({
        url: '/authentication/send-email',
        method: 'POST',
      }),
    }),
    sendResetPasswordMail: builder.mutation<void, ForgotPasswordRequest>({
      query: (request) => ({
        url: '/authentication/reset-password',
        method: 'POST',
        body: request,
      }),
    }),
    verifyEmail: builder.mutation<void, { token: string }>({
      query: (data) => ({
        url: '/authentication/verify',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: '/authentication/verify-reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    getUserById: builder.query<UserDisplayedEntity, GetUserRequest>({
      query: ({ id }) => `/users/${id}`,
      providesTags: (result) => {
        if (result !== undefined) return [{ type: 'users', id: result.id }]
        else return [{ type: 'users' }]
      },
    }),
    updateState: builder.mutation<
      void,
      { serverId: string; payload: UpdateMicRequest }
    >({
      query: ({ serverId, payload }) => ({
        url: `/servers/${serverId}/users/mic`,
        method: 'POST',
        body: payload,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/authentication/logout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useConfirmEmailMutation,
  useGetUsersFromQuery,
  useLoginMutation,
  useSendResetPasswordMailMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useRefreshMutation,
  useGetMeQuery,
  useFetchAllUsersQuery,
  useUpdateMeMutation,
  useFetchProfilePictureQuery,
  useFetchAllUsersConnectedQuery,
  useSendEmailMutation,
  useVerifyEmailMutation,
  useGetUserByIdQuery,
  useUpdateStateMutation,
  useLogoutMutation,
} = userApi
