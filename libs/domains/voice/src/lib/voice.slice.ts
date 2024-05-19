// eslint-disable-next-line @nx/enforce-module-boundaries
import { Device, IVoice, Media, defaultMedia } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const VOICE_KEY = 'voice'

function getDevice(key: string): Media {
  const initialValue = localStorage.getItem(key) || '{}'
  console.log('initialValue', initialValue)
  const parsedValue = JSON.parse(initialValue)
  return {
    id: parsedValue.id || '',
    name: parsedValue.name || '',
  }
}

const initialState: IVoice = {
  codec: 'video/webm;codecs=vp8,opus',
  videoBitsPerSecond: Math.trunc(128000 * 4),
  audioBitsPerSecond: 128000,
  bufferLength: 1500,
  videoDevice: getDevice('videoDevice') || defaultMedia,
  audioInputDevice: getDevice('audioInputDevice') || defaultMedia,
  audioOutputDevice: getDevice('audioOutputDevice') || defaultMedia,
  devices: [],
  onlyAudio: false,
  permissions: {
    audio: 'prompt',
    video: 'prompt',
  },
}

export const voiceSlice = createSlice({
  name: VOICE_KEY,
  initialState: initialState,
  reducers: {
    setCodec: (state: IVoice, action: PayloadAction<string>) => {
      state.codec = action.payload
    },
    setBitsPerSecond: (
      state: IVoice,
      action: PayloadAction<{ video: number; audio: number }>
    ) => {
      state.videoBitsPerSecond = action.payload.video
      state.audioBitsPerSecond = action.payload.audio
    },
    setDevices(state: IVoice, action: PayloadAction<Device[]>) {
      state.devices = action.payload
    },
    setVideoDevice: (state: IVoice, action: PayloadAction<Media>) => {
      state.videoDevice = action.payload
      localStorage.setItem('videoDevice', JSON.stringify(action.payload))
    },
    setAudioInputDevice: (state: IVoice, action: PayloadAction<Media>) => {
      state.audioInputDevice = action.payload
      localStorage.setItem('audioInputDevice', JSON.stringify(action.payload))
    },
    setAudioOutputDevice: (state: IVoice, action: PayloadAction<Media>) => {
      state.audioOutputDevice = action.payload
      localStorage.setItem('audioOutputDevice', JSON.stringify(action.payload))
    },
    setCameraPermission: (
      state: IVoice,
      action: PayloadAction<PermissionState>
    ) => {
      state.permissions.video = action.payload
    },
    setMicrophonePermission: (
      state: IVoice,
      action: PayloadAction<PermissionState>
    ) => {
      state.permissions.audio = action.payload
    },
    setOnlyAudio: (state: IVoice, action: PayloadAction<boolean>) => {
      state.onlyAudio = action.payload
    },
  },
  selectors: {
    selectDevices: (state: IVoice) => state.devices,
  },
})

export const voiceSliceSelector = voiceSlice.selectors
export const voiceSliceReducer = voiceSlice.reducer
export const getVoiceState = (root: RootState) => root[VOICE_KEY]
export const voiceActions = voiceSlice.actions
export const getAudioInputDevice = (root: RootState) =>
  getVoiceState(root).audioInputDevice
export const getVideoDevice = (root: RootState) =>
  getVoiceState(root).videoDevice
export const getBufferLength = (root: RootState) =>
  getVoiceState(root).bufferLength
