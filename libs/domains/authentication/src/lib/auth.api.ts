/* eslint-disable @nx/enforce-module-boundaries */
import {
  backendUrl,
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
    getGeneratedToken: builder.mutation<{ token: string }, null>({
      query: (request) => ({
        url: `/authentication/qr-code`,
        method: 'GET',
      }),
    }),
    validateToken: builder.mutation<{ isValidated: boolean }, { token: string }>({
      query: (request) => {
        return {
          url: `/authentication/qr-code/${request.token}`,
          method: 'POST',
        };
      },
    }),
    retrieveJwts: builder.query<{ isValid: boolean; accessToken: string; refreshToken: string }, { token: string }>({
      query: (request) => ({
        url: `/authentication/qr-code/${request.token}`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useGetGeneratedTokenMutation,
  useValidateTokenMutation,
  useRetrieveJwtsQuery,
} = authApi
