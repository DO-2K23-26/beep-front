import { useSelector } from 'react-redux'
import { getUserState } from '@beep/user';
import { useFetchAttachmentImageQuery } from '@beep/channel';
import { Attachment } from '@beep/contracts';
import { useEffect, useState } from 'react';

interface AttachmentFeatureProps {
  attachment: Attachment,
  key: number
}

export default function AttachmentFeature({ attachment }: AttachmentFeatureProps) {
  const { tokens, isLoading, isAuthenticated, payload } = useSelector(getUserState)

  const blob = useFetchAttachmentImageQuery(attachment.id).currentData;
  const name  = attachment.name.split('/').slice(-1);
  if (attachment.contentType.includes('image')) {
    console.log('Attachment', attachment);
    return (
      <img
        src={blob}
        alt={`Attachment`}
        style={{ maxWidth: '200px', maxHeight: '200px' }}
      />
    );
  }

  if (attachment.contentType.includes('video')) {
    return (
      <video
        src={blob}
        type={attachment.contentType}
        controls
        style={{ maxWidth: '200px', maxHeight: '200px' }}
      >
        Votre navigateur ne permet pas de visualiser la vidéo.
      </video>
    );
  }

  if (attachment.contentType.includes('audio')) {
    return (
      <audio
        src={blob}
        type={attachment.contentType}
        controls
      >
        Votre navigateur ne permet pas de lire l'audio.
      </audio>
    );
  }
  if (attachment.contentType.includes('application/pdf')) {
    return (
      <div className="flex">
        {/*<img*/}
        {/*  src={pdf}*/}
        {/*  alt="PDF Icon"*/}
        {/*  style={{ width: '50px', height: '50px' }}*/}
        {/*  className='m-2'*/}

        {/*/>*/}
        <a
          href={blob}
          download={name}
          style={{ display: 'block', marginTop: '10px', }}
          className='underline'

        >
          {name}
        </a>
      </div>
    );
  }

  if (attachment.contentType.includes('text')) {
    return (
      <div className="flex">
        {/*<img*/}
        {/*  src={text}*/}
        {/*  alt="Text File Icon"*/}
        {/*  style={{ width: '50px', height: '50px' }}*/}
        {/*  className='m-2'*/}
        {/*/>*/}
        <div>{name}</div>
        <a
          href={blob}
          download={name}
          style={{ display: 'block', marginTop: '10px' }}
          className='underline'
        >
          Télécharger Texte
        </a>
      </div>
    );
  }

  // Pour les autres types de fichiers
  return (
    <div
      className="flex align-middle m-2"
    >
      {/*<DocumentArrowDownIcon className="h-[50px] w-[50px]"/>*/}
      <a
        href={blob}
        download={name}
        target="_blank" rel="noopener noreferrer"
        className='underline'
      >
        {name}
      </a>
    </div>
  );

}
