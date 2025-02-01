import { useSelector } from 'react-redux'
import { getVoiceState } from '@beep/voice'
import { useEffect, useRef } from 'react'

export function SoundManager() {
  const audioElements = useRef(new Map());
  const { sortedMembers } = useSelector(getVoiceState);

  useEffect(() => {
    // Clean up old audio elements
    const currentIds = new Set(sortedMembers?.map(member => member.user.id));
    audioElements.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        audioElements.current.delete(id);
      }
    });

    // Create/update audio elements for each member
    sortedMembers?.forEach(member => {
      if (!member.stream) return;

      const audioTracks = member.stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      if (!audioElements.current.has(member.user.id)) {
        const audio = new Audio();
        audio.autoplay = true;
        audioElements.current.set(member.user.id, audio);
      }

      const audio = audioElements.current.get(member.user.id);
      if (audio.srcObject !== member.stream) {
        audio.srcObject = member.stream;
      }
    });

    return () => {
      audioElements.current.forEach(audio => {
        audio.srcObject = null;
        audio.remove();
      });
      audioElements.current.clear();
    };
  }, [sortedMembers]);

  return null;
}
