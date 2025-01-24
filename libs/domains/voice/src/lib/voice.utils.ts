import { OccupiedChannelEntity, UserConnectedEntity, UserEntity } from "@beep/contracts";

interface UserConnectedWithStream {
  user: UserConnectedEntity;
  stream: MediaStream;
}

interface AssociateUsersParameters{
  remoteStreams: RTCRtpTransceiver[];
  streamingUsers: OccupiedChannelEntity[];
  userStreams: {id: string, audio: string, video: string, channel: string}[];
  serverPresence: OccupiedChannelEntity[];
  currentChannelId: string;
  currentUser: UserEntity;
  isScreenShared: boolean;
}


export function associateUsersToStreams({
  remoteStreams,
  userStreams,
  serverPresence,
  currentChannelId,
  currentUser,
  isScreenShared,
}: AssociateUsersParameters): UserConnectedWithStream[] {
  const filteredUserStreamsAssociation: {
    user: UserConnectedEntity
    stream: MediaStream
  }[] = []
  const usersChannel = serverPresence?.find(
    (value) => value.channelId === currentChannelId
  )
  userStreams.map((userStream) => {
    const userchan = usersChannel?.users?.find(
      (userchan) =>
        userchan.id === userStream.id && currentUser.id !== userStream.id
    )
    if (userchan) {
      const userbis = { ...userchan }
      const stream = new MediaStream()
      if (userStream.audio !== null) {
        userbis.screenSharing = false
        userbis.voiceMuted = false
        const audioTranceiver = remoteStreams.find(
          (stream) => stream.receiver.track.id === userStream.audio
        )
        if (audioTranceiver) {
          stream.addTrack(audioTranceiver.receiver.track)
        }
      }
      if (userStream.video !== null) {
        userbis.camera = true
        const videoTrack = remoteStreams.find(
          (stream) => stream.receiver.track.id === userStream.video
        )
        if (videoTrack) {
          stream.addTrack(videoTrack.receiver.track)
        }
      }
      filteredUserStreamsAssociation.push({
        user: userbis,
        stream: stream,
      })
    }
  })
  return filteredUserStreamsAssociation
}

