import { useSelector } from 'react-redux'
import { getVoiceState } from '@beep/voice';
import { Media } from './media';

export function VoiceChat() {
  const { sortedMembers, localStream } = useSelector(getVoiceState)
  return (
    <>
      {sortedMembers && sortedMembers.map((entity, index) => {
        console.log("streaming those streams",entity.stream, entity.stream.getTracks(), entity.stream.getVideoTracks().length)
        return <Media key={index} stream={entity.stream} url={null} username={entity.user.username} />
      })}
      {localStream && <Media stream={localStream} url={null} username={"me"} />}
    </>
  )
}
