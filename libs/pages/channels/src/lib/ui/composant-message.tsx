import { DateTime } from 'luxon';
import {Avatar} from "@beep/ui";
import {MessageEntity} from "@beep/contracts";

type MessageProps = {
  message: MessageEntity;
};

export default function ComposantMessage({ message }: MessageProps) {
  const date = DateTime.fromISO(message.createdAt);

  const dateText = date.hasSame(DateTime.now(), 'day')
    ? date.toFormat('HH:mm')
    : date.toFormat('f');

  return (
    <div className="">
      <div className="flex items-center m-2">
        <Avatar username={message.owner?.username || ''}  />

        <div className="flex">
          <p className="px-8 font-semibold">{message.owner?.username}</p>
          <p className="text-align-left">{dateText}</p>
        </div>
      </div>
      <div className="bg-white rounded-tr-lg rounded-br-lg rounded-bl-lg py-5 px-8 m-2 break-words w-fit">
        <p>{message.content}</p>
      </div>
    </div>
  );
}
