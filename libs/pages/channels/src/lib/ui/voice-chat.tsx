import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Media } from './media';
import { getVoiceState } from '@beep/voice' // Adjust the import path as needed

export function VoiceChat() {
  const { sortedMembers, localStream } = useSelector(getVoiceState);

  const memberMediaComponents = useMemo(() => {
    return sortedMembers && sortedMembers.map((entity, index) => {
      return <Media key={index} stream={entity.stream} url={null} username={entity.user.username} />;
    });
  }, [sortedMembers]);

  const localMediaComponent = useMemo(() => {
    return localStream ? <Media stream={localStream} url={null} username={"me"} /> : null;
  }, [localStream]);

  return (
    <>
      {memberMediaComponents}
      {localMediaComponent}
    </>
  );
}
