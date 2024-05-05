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
}
export const userSlice = createSlice({
  name: USER_KEY,
  initialState: initialUserState,
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
          atob(payload.payload.accessToken?.split('.')[1]),
        );
      }

      state.tokens = payload.payload
      state.isAuthenticated = !!payload.payload.accessToken
      console.log(payload.payload.accessToken);
      console.log(!payload.payload.accessToken)
    },
    updateIsLoading(state, payload: PayloadAction<boolean>) {
      state.isLoading = payload.payload
    },
  },
})
export const getUserState = (root: RootState) => root[USER_KEY]
export const userReducer = userSlice.reducer
export const userActions = userSlice.actions

