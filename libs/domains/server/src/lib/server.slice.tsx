import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerEntity, ServerState } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'

export const initialServersState: ServerState = {
  server: undefined,
}

const serverAdapter = createEntityAdapter<ServerEntity>()
export const SERVER_KEY = 'servers'
export const serverSlice = createSlice({
  name: SERVER_KEY,
  initialState: serverAdapter.getInitialState(initialServersState),
  reducers: {
    setServer(state, action: PayloadAction<ServerEntity>) {
      state.server = action.payload
    },
    setInviteCode(state, action: PayloadAction<string | null>) {
      if (state.server) {
        state.server.invite_code = action.payload as string
      }
    },
  },
})

export const serverReducer = serverSlice.reducer
export const serverActions = serverSlice.actions
export const getServersState = (root: RootState) => root[SERVER_KEY]
