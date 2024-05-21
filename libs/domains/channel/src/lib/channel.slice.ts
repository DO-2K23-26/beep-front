/* eslint-disable @nx/enforce-module-boundaries */
import { ChannelEntity, ChannelType, JoinVoiceChannelRequest } from '@beep/contracts'
import { RootState } from '@beep/store'
import { socket } from '@beep/utils'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

export const CHANNELS_KEY = 'channels'
export const channelsAdapter = createEntityAdapter<ChannelEntity>()
export const initialChannel: ChannelEntity = {
  id: '',
  name: '',
  type: ChannelType.VOICE,
  serverId: ''
}

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
    setFocusedVoiceChannel(state, { payload }: { payload: JoinVoiceChannelRequest }) {
      console.log('Joining voice channel', payload)
      socket.emit('join_voice', {
        channelId: payload.channel.id,
        serverId: payload.serverId
      })
      state.focusedChannel = payload.channel;
      state.connected = true;
    },
    unsetFocusedVoiceChannel(state) {
      socket.emit('leave_voice', {
        channel_id: state.focusedChannel.id,
      })
      state.focusedChannel = {} as ChannelEntity;
      state.connected = false;
    }
  }
});

export const voiceChannelReducer = voiceChannelSlice.reducer;
export const voiceChannelActions = voiceChannelSlice.actions;


export const getChannelsState = (root: RootState) => root[CHANNELS_KEY]
