/* eslint-disable @nx/enforce-module-boundaries */
import { ChannelEntity, ChannelType, JoinVoiceChannelRequest } from '@beep/contracts'
import { RootState } from '@beep/store'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { useJoinVoiceChannelMutation, useLeaveVoiceChannelMutation } from '@beep/server'

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
  serverName: string
  connected: boolean
}

export const voiceChannelSlice = createSlice({
  name: 'voiceChannel',
  initialState: {
    focusedChannel: {} as ChannelEntity,
    serverName: '',
    connected: false
  } as VoiceChannelState,
  reducers: {
    setFocusedVoiceChannel(state, { payload }: { payload: JoinVoiceChannelRequest }) {
      state.focusedChannel = payload.channel;
      state.serverName = payload.serverName;
      state.connected = true;
    },
    unsetFocusedVoiceChannel(state) {
      state.focusedChannel = {} as ChannelEntity;
      state.serverName = '';
      state.connected = false;
    }
  }
});

export const voiceChannelReducer = voiceChannelSlice.reducer;
export const voiceChannelActions = voiceChannelSlice.actions;


export const getChannelsState = (root: RootState) => root[CHANNELS_KEY]
