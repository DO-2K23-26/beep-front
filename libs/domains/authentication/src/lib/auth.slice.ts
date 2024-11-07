/* eslint-disable @nx/enforce-module-boundaries */
import { RootState } from '@beep/store'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  qrCodeToken: string
}

export const AUTH_KEY = 'authentication'

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    qrCodeToken: '',
  } as AuthState,
  reducers: {
    setQRCodeToken(
      state,
      { payload }: { payload: string }
    ) {
      state.qrCodeToken = payload
    },
  },
})

export const authenticationReducer = authSlice.reducer
export const authenticationActions = authSlice.actions
export const { setQRCodeToken } = authenticationActions

export const getAuthState = (root: RootState) => root[AUTH_KEY]
