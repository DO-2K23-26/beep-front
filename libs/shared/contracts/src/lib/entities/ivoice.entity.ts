import { UserConnectedEntity } from './user-connected.entity';
import { Media } from './media.entity';
import { OccupiedChannelEntity } from './occupied-channel.entity'

export interface IVoice {
  serverPresence: OccupiedChannelEntity[];
  currentChannelId: string;
  localStream: MediaStream | null;
  remoteStreams: RTCRtpTransceiver[];
  userStreams: {id: string, audio: string, video: string, channel: string}[];
  audioInputDevice: MediaDeviceInfo | null;
  audioOutputDevice: Media | null;
  videoDevice: MediaDeviceInfo | null;
  devices: MediaDeviceInfo[];
  connectionState: string;
  channelStatus: string;
  needConnection: boolean;
  sortedMembers: {user: UserConnectedEntity, stream: MediaStream}[]
}
