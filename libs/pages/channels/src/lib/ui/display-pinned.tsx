import React, { useState } from 'react';
import { Button, ButtonSize } from '@beep/ui';
import PinnedMessagesList from './pinned-messages-list';
import { useFetchPinnedMessagesQuery } from '@beep/channel';

interface DisplayPinnedProps {
  channelId: string;
  onUpdateMessage: (message: string) => void;
  control: any; 
}

const DisplayPinned: React.FC<DisplayPinnedProps> = ({ channelId, onUpdateMessage, control }) => {
  const [showPinnedMessages, setShowPinnedMessages] = useState<boolean>(false);
  const { data: messages} = useFetchPinnedMessagesQuery(channelId);


  return (
    <div className='relative'>
      <Button
        iconLeft={'lucide:pin'}
        size={ButtonSize.REGULAR}
        className="flex flex-row gap-2 items-center justify-center p-3 bg-violet-300 rounded-xl !h-14"
        onClick={() => setShowPinnedMessages(!showPinnedMessages)}
      >
        <p>Pinned messages</p>
      </Button>
      {showPinnedMessages && (
          <PinnedMessagesList onUpdateMessage={onUpdateMessage} control={control} messages={messages}/>
      )}
    </div>
  );
};

export default DisplayPinned;
