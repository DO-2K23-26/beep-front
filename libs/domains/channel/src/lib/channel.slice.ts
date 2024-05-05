import { ChannelEntity, ChannelsState } from "@beep/contracts"
import { RootState } from "@beep/store"
import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit"

export const CHANNELS_KEY = 'channels'
export const channelsAdapter = createEntityAdapter<ChannelEntity>()

export const initialChannelsState: ChannelsState = {
    currentChannel: undefined
}

export const channelsSlice = createSlice({
    name: CHANNELS_KEY,
    initialState: channelsAdapter.getInitialState(initialChannelsState),
    reducers: {
        setCurrentChannel(state, payload: PayloadAction<ChannelEntity>) {
            state.currentChannel = payload.payload
        },
    },
})

export const channelsReducer = channelsSlice.reducer
export const channelsActions = channelsSlice.actions

export const getChannelsState = (root: RootState) => root[CHANNELS_KEY]