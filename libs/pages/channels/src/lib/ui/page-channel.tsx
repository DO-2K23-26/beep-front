import { MessageEntity } from "@beep/contracts";
import { Icon } from "@beep/ui";
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ComposantMessage from './composant-message';

export type MessageFormValues = {
  content: string;
  files: FileList | null;
}

export interface PageChannelProps {
  channelId: string
  messages?: MessageEntity[]
  sendMessage: (data: MessageFormValues) => void
}

export const PageChannel = (props: PageChannelProps) => {
  const { messages, sendMessage } = props;
  const { register, handleSubmit, reset } = useForm<MessageFormValues>();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleSend: SubmitHandler<MessageFormValues> = (data) => {
    console.log('sending message', data);
    if (data.content === '' && !selectedFiles?.length) {
      return;
    } else if (data.content === '' ) {
      data.content = ' ';
    }
    data.files = selectedFiles;
    console.log('sending message', data);
    sendMessage(data);
    reset(); // Reset form
    setSelectedFiles(null); // Reset selected files
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  }

  return (
    <div className="flex flex-col h-screen items-stretch">
      {/* Existing code for header and message list... */}
      {/* entete de la page avec le nom du salon et un bouton epingle pour afficher les messages epinglés */}
      <div className="p-2 flex items-center justify-between">
        <h1 className="text-black bg-purple rounded-lg p-2 ">Salon</h1>{' '}
        {/*{channel.name} */}
        <button className=" text-black p-2 rounded-lg bg-darkpurple flex">
          <Icon name="ic:round-push-pin" /> <p> Pinned messages</p>
        </button>
      </div>

      <div className="overflow-y-auto h-screen">
        {/* liste des messages avec une scrollbar . Chaque message est affiché avec le nom de l'utilisateur et sa photo de profil, la date ety heure et le contenu du message */}
        {messages?.map((message: MessageEntity, i) => (
          <ComposantMessage key={i} message={message} />
        ))}
      </div>

      {/* barre pour ecrire un message avec une icon fleche pour envoyer le message et une icon plus pour ajouter une fichier, photo ou
      {/* Message input bar */}
      <form
        onSubmit={handleSubmit(handleSend)}
        method="post"
        className="flex mt-auto"
      >
        <div className="grow mr-2 ml-1">
          <input
            id="content"
            type="text"
            placeholder="Type message..."
            className="bg-white text-black p-2 rounded-lg w-full mx-1"
            {...register('content')}
          />
        </div>
        <div>
          <button
            className="bg-white text-black p-2 rounded-lg mx-1"
            type="submit"
          >
            tt
          </button>
          <input
            className="bg-white text-black p-2 rounded-lg mx-1"
            id="files"
            type="file"
            multiple
            {...(register('files'),
              { required: false, onChange: handleFileChange })}
          />
        </div>
      </form>
    </div>
  );
};
