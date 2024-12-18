import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerEntity, ServerState } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import { RoleEntity } from 'libs/shared/contracts/src/lib/entities/role.entity'

export const initialServersState: ServerState = {
  server: undefined,
  roles: [],
  inviteCode: null,
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
    setRoles(state, action: PayloadAction<RoleEntity[]>) {
      state.roles = action.payload
    },
    setInviteCode(state, action: PayloadAction<string | null>) {
      if (state.server) {
        state.inviteCode = action.payload as string
      }
    },
  },
})

export const serverReducer = serverSlice.reducer
export const serverActions = serverSlice.actions
export const getServersState = (root: RootState) => root[SERVER_KEY]
