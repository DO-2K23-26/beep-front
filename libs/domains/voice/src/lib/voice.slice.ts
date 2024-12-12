import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store';
import { IVoice, Media, OccupiedChannelEntity, UserConnectedEntity } from '@beep/contracts'

// TODO Implement audioOutputDevice
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
  sortedMembers: []
};
//
const webrtcSlice = createSlice({
  name: 'webRTC',
  initialState: initialState,
  reducers: {

    setLocalStream(state, action: PayloadAction<MediaStream | null>) {
      state.localStream = action.payload;
    },
    addRemoteStream(state, action: PayloadAction<RTCRtpTransceiver>) {
      state.remoteStreams.push(action.payload);
    },
    setRemoteStreams(state, action: PayloadAction<RTCRtpTransceiver[]>) {
      state.remoteStreams = action.payload
    },
    setConnectionState(state, action: PayloadAction<string>) {
      state.connectionState = action.payload;
    },
    setChannelStatus(state, action: PayloadAction<string>) {
      state.channelStatus = action.payload;
    },
    setAudioInputDevice(state, action: PayloadAction<MediaDeviceInfo>) {
      state.audioInputDevice = action.payload;
    },
    setAudioOutputDevice(state, action: PayloadAction<Media>) {
      state.audioOutputDevice = action.payload;
    },
    setVideoDevice(state, action: PayloadAction<MediaDeviceInfo>) {
      state.videoDevice = action.payload;
    },
    setDevices(state, action: PayloadAction<MediaDeviceInfo[]>) {
      state.devices = action.payload;
    },
    setCurrentChannelId(state, action: PayloadAction<string>) {
      state.currentChannelId = action.payload;
    },
    setSortedMembers(state, action: PayloadAction<{ user: UserConnectedEntity, stream: MediaStream }[]>) {
      state.sortedMembers = action.payload;
      console.log("update sortedMembers", state.sortedMembers)
    },
    setUserStreams(state, action: PayloadAction<{id: string, audio: string, video: string, channel: string }[]>) {
      state.userStreams = action.payload;
    },
    setServerPresence(state, action: PayloadAction<OccupiedChannelEntity>) {
      if (!state.serverPresence.find((channel)=> action.payload.channelId === channel.channelId)){
        state.serverPresence.push({channelId: action.payload.channelId, users: action.payload.users});
      } else{
        state.serverPresence = state.serverPresence.map((occupied) => occupied.channelId === action.payload.channelId ? action.payload : occupied);
      }
    }
  },
});

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
  setServerPresence
} = webrtcSlice.actions;

export const getVoiceState = (root: RootState) => root['webRTC'];

export const webrtcSliceReducer = webrtcSlice.reducer;
