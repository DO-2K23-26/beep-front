import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { UserEntity, UserState } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
export const USER_KEY = 'user'
export const userAdapter = createEntityAdapter<UserEntity>()
export const initialUserState: UserState = {
  isAuthenticated: false,
  isLoading: true,
  tokens: {},
  isScreenShared: false,
  isVoiceMuted: false,
  isCamera: true,
}
export const userSlice = createSlice({
  name: USER_KEY,
  initialState: initialUserState,
  selectors: {
    currentUser: (state) => state.payload,
  },
  reducers: {
    setTokens(
      state,
      payload: PayloadAction<{
        accessToken?: string | null
        refreshToken?: string | null
      }>
    ) {
      if (payload.payload.accessToken) {
        state.payload = JSON.parse(
          atob(payload.payload.accessToken?.split('.')[1])
        )
        document.cookie = `beep.access_token=${payload.payload.accessToken}; path=/;`
      }

      if (payload.payload.refreshToken) {
        document.cookie = `beep.refresh_token=${payload.payload.refreshToken}; path=/;`
      }

      state.tokens = payload.payload
      state.isAuthenticated = !!payload.payload.accessToken
    },
    updateIsLoading(state, payload: PayloadAction<boolean>) {
      state.isLoading = payload.payload
    },
    toggleIsScreenShared(state: UserState, payload: PayloadAction<string>) {
      state.isScreenShared = !state.isScreenShared
    },
    toggleIsVoiceMuted(state: UserState, payload: PayloadAction<string>) {
      state.isVoiceMuted = !state.isVoiceMuted
    },
    toggleIsCamera(state: UserState, payload: PayloadAction<string>) {
      state.isCamera = !state.isCamera
    },
  },
})

export const { currentUser } = userSlice.selectors
export const getUserState = (root: RootState) => root[USER_KEY]
export const userReducer = userSlice.reducer
export const userActions = userSlice.actions
export const { toggleIsScreenShared } = userActions
export const { toggleIsVoiceMuted } = userActions
export const { toggleIsCamera } = userActions
