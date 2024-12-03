/* eslint-disable @nx/enforce-module-boundaries */
import {
  backendUrl,
  LoginResponse,
  LoginWithQRCodeRequest,
} from '@beep/contracts'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: 'include',
})

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['message', 'users'],
  endpoints: (builder) => ({
    getGeneratedToken: builder.query<{ token: string }, null>({
      query: (request) => ({
        url: `/authentication/qr-code`,
        method: 'GET',
        keepUnusedDataFor: 5,
      }),
    }),
    validateToken: builder.mutation<
      { isValidated: boolean },
      { token: string }
    >({
      query: (request) => {
        return {
          url: `/authentication/qr-code/${request.token}`,
          method: 'POST',
        }
      },
    }),
    loginWithQRCode: builder.mutation<LoginResponse, LoginWithQRCodeRequest>({
      query: (tokens) => ({
        url: `/authentication/signin`,
        method: 'POST',
        body: tokens,
      }),
    }),
  }),
})

export const {
  useLazyGetGeneratedTokenQuery,
  useLoginWithQRCodeMutation,
  useValidateTokenMutation,
} = authApi
