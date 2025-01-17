# Front

(file)

1. [Trello Front](https://trello.com/invite/b/VV5c6znJ/ATTI791d6c78e353dfba56a89b25abf45379A1532A43/beep-front)
2. [Trello composant](https://trello.com/invite/b/eDPWKHlE/ATTI5d798f2d27160f95ff948e5059cc99f569849308/beep-composants)
3. [Documentation Notion](https://www.notion.so/Beep-4f3dd311e08a4de38fc1c901bef44322)

Forget `npm` we will use `pnpm`. Install:

```bash
sudo npm install -g pnpm
```

Install packages:

```sh
pnpm install
```

Launch frontend:

```sh
pnpm run start
```

## Configuration

Make sure that you provided a `.env` file with the following content:

```env
VITE_BACKEND_URL=
VITE_WEBRTC_URL=
```

For example (suitable for local development):

```env
VITE_BACKEND_URL=http://localhost:3333/
VITE_WEBRTC_URL=http://127.0.0.1:8080
```

## Docker

Build locally for debug:

```sh
pnpm run build:docker
```

(Can be really long)

Run the built image:

```sh
pnpm run start:docker
```

## Quality

Testing:

```bash
pnpm run lint
```

Linting:

```bash
pnpm run test
```

## Documentation Message

The idea to lighten the message fetching was to virtualize the list.
This will let us easily add message coming from different sources. For example, messages coming from SSE and also local messages.

Some expected behavior:
- When opening a channel the messages will be refetch
- When a message is sent from local client it instantly displayed as loading while the request complete
- Display real time updates of messages in the channel  without refetching all messages of the 

To handle this we use a Redux slice for messages (in ``message.slice.ts``)

```ts
export interface MessageState {
  channels_messages: { [id: string]: MessageEntity[] };
}
```

If you look at it looks like a HashMap. So why not using it ? Redux does not handle it well.

## Handling local messages

When a message is sent from the local client we use a FormData in order to handle the file transfer. Therefore it is not a simple MessageEntity type. That is why we implemented a dedicated reducer :

```ts
send(state, { payload }: { payload: SendMessageForm })
```

With the type :

```ts
export interface SendMessageForm {
  channelId: string
  message: string
  replyTo: MessageEntity | null
  files: File[]
  userId: string
}
```

This will be treated to be sent to server and also to be instantly displayed on the screen.
As the message list took as props ``MessageEntity[]``, we did add this:

```ts
export interface MessageEntity {
  // Other properties

  // If the message sent by the current client this should be true
  // Else the field is undefined when it come from the server
  isSentByCurrentClient?: boolean

  // If the message come from the local we store the request
  request?: CreateMessageRequest
}
```

This will be treated by the message-feature.tsx component. It will make a request to server, and while it is loading the message will be displayed as loading.

## Re-fetch when channel open

We choosed to refetch all messages of the channel when it is re-opened to get most fresh state even if it is updated in real time.

For that we use:
```ts
    syncRemoteState(state, { payload }: {
      payload: MessageEntity[]
    })
```

It will simply replace the old message list of the channel by the given payload.
This state is updated directly by the RTK cache by listening to it. To do that we can register a hook that listen to the cache directly on the endpoint ``getMessagesByChannelId`` (in ``channel.api.ts``):

```ts
 async onCacheEntryAdded(arg,{ cacheDataLoaded, dispatch }) {
        const { data } = await cacheDataLoaded;
        dispatch(messageActions.syncRemoteState(data));
}
```

## Real time

In order to handle sse messages coming from the sse channel ``channels/${channelId}/messages`` we created 3 reducers to that will react to different signals.
Those signals are typed like this:

```ts
export enum ActionSignalMessage {
  create = "create",
  update = "update",
  delete = "delete",
}

export interface SignalMessage {
  action: ActionSignalMessage
  message: MessageEntity
}
```

In order to treat that we register reducers in the callback of the transmit subscribe method:

```ts
 TransmitSingleton.subscribe(`channels/${channelId}/messages`, (data) => {
      const signal: SignalMessage = JSON.parse(data)
      switch (signal.action) {
        case ActionSignalMessage.create:
          dispatch(messageActions.create(signal.message))
          break
        case ActionSignalMessage.update:
          dispatch(messageActions.update(signal.message))
          break
        case ActionSignalMessage.delete:
          dispatch(messageActions.delete(signal.message))
          break
        default:
          break
      }
```


