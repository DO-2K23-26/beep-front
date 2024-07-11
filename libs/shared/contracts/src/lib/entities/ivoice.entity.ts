import { UserConnectedEntity } from './user-connected.entity';
import { Media } from './media.entity';

export interface IVoice {
  currentChannelId: string;
  localStream: MediaStream | null;
  remoteStreams: RTCRtpTransceiver[];
  audioInputDevice: MediaDeviceInfo | null;
  audioOutputDevice: Media | null;
  videoDevice: MediaDeviceInfo | null;
  devices: MediaDeviceInfo[];
  connectionState: string;
  channelStatus: string;
  sortedMembers: {user: UserConnectedEntity, stream: MediaStream}[]
}
