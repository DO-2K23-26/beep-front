import {
  BaseQueryApi,
  BaseQueryArg,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  AskTOPTURIRequest,
  AskTOTPURIResponse,
  backendUrl,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  GetMultipleUsersRequest,
  GetUserRequest,
  LoginRequest,
  LoginResponse,
  OtpMailSendRequest,
  RefreshRequest,
  RefreshResponse,
  RegisterResponse,
  ResetPasswordRequest,
  UpdateEmailRequest,
  UpdateMicRequest,
  UpdatePassword,
  UpdateUserResponse,
  UserConnectedEntity,
  UserDisplayedEntity,
  UserEntity,
  Complete2FARegistrationRequest,
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
    // refresh: builder.mutation<RefreshResponse, void>({
    //   query: () => ({
    //     url: '/authentication/refresh',
    //     method: 'POST',
    //     credentials: 'include',
    //   }),
    // }),
    askTOTPURI: builder.mutation<AskTOTPURIResponse, AskTOPTURIRequest>({
      query: (body) => ({
        url: '/authentication/totp',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
    changePassword: builder.mutation<void, UpdatePassword>({
      query: (data) => ({
        url: '/authentication/password',
        method: 'PATCH',
        body: data,
      })
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
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (refreshToken) => ({
        url: '/authentication/refresh',
        method: 'POST',
        body: refreshToken,
      }),
    }),
    // Send OTP for email change
    sendOtpEmail: builder.mutation<void, OtpMailSendRequest>({
      query: (data) => ({
        url: '/users/otp/generate', // Make sure this URL matches your backend route
        method: 'POST',
        body: data, // This will send the email to the backend
      }),
    }),
    // Verify OTP for email change
    verifyOtpCode: builder.mutation<void, { email: string; otp: string }>({
      query: (data) => ({
        url: '/users/otp/verify', // Make sure this URL matches your backend route
        method: 'POST',
        body: data, // This will send the email and OTP to verify
      }),
    }),
    confirmEmail: builder.mutation<void, ConfirmEmailRequest>({
      query: (data) => ({
        url: `/users/@me/email`,
        method: 'PUT',
        body: data,
      }),
    }),
    updateEmail: builder.mutation<void, UpdateEmailRequest>({
      query: (data) => ({
        url: `/users/@me/email/update`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['me'],
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
    complete2FARegistration: builder.mutation<
      { message: string },
      Complete2FARegistrationRequest
    >({
      query: (totp) => ({
        url: `/authentication/totp/complete`,
        method: 'POST',
        body: totp,
        credentials: 'include',
      }),
      invalidatesTags: ['me'], //because updates the totpAuthentication field
    }),
    disable2FA: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `/authentication/totp/disable`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['me'],
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
  useSendOtpEmailMutation, // to send OTP
  useVerifyOtpCodeMutation, // to verify OTP
  useUpdateEmailMutation,
  useLogoutMutation,
  useAskTOTPURIMutation,
  useComplete2FARegistrationMutation,
  useDisable2FAMutation,
  useChangePasswordMutation,
} = userApi
