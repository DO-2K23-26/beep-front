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

const WebRTCMiddleware: Middleware = (store) => {
  const pcConfig: RTCConfiguration = {}
  let peerConnection: RTCPeerConnection | null = null
  let socket: Socket = null
  let watchedChannels: { id: string; channel: Channel }[] = []
  let currentChannel: Channel | undefined = undefined
  let currentPresence: Presence | undefined = undefined
  let currentChannelId: string | undefined
  let id: string | undefined
  let camTransceiver: RTCRtpTransceiver | undefined = undefined
  let micTransceiver: RTCRtpTransceiver | undefined = undefined
  let remoteAnswer: RTCLocalSessionDescriptionInit
  let audio: MediaStream | null
  let video: MediaStream | null
  const endpoint = webrtcUrl

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next) => async (action: any) => {
    switch (action.type) {
      case 'INITIALIZE_PRESENCE':
        socket = new Socket(
          'ws://' + endpoint + '/socket/' + action.payload.server
        )
        socket.connect()
        for (const channelId of action.payload.channels) {
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
                    voiceMuted: user.metas[0].user.audio !== undefined,
                    screenSharing: false,
                    camera: user.metas[0].user.video !== null,
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
        if (currentChannel) {
          currentChannel.leave()
          store.dispatch(setRemoteStreams([]))
          const socketChannel = socket.channel(
            `peer:signalling-${currentChannelId}`,
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
                    voiceMuted: user.metas[0].user.audio !== undefined,
                    screenSharing: false,
                    camera: user.metas[0].user.video !== null,
                  }
                }
              })
              .filter((user) => user !== undefined)
            store.dispatch(
              setServerPresence({
                channelId: currentChannelId,
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
          peerConnection?.close()
          peerConnection = null
        }

        if (!action.payload.isVoiceMuted) {
          audio = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: action.payload.audioInputDevice.deviceId,
            },
          })
        }

        if (action.payload.isCamera) {
          video = await navigator.mediaDevices.getUserMedia({
            video: {
              width: 320,
              height: 240,
              deviceId: action.payload.videoDevice.deviceId,
            },
          })
          store.dispatch(setLocalStream(video))
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

          if (video !== null) {
            video.getTracks().forEach((track) => {
              camTransceiver.sender.replaceTrack(track)
              camTransceiver.direction = 'sendrecv'
            })
          }
          if (audio !== null) {
            audio.getTracks().forEach((track) => {
              micTransceiver.sender.replaceTrack(track)
              micTransceiver.direction = 'sendrecv'
            })
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
                  voiceMuted: user.metas[0].user.audio !== undefined,
                  screenSharing: false,
                  camera: user.metas[0].user.video !== null,
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
          .join()
          .receive('error', (resp) => {
            socket.disconnect()

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
            width: 320,
            height: 240,
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
                width: 320,
                height: 240,
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
        store.dispatch(setLocalStream(null))
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
        camTransceiver?.stop()
        camTransceiver = undefined
        micTransceiver?.stop()
        micTransceiver = undefined
        video?.getTracks().forEach((track) => { track.stop() });
        video = null
        audio?.getTracks().forEach((track) => track.stop())
        audio = null
        currentChannel.leave()
        store.dispatch(setRemoteStreams([]))
        store.dispatch(setLocalStream(null))
        // eslint-disable-next-line no-case-declarations
        const socketChannel = socket.channel(
          `peer:signalling-${currentChannelId}`,
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
                  voiceMuted: user.metas[0].user.audio !== undefined,
                  screenSharing: false,
                  camera: user.metas[0].user.video !== null,
                }
              }
            })
            .filter((user) => user !== undefined)
          store.dispatch(
            setServerPresence({
              channelId: currentChannelId,
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
        peerConnection?.close()
        peerConnection = null
        break

      default:
        break
    }
    return next(action)
  }
}

export const webRTCMiddleware = WebRTCMiddleware
