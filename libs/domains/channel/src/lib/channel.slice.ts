import { ChannelEntity, ChannelsState } from "@beep/contracts"
import { RootState } from "@beep/store"
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"

export const CHANNELS_KEY = 'channels'
export const channelsAdapter = createEntityAdapter<ChannelEntity>()

export const initialChannelsState: ChannelsState = {
    channels: []
}

export const channelsSlice = createSlice({
    name: CHANNELS_KEY,
    initialState: channelsAdapter.getInitialState(initialChannelsState),
    reducers: {
        setChannels(state, { payload }) {
            channelsAdapter.setAll(state, payload)
        }
    },
})

export const channelsReducer = channelsSlice.reducer
export const channelsActions = channelsSlice.actions

export const getChannelsState = (root: RootState) => root[CHANNELS_KEY]