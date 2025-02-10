import { Middleware } from '@reduxjs/toolkit'
import {
  addRemoteStream,
  setConnectionState,
  setLocalStream,
  setRemoteStreams,
  setServerPresence,
  setUserStreams,
} from './voice.slice'
import { webrtcUrl } from '@beep/contracts'
import { Socket, Presence, Channel } from 'phoenix'

export const WebRTCMiddleware: Middleware = (store) => {
  let peerConnection: RTCPeerConnection | null = null
  const sockets: Map<string, Socket> = new Map<string, Socket>()
  let watchedChannels: { id: string; channel: Channel }[] = []
  let currentChannel: Channel | undefined = undefined
  let currentPresence: Presence | undefined = undefined
  let currentChannelId: string | undefined
  let id: string | undefined
  let camTransceiver: RTCRtpTransceiver | undefined = undefined
  let micTransceiver: RTCRtpTransceiver | undefined = undefined
  let audio: MediaStream | null
  let video: MediaStream | null
  const endpoint = webrtcUrl
  let socket = null
  let currentPresenceServerId = null
  let currentServerId = null
  const pcConfig: RTCConfiguration = endpoint.startsWith("wss") ? {
    iceServers: [{ urls: 'turn:162.38.112.211:33436?transport=udp', username: 'user-1', credential: 'pass-1'}],
    iceTransportPolicy: "relay",
  } : {};
  let channels = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next) => async (action: any) => {
    switch (action.type) {
      case 'INITIALIZE_PRESENCE':
        sockets.set(action.payload.server, new Socket(
          endpoint + '/socket/' + action.payload.server
        ))
        currentPresenceServerId = action.payload.server
        socket = sockets.get(action.payload.server)
        socket.connect()
        channels = action.payload.channels
        for (const channelId of action.payload.channels) {
          if (channelId === currentChannelId) {
            break
          }
          const socketChannel = socket.channel(`peer:signalling-${channelId}`, {
            id: action.payload.id,
            in: false,
          })
          const presence = new Presence(socketChannel)
          presence.onSync(() => {
            const users = presence
              .list()
              .map((user) => {
                if (!user.metas[0].user.watcher) {
                  return {
                    id: user.metas[0].user.id,
                    username: user.metas[0].user.username,
                    expiresAt: 0,
                    userSn: 'not used',
                    voiceMuted: user.metas[0].user.audio < 0,
                    screenSharing: false,
                    camera: user.metas[0].user.video > 0,
                  }
                }
              })
              .filter((user) => user !== undefined)
            store.dispatch(
              setServerPresence({
                channelId: channelId,
                users: users,
              })
            )
          })
          socketChannel
            .join()
            .receive('error', (resp) => {
              socket.disconnect()

              let innerText = 'Unable to join the room'
              if (resp === 'peer_limit_reached') {
                innerText += ': Peer limit reached. Try again in a few minutes'
              }

              store.dispatch(setConnectionState(innerText))
            })

          watchedChannels.push({ id: channelId, channel: socketChannel })
        }
        break

      case 'INITIALIZE_WEBRTC':
        if (currentChannelId === action.payload.channel) {
          break
        }
        currentServerId = currentPresenceServerId
        if (currentChannel) {
          try {
            camTransceiver?.stop()
            camTransceiver = undefined
            micTransceiver?.stop()
            micTransceiver = undefined
            video?.getTracks().forEach((track) => { track.stop() });
            video = null
            audio?.getTracks().forEach((track) => track.stop())
            audio = null
          } catch (e) { /* empty */ }
          currentChannel.leave()
          store.dispatch(setRemoteStreams([]))
          store.dispatch(setLocalStream(null))
          socket = sockets.get(currentServerId)
          for (const channel of channels) {
            if (channel === currentChannelId) {
              const socketChannel = socket.channel(
                `peer:signalling-${channel}`,
                {
                  id: id,
                  in: false,
                }
              )
              const presence = new Presence(socketChannel)
              presence.onSync(() => {
                const users = presence
                  .list()
                  .map((user) => {
                    if (!user.metas[0].user.watcher) {
                      return {
                        id: user.metas[0].user.id,
                        username: user.metas[0].user.username,
                        expiresAt: 0,
                        userSn: 'not used',
                        voiceMuted: user.metas[0].user.audio < 0,
                        screenSharing: false,
                        camera: user.metas[0].user.video > 0,
                      }
                    }
                  })
                  .filter((user) => user !== undefined)
                store.dispatch(
                  setServerPresence({
                    channelId: channel,
                    users: users,
                  })
                )
              })
              socketChannel
                .join()
                .receive('error', (resp) => {
                  socket.disconnect()

                  let innerText = 'Unable to join the room'
                  if (resp === 'peer_limit_reached') {
                    innerText += ': Peer limit reached. Try again in a few minutes'
                  }

                  store.dispatch(setConnectionState(innerText))
                })

              watchedChannels.push({ id: currentChannelId, channel: socketChannel })
            }
          }

          peerConnection?.close()
          peerConnection = null
          currentChannel = undefined
        }

        if (!action.payload.isVoiceMuted) {
          try {
            audio = await navigator.mediaDevices.getUserMedia({
              audio: {
                deviceId: action.payload.audioInputDevice.deviceId,
              },
            })
          } catch (e) {
            audio = null
          }
        }

        if (action.payload.isCamera) {
          try{
            video = await navigator.mediaDevices.getUserMedia({
              video: {
                deviceId: action.payload.videoDevice.deviceId,
              },
            })
            store.dispatch(setLocalStream(video))
          } catch (e) {
            video = null
          }
        }

        peerConnection = new RTCPeerConnection(pcConfig)

        peerConnection.onconnectionstatechange = () => {
          store.dispatch(
            setConnectionState(peerConnection?.connectionState || 'failed')
          )
          if (peerConnection.connectionState === 'failed') {
            peerConnection.restartIce()
          }
        }

        peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate == null) {
            return
          }

          const candidate = JSON.stringify(event.candidate)
          currentChannel.push('ice_candidate', { body: candidate })
        }

        peerConnection.ontrack = (event: RTCTrackEvent) => {
          const stream = event.transceiver
          store.dispatch(addRemoteStream(stream))
        }

        watchedChannels = watchedChannels.filter((channel) => {
          if (channel.id === action.payload.channel) {
            channel.channel.leave()
            return false
          }
          return true
        })
        currentChannel = socket.channel(
          `peer:signalling-${action.payload.channel}`,
          {
            id: action.payload.token,
            isVoiceMuted: action.payload.isVoiceMuted,
            isCamera: action.payload.isCamera,
            video: null,
            audio: null,
            in: true,
            username: action.payload.username,
          }
        )
        id = action.payload.token
        currentChannelId = action.payload.channel
        currentChannel.onError(() => {
          store.dispatch({
            type: 'INITIALIZE_WEBRTC',
            payload: {
              server: action.payload.server,
              channel: currentChannelId,
              token: action.payload.token,
              videoDevice: action.payload.videoDevice,
              audioInputDevice: action.payload.audioInputDevice,
              isVoiceMuted: action.payload.isVoiceMuted,
              isCamera: action.payload.isCamera,
              username: action.payload.username,
            },
          })
        })
        currentChannel.on('sdp_offer', async (payload) => {
          const sdpOffer = payload.body

          await peerConnection.setRemoteDescription({
            type: 'offer',
            sdp: sdpOffer,
          })

          if (camTransceiver == undefined && micTransceiver == undefined) {
            camTransceiver = peerConnection.getTransceivers()[0]
            micTransceiver = peerConnection.getTransceivers()[1]
          }

          if (video) {
            for (const track of video.getTracks()) {
              await camTransceiver.sender.replaceTrack(track)
              camTransceiver.direction = 'sendrecv'
            }
          } else {
            await camTransceiver.sender.replaceTrack(null)
            camTransceiver.direction = 'sendrecv'
          }
          if (audio) {
            for (const track of audio.getTracks()) {
              await micTransceiver.sender.replaceTrack(track)
              micTransceiver.direction = 'sendrecv'
            }
          } else {
            await micTransceiver.sender.replaceTrack(null)
            micTransceiver.direction = 'sendrecv'
          }

          const sdpAnswer = await peerConnection?.createAnswer()
          await peerConnection?.setLocalDescription(sdpAnswer)
          const answer = peerConnection?.localDescription
          currentChannel?.push('sdp_answer', { body: answer?.sdp })
        })

        currentChannel.on('ice_candidate', (payload) => {
          const candidate = JSON.parse(payload.body)
          peerConnection.addIceCandidate(candidate)
        })

        store.dispatch(
          setServerPresence({ channelId: action.payload.channel, users: [] })
        )
        currentPresence = new Presence(currentChannel)

        currentPresence.onSync(() => {
          const presence = []
          currentPresence.list().map((user) => {
            if (!user.metas[0].user.watcher) {
              if (user.metas[0].user.id === action.payload.token) {
                const outbounds = user.metas[0].user.outbounds
                if (outbounds) {
                  Object.keys(outbounds).map((inbound) => {
                    const inbounds = outbounds[inbound]
                    if (inbounds.stream !== action.payload.token) {
                      presence.push({
                        id: inbounds.stream,
                        channel: action.payload.channel,
                        video: inbounds.video,
                        audio: inbounds.audio,
                      })
                    }
                  })
                }
              }
            }
          })
          store.dispatch(setUserStreams(presence))

          const users = currentPresence
            .list()
            .map((user) => {
              if (!user.metas[0].user.watcher) {
                return {
                  id: user.metas[0].user.id,
                  username: user.metas[0].user.username,
                  expiresAt: 0,
                  userSn: 'not used',
                  voiceMuted: user.metas[0].user.audio < 0 ,
                  screenSharing: false,
                  camera: user.metas[0].user.video > 0,
                }
              }
            })
            .filter((user) => user !== undefined)
          store.dispatch(
            setServerPresence({
              channelId: action.payload.channel,
              users: users,
            })
          )
        })

        currentChannel
          .join().receive('ok', () => {
            setTimeout(() => {
              if (!video){
                currentChannel?.push('device_event', {
                  device: 'video',
                  event: !!video,
                  user_id: id,
                })
              }
              if (!audio){
                currentChannel?.push('device_event', {
                  device: 'audio',
                  event: !!audio,
                  user_id: id,
                })
              }
            }, 1000)
        })
          .receive('error', (resp) => {

            let innerText = 'Unable to join the room'
            if (resp === 'peer_limit_reached') {
              innerText += ': Peer limit reached. Try again in a few minutes'
            }

            store.dispatch(setConnectionState(innerText))
          })

        break

      case 'START_SCREEN':
        if (!peerConnection) break
        if (video === null) {
          currentChannel?.push('device_event', {
            device: 'video',
            event: true,
            user_id: id,
          })
        }
        video = await navigator.mediaDevices.getDisplayMedia({
          video: {
          },
        })
        await camTransceiver.sender.replaceTrack(video.getTracks()[0])
        store.dispatch(setLocalStream(video))
        break

      case 'STOP_SCREEN':
        if (!peerConnection) break
        if (video !== null) {
          currentChannel?.push('device_event', {
            device: 'video',
            event: false,
            user_id: id,
          })
        }
        await camTransceiver.sender.replaceTrack(null)
        video.getTracks().forEach((track) => track.stop())
        video = null
        store.dispatch(setLocalStream(null))
        break

      case 'START_CAM':
        if (!peerConnection) break
        if (video === null) {
          currentChannel?.push('device_event', {
            device: 'video',
            event: true,
            user_id: id,
          })
        }
        video = await navigator.mediaDevices.getUserMedia({
              video: {
                deviceId: action.payload.deviceId,
              },
            })
        await camTransceiver.sender.replaceTrack(video.getTracks()[0])
        store.dispatch(setLocalStream(video))
        break

      case 'STOP_CAM':
        if (!peerConnection) break
        await camTransceiver.sender.replaceTrack(null)
        video.getTracks().forEach((track) => track.stop())
        video = null
        // store.dispatch(setLocalStream(null))
        currentChannel?.push('device_event', {
          device: 'video',
          event: false,
          user_id: id,
        })
        break

      case 'STOP_MIC':
        if (!peerConnection) break
        await micTransceiver.sender.replaceTrack(null)
        audio.getTracks().forEach((track) => track.stop())
        audio = null
        currentChannel?.push('device_event', {
          device: 'audio',
          event: false,
          user_id: id,
        })
        break

      case 'START_MIC':
        if (!peerConnection) break
        audio = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: action.payload.deviceId,
          },
        })
        currentChannel?.push('device_event', {
          device: 'audio',
          event: true,
          user_id: id,
        })
        await micTransceiver.sender.replaceTrack(audio.getTracks()[0])
        break

      case 'CLOSE_WEBRTC':
        try {
          camTransceiver?.stop()
          camTransceiver = undefined
          micTransceiver?.stop()
          micTransceiver = undefined
          video?.getTracks().forEach((track) => { track.stop() });
          video = null
          audio?.getTracks().forEach((track) => track.stop())
          audio = null
        } catch (e) { /* empty */ }
        currentChannel.leave()
        store.dispatch(setRemoteStreams([]))
        store.dispatch(setLocalStream(null))
        socket = sockets.get(currentServerId)
        for (const channel of channels) {
          if (channel === currentChannelId) {
            const socketChannel = socket.channel(
              `peer:signalling-${channel}`,
              {
                id: id,
                in: false,
              }
            )
            const presence = new Presence(socketChannel)
            presence.onSync(() => {
              const users = presence
                .list()
                .map((user) => {
                  if (!user.metas[0].user.watcher) {
                    return {
                      id: user.metas[0].user.id,
                      username: user.metas[0].user.username,
                      expiresAt: 0,
                      userSn: 'not used',
                      voiceMuted: user.metas[0].user.audio < 0,
                      screenSharing: false,
                      camera: user.metas[0].user.video > 0,
                    }
                  }
                })
                .filter((user) => user !== undefined)
              store.dispatch(
                setServerPresence({
                  channelId: channel,
                  users: users,
                })
              )
            })
            socketChannel
              .join()
              .receive('error', (resp) => {
                socket.disconnect()

                let innerText = 'Unable to join the room'
                if (resp === 'peer_limit_reached') {
                  innerText += ': Peer limit reached. Try again in a few minutes'
                }

                store.dispatch(setConnectionState(innerText))
              })

            watchedChannels.push({ id: currentChannelId, channel: socketChannel })
          }
        }

        peerConnection?.close()
        peerConnection = null
        currentChannel = undefined
        currentChannelId = undefined
        break

      default:
        break
    }
    return next(action)
  }
}

export const webRTCMiddleware = WebRTCMiddleware

