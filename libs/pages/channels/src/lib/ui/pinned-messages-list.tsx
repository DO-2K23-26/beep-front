import React from 'react';
import MessageFeature from '../feature/message-feature';
import { MessageEntity } from '@beep/contracts';

interface PinnedMessagesListProps {
  onUpdateMessage: (messageId: string) => void;
  control: any; 
  messages: MessageEntity[];
}

const PinnedMessagesList: React.FC<PinnedMessagesListProps> = ({messages, onUpdateMessage, control }) => {

  return (
    <div className="flex absolute flex-col-reverse gap-6 overflow-y-scroll no-scrollbar scroll-smooth bg-violet-400 rounded-xl h-80">
        {messages  &&
        messages
          .slice()
          .map((message) => (
            <MessageFeature
              key={message.id}
              user={message.owner}
              onUpdateMessage={onUpdateMessage}
              createdAt={message.createdAt || ''}
              message={message}
              control={control}
              isPinned={true}
            />
          ))}
    </div>
  );
};

export default PinnedMessagesList;
