import { Attachment, CreateMessageRequest, MessageEntity, SendMessageForm } from "@beep/contracts";

export const sortMessagesByCreation = (messages: MessageEntity[]) => {
  return messages
    //Keep only messages with createdAt or isSentByCurrentClient = true
    .filter((message: MessageEntity) => message.createdAt ?? message.isSentByCurrentClient)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
}

// Construct a FormData to send the message to the api
export const toFormData = (messageForm: SendMessageForm) => {
  const formData: FormData = new FormData()
  // Content
  formData.set(
    'content',
    messageForm.message === '' || messageForm.message === undefined ? ' ' : messageForm.message
  )

  // Files
  if (messageForm.files.length > 0) {
    formData.set('attachments', JSON.stringify([]))
    messageForm.files.forEach((file, i) => {
      formData.append(`attachments[${i}]`, file)
    })
  }

  // Reply to
  formData.set('parentMessageId', messageForm.replyTo?.id ?? '')

  return {
    body: formData,
    channelId: messageForm.channelId,
  } as CreateMessageRequest
}

export const toMessage = (messageForm: SendMessageForm, req: CreateMessageRequest): MessageEntity => {
  const date = new Date().toISOString();
  const randomId = Math.floor(100000 + Math.random() * 900000).toString();
  const attachments: Attachment[] = messageForm.files.map((file, i) => ({
    url: '',
    contentType: file.type,
    name: file.name,
    id: 'temp-id' + randomId + i,
    createdAt: date,
    updatedAt: date
  }))
  const message: MessageEntity = {
    id: 'temp-id' + randomId,
    content: messageForm.message,
    attachments: attachments,
    createdAt: date,
    isSentByCurrentClient: true,
    parentMessageId: messageForm.replyTo?.id,
    channelId: messageForm.channelId,
    ownerId: messageForm.userId,
    pinned: false,
    request: req
  }
  return message
}
