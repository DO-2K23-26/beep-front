import { Device } from './device.entity'
import { Media } from './media.entity'

export interface IVoice {
  codec: string
  videoBitsPerSecond: number
  audioBitsPerSecond: number
  bufferLength: number
  videoDevice: Media | null
  audioInputDevice: Media | null
  audioOutputDevice: Media | null
  devices: Device[]
  onlyAudio: boolean
  permissions: {
    audio: PermissionState
    video: PermissionState
  }
}
