import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  backendUrl,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  GetMultipleUsersRequest,
  GetUserRequest,
  LoginRequest,
  LoginWithQRCodeRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterResponse,
  ResetPasswordRequest,
  UpdateMicRequest,
  UpdateUserResponse,
  UserConnectedEntity,
  UserDisplayedEntity,
  UserEntity,
} from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import {
  BaseQueryArg,
  BaseQueryExtraOptions,
} from '@reduxjs/toolkit/dist/query/baseQueryTypes'

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // const { user } = getState() as RootState
    // if (user?.tokens?.accessToken) {
    //   headers.set('Authorization', `Bearer ${user.tokens.accessToken}`)
    // }
    return headers
  },
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
  tagTypes: ['users', 'profilePicture', 'me', 'servers'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/authentication/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    loginWithQRCode: builder.mutation<LoginResponse, LoginWithQRCodeRequest>({
      query: (tokens) => ({
        url: `/authentication/signin-qr-code`,
        method: 'POST',
        body: tokens,
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
        responseHandler: async (response) => {
          const blob = await response.blob()
          return URL.createObjectURL(blob)
        },
      }),
      providesTags: (_, __, id) => [{ type: 'profilePicture', id: id }],
    }),
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (refreshToken) => ({
        url: '/authentication/refresh',
        method: 'POST',
        body: refreshToken,
      }),
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
  }),
})

export const {
  useConfirmEmailMutation,
  useGetUsersFromQuery,
  useLoginMutation,
  useLoginWithQRCodeMutation,
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
} = userApi
