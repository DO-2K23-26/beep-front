import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import {
  IVoice,
  Media,
  OccupiedChannelEntity,
  UserConnectedEntity,
} from '@beep/contracts'

export const initializeDevices = createAsyncThunk(
  'webRTC/initializeDevices',
  async (_, { dispatch }) => {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const devicesIn = await navigator.mediaDevices.enumerateDevices()
    const audioInput =
      devicesIn.find((device) => device.kind === 'audioinput') || null
    const videoInput =
      devicesIn.find((device) => device.kind === 'videoinput') || null
    dispatch(setDevices(devicesIn))
    if (audioInput) dispatch(setAudioInputDevice(audioInput))
    if (videoInput) dispatch(setVideoDevice(videoInput))
  }
)

const initialState: IVoice = {
  serverPresence: [],
  currentChannelId: '',
  localStream: null,
  remoteStreams: [],
  userStreams: [],
  connectionState: 'Waiting',
  channelStatus: 'Click Join Button...',
  audioInputDevice: null,
  audioOutputDevice: null,
  videoDevice: null,
  devices: [],
  sortedMembers: [],
}

const webrtcSlice = createSlice({
  name: 'webRTC',
  initialState: initialState,
  reducers: {
    setLocalStream(state, action: PayloadAction<MediaStream | null>) {
      state.localStream = action.payload
    },
    addRemoteStream(state, action: PayloadAction<RTCRtpTransceiver>) {
      state.remoteStreams.push(action.payload)
    },
    setRemoteStreams(state, action: PayloadAction<RTCRtpTransceiver[]>) {
      state.remoteStreams = action.payload
    },
    setConnectionState(state, action: PayloadAction<string>) {
      state.connectionState = action.payload
    },
    setChannelStatus(state, action: PayloadAction<string>) {
      state.channelStatus = action.payload
    },
    setAudioInputDevice(state, action: PayloadAction<MediaDeviceInfo>) {
      state.audioInputDevice = action.payload
    },
    setAudioOutputDevice(state, action: PayloadAction<Media>) {
      state.audioOutputDevice = action.payload
    },
    setVideoDevice(state, action: PayloadAction<MediaDeviceInfo>) {
      state.videoDevice = action.payload
    },
    setDevices(state, action: PayloadAction<MediaDeviceInfo[]>) {
      state.devices = action.payload

      if (state.audioInputDevice) {
        const matchingAudioInput = action.payload.find(
          (device) =>
            device.deviceId === state.audioInputDevice.deviceId &&
            device.kind === 'audioinput'
        )

        if (!matchingAudioInput) {
          const firstAudioInput = action.payload.find(
            (device) => device.kind === 'audioinput'
          )
          state.audioInputDevice = firstAudioInput || null
        }
      }

      if (state.videoDevice) {
        const matchingVideoInput = action.payload.find(
          (device) =>
            device.deviceId === state.videoDevice.deviceId &&
            device.kind === 'videoinput'
        )
        if (!matchingVideoInput) {
          const firstVideoInput = action.payload.find(
            (device) => device.kind === 'videoinput'
          )
          state.videoDevice = firstVideoInput || null
        }
      }

      if (state.audioOutputDevice) {
        const matchingAudioOutput = action.payload.find(
          (device) =>
            device.deviceId === state.audioOutputDevice.id &&
            device.kind === 'audiooutput'
        )
        if (!matchingAudioOutput) {
          const firstAudioOutput = action.payload.find(
            (device) => device.kind === 'audiooutput'
          )
          state.audioOutputDevice = firstAudioOutput
            ? { id: firstAudioOutput.deviceId, name: firstAudioOutput.label }
            : null
        }
      }
    },
    setCurrentChannelId(state, action: PayloadAction<string>) {
      state.currentChannelId = action.payload
    },
    setSortedMembers(
      state,
      action: PayloadAction<
        { user: UserConnectedEntity; stream: MediaStream }[]
      >
    ) {
      state.sortedMembers = action.payload
      console.log('update sortedMembers', state.sortedMembers)
    },
    setUserStreams(
      state,
      action: PayloadAction<
        { id: string; audio: string; video: string; channel: string }[]
      >
    ) {
      state.userStreams = action.payload
    },
    setServerPresence(state, action: PayloadAction<OccupiedChannelEntity>) {
      if (
        !state.serverPresence.find(
          (channel) => action.payload.channelId === channel.channelId
        )
      ) {
        state.serverPresence.push({
          channelId: action.payload.channelId,
          users: action.payload.users,
        })
      } else {
        state.serverPresence = state.serverPresence.map((occupied) =>
          occupied.channelId === action.payload.channelId
            ? action.payload
            : occupied
        )
      }
    },
  },
})

export const {
  setLocalStream,
  addRemoteStream,
  setConnectionState,
  setChannelStatus,
  setAudioInputDevice,
  setVideoDevice,
  setAudioOutputDevice,
  setRemoteStreams,
  setDevices,
  setCurrentChannelId,
  setSortedMembers,
  setUserStreams,
  setServerPresence,
} = webrtcSlice.actions

export const getVoiceState = (root: RootState) => root['webRTC']

export const webrtcSliceReducer = webrtcSlice.reducer
