import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ServerEntity, ServerState } from '@beep/contracts'
import { RootState } from "@beep/store"

export const initialServersState: ServerState = {
  servers: []
}

const serverAdapter = createEntityAdapter<ServerEntity>()
export const SERVER_KEY = 'servers'
export const serverSlice = createSlice({
  name: SERVER_KEY,
  initialState: serverAdapter.getInitialState(initialServersState),
  reducers: {
    setServers(state, payload: PayloadAction<ServerEntity[]>) {
      serverAdapter.setAll(state, payload.payload)
    },
    addServer(state, payload: PayloadAction<ServerEntity>) {
      serverAdapter.addOne(state, payload.payload)
    },
    removeServer(state, payload: PayloadAction<number>) {
      serverAdapter.removeOne(state, payload.payload)
    },
  },
})
export const serverReducer = serverSlice.reducer
export const serverActions = serverSlice.actions
export const getServersState = (root: RootState) => root[SERVER_KEY]