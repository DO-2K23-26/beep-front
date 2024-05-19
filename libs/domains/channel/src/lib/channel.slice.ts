import { ChannelEntity, ChannelType, ChannelsState } from '@beep/contracts'
import { RootState } from '@beep/store'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { socket } from '@beep/utils'
import { Channel } from "diagnostics_channel";

export const CHANNELS_KEY = 'channels'
export const channelsAdapter = createEntityAdapter<ChannelEntity>()
export const initialChannel: ChannelEntity = {
  id: '',
  name: '',
  type: ChannelType.VOICE,
  serverId: ''
}
export const initialChannelsState: ChannelsState = {
  focusedChannel: initialChannel,
  connected: false,
  // connectionState: 'none',
}

export const channelsSlice = createSlice({
  name: CHANNELS_KEY,
  initialState: channelsAdapter.getInitialState(initialChannelsState),
  reducers: {
    setFocusedChannel(state, { payload }) {
      console.log('Joining channel', payload)
      socket.emit('join_channel', {
        channel_id: payload.id,
      })
      state.focusedChannel = payload
      state.connected = true
    },
    unsetFocusedChannel(state) {
      socket.emit('leave_channel', {
        channel_id: state.focusedChannel.id,
      })
      state.focusedChannel = initialChannel
      state.connected = false
    },
    // setConnectionState(state, { payload }) {
    //   state.connectionState = payload
    // },
  },
})

export interface VoiceChannelState {
    focusedChannel: ChannelEntity
    connected: boolean
}

export const voiceChannelSlice = createSlice({
    name: 'voiceChannel',
    initialState: {
        focusedChannel: {} as ChannelEntity,
        connected: false
    } as VoiceChannelState,
    reducers: {
        setFocusedVoiceChannel(state, { payload }) {
            console.log('Joining voice channel', payload)
            socket.emit('join_voice_channel', {
                channel_id: payload.id,
            })
            state.focusedChannel = payload;
            state.connected = true;
        },
        unsetFocusedVoiceChannel(state) {
            state.focusedChannel = {} as ChannelEntity;
            state.connected = false;
        }
    }
});

export const voiceChannelReducer = voiceChannelSlice.reducer;
export const voiceChannelActions = voiceChannelSlice.actions;

export const channelsReducer = channelsSlice.reducer
export const channelsActions = channelsSlice.actions

export const getChannelsState = (root: RootState) => root[CHANNELS_KEY]
