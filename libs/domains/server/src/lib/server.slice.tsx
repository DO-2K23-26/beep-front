import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ServerEntity } from '@beep/contracts'

const serverAdapter = createEntityAdapter<ServerEntity>()
export const SERVER_KEY = 'server'
export const serverSlice = createSlice({
  name: SERVER_KEY,
  initialState: [],
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