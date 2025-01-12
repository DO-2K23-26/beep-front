import { OccupiedChannelEntity, UserConnectedEntity, UserEntity } from "@beep/contracts";

interface UserConnectedWithStream {
  user: UserConnectedEntity;
  stream: MediaStream;
}

interface AssociateUsersParameters{
  remoteStreams: RTCRtpTransceiver[];
  streamingUsers: OccupiedChannelEntity[];
  currentChannelId: string;
  currentUser: UserEntity;
  isMuted: boolean;
}


export function associateUsersToStreams({
  remoteStreams,
  streamingUsers,
  currentChannelId,
  currentUser,
  isMuted
}: AssociateUsersParameters): UserConnectedWithStream[] {
  const filteredUserStreamsAssociation: {
    user: UserConnectedEntity
    stream: MediaStream
  }[] = []
  remoteStreams.map((stream) => {
    const usersChannel = streamingUsers?.find(
      (value) => value.channelId === currentChannelId
    )
    return usersChannel?.users?.map((currentUser) => {
      //the mid is composed like this userSerialNumber + '-' + id of track (incremental number)
      if (
        stream.mid?.substring(0, stream.mid?.length - 2) ===
        currentUser.userSn
      ) {
        const toEdit = filteredUserStreamsAssociation.find(
          (entity) => entity.user.id === currentUser.id
        )
        if (toEdit === undefined) {
          filteredUserStreamsAssociation.push({
            user: currentUser,
            stream: new MediaStream([stream.receiver.track]),
          })
        } else {
          toEdit.stream.addTrack(stream.receiver.track)
        }
      }
      return stream
    })
  })
  filteredUserStreamsAssociation.filter((entity) => {
    if (!entity.user.camera && entity.user.id !== currentUser?.id) {
      entity.stream
        .getVideoTracks()
        .map((video) => entity.stream.removeTrack(video))
    }
    if (entity.user.voiceMuted || isMuted) {
      entity.stream
        .getAudioTracks()
        .map((audio) => entity.stream.removeTrack(audio))
    }
    return entity
  })
  return filteredUserStreamsAssociation
}

