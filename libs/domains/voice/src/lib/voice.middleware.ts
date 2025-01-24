import { Middleware } from '@reduxjs/toolkit'
import {
  addRemoteStream,
  setAudioInputDevice,
  setConnectionState,
  setDevices,
  setLocalStream,
  setRemoteStreams,
  setServerPresence,
  setUserStreams,
  setVideoDevice,
} from './voice.slice'
import { webrtcUrl } from '@beep/contracts'
import { Socket, Presence, Channel } from 'phoenix'
import { channel } from 'diagnostics_channel'

const WebRTCMiddleware: Middleware = (store) => {
  const pcConfig: RTCConfiguration = {}
  let peerConnection: RTCPeerConnection | null = null
  let socket: Socket = null
  let watchedChannels: { id: string; channel: Channel }[] = []
  let currentChannel: Channel | undefined = undefined
  let currentPresence: Presence | undefined = undefined
  let currentChannelId: string | undefined
  let id: string | undefined
  let camSender: RTCRtpSender | undefined = undefined
  let micSender: RTCRtpSender | undefined = undefined
  let callback: ((value: string | PromiseLike<string>) => void) | null
  let path: string
  let offer
  let response
  let server_answer
  let remoteAnswer
  let audio: MediaStream | null
  let video: MediaStream | null
  const endpoint = webrtcUrl
  // async function negotiate() {
  //   if (!peerConnection) return;
  //   const negotiate_offer = await peerConnection.createOffer()
  //   await peerConnection.setLocalDescription(negotiate_offer);
  //   offerChannel?.send(JSON.stringify(negotiate_offer));
  //   const json = (await new Promise((resolve) => {
  //     callback = resolve;
  //   })) as string;
  //   const negotiate_answer = JSON.parse(json);
  //   await peerConnection.setRemoteDescription(negotiate_answer);
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next) => async (action: any) => {
    switch (action.type) {
      case 'INITIALIZE_PRESENCE':
        console.log('action', action)
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
            console.log('presence update ', presence.list())
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
                    muted: false,
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
            .receive('ok', (_) =>
              console.log('Joined currentChannel peer:signalling')
            )
            .receive('error', (resp) => {
              console.error('Unable to join the room:', resp)
              socket.disconnect()
              //TODO handle deconnection

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
          console.log('Leaving to reconnect')
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
            console.log('presence update ', presence.list())
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
                    muted: false,
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
            .receive('ok', (_) =>
              console.log('Joined currentChannel peer:signalling')
            )
            .receive('error', (resp) => {
              console.error('Unable to join the room:', resp)
              socket.disconnect()
              //TODO handle deconnection

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

        console.log('action.payload.videoDevice', action.payload.videoDevice)
        if (action.payload.videoDevice == null) {
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          })
          const devicesIn = await navigator.mediaDevices.enumerateDevices()
          action.payload.audioInputDevice =
            devicesIn.find((device) => device.kind === 'audioinput') || null
          action.payload.videoDevice =
            devicesIn.find((device) => device.kind === 'videoinput') || null
          store.dispatch(setDevices(devicesIn))
          if (action.payload.audioInputDevice)
            store.dispatch(setAudioInputDevice(action.payload.audioInputDevice))
          if (action.payload.videoDevice)
            store.dispatch(setVideoDevice(action.payload.videoDevice))
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
        console.log('audio', audio)
        peerConnection = new RTCPeerConnection(pcConfig)

        peerConnection.onconnectionstatechange = () => {
          console.log('CONNECTION STATE CHANGE', peerConnection.connectionState)
          store.dispatch(
            setConnectionState(peerConnection?.connectionState || 'failed')
          )
          if (peerConnection.connectionState === 'failed') {
            peerConnection.restartIce()
          }
        }

        peerConnection.onicecandidateerror = (ev) => {
          console.log(ev)
        }

        peerConnection.onicegatheringstatechange = (e) => {
          console.log(e)
        }

        peerConnection.onsignalingstatechange = (e) => {
          console.log(e)
        }

        peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          console.log('icecandidate', event)
          if (event.candidate == null) {
            console.log('Gathering candidates complete')
            return
          }

          const candidate = JSON.stringify(event.candidate)
          console.log('Sending ICE candidate: ' + candidate)
          currentChannel.push('ice_candidate', { body: candidate })
        }

        peerConnection.ontrack = (event: RTCTrackEvent) => {
          console.log('ontrack', event)
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
        console.log('username', action.payload)
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
          console.error('Error in currentChannel peer:signalling')
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
          //window.location.reload();
        })
        // currentChannel.on('device_event', (payload) => {
        //   console.log('device_event', payload)
        //   // store.dispatch(
        //   //   setServerPresence({
        //   //     channelId: action.payload.channel,
        //   //     users: [
        //   //       {
        //   //         id: payload.user_id,
        //   //         username: 'unknown',
        //   //         expiresAt: 0,
        //   //         userSn: 'not used',
        //   //         voiceMuted: false,
        //   //         muted: false,
        //   //         camera: payload.camera_on,
        //   //       },
        //   //     ],
        //   //   })
        //   // )
        // })
        currentChannel.on('sdp_offer', async (payload) => {
          const sdpOffer = payload.body

          console.log('SDP offer received', payload)

          await peerConnection.setRemoteDescription({
            type: 'offer',
            sdp: sdpOffer,
          })

          if (video !== null) {
            console.log('Adding local video tracks to peer connection')
            video.getTracks().forEach((track) => {
              if (!peerConnection.getSenders().some(sender => sender.track === track)) {
                camSender = peerConnection.addTrack(track)
              }
            })
          }
          if (audio !== null) {
            console.log('Adding local audio tracks to peer connection')
            audio.getTracks().forEach((track) => {
              if (!peerConnection.getSenders().some(sender => sender.track === track)) {
                micSender = peerConnection.addTrack(track)
              }
            })
          }

          const sdpAnswer = await peerConnection?.createAnswer()
          await peerConnection?.setLocalDescription(sdpAnswer)

          console.log('SDP offer applied, forwarding SDP answer', sdpAnswer)
          const answer = peerConnection?.localDescription
          currentChannel?.push('sdp_answer', { body: answer?.sdp })
        })

        currentChannel.on('ice_candidate', (payload) => {
          const candidate = JSON.parse(payload.body)
          console.log('Received ICE candidate: ' + payload.body)
          peerConnection.addIceCandidate(candidate)
        })

        //TODO know why
        store.dispatch(
          setServerPresence({ channelId: action.payload.channel, users: [] })
        )
        currentPresence = new Presence(currentChannel)

        currentPresence.onSync(() => {
          const presence = []
          currentPresence.list().map((user) => {
            if (!user.metas[0].user.watcher) {
              console.log('user meta', user.metas)
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
          console.log('presence', presence)
          // presence.map((user) => {
          //   if (user.video == null) {
          //     video = null
          //   }
          // })
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
                  muted: false,
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
          .receive('ok', (_) =>
            console.log('Joined currentChannel peer:signalling')
          )
          .receive('error', (resp) => {
            console.error('Unable to join the room:', resp)
            socket.disconnect()
            //TODO handle deconnection

            let innerText = 'Unable to join the room'
            if (resp === 'peer_limit_reached') {
              innerText += ': Peer limit reached. Try again in a few minutes'
            }

            store.dispatch(setConnectionState(innerText))
          })

        break

      case 'HANDLE_REMOTE_OFFER':
        if (!peerConnection) return
        await peerConnection.setRemoteDescription(action.payload)
        remoteAnswer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(remoteAnswer)
        // offerChannel?.send(JSON.stringify(remoteAnswer));
        break

      case 'START_CAM':
        if (!peerConnection) break
        try {
          if (camSender) {
            video = await navigator.mediaDevices.getUserMedia({
              video: {
                width: 320,
                height: 240,
                deviceId: action.payload.deviceId,
              },
            })
            video.getTracks()[0].enabled = true
            currentChannel?.push('device_event', {
              user_id: id,
              device: 'video',
              event: true,
            })
            console.log('Replacing local video tracks to peer connection: ', video)
            camSender.replaceTrack(video.getTracks()[0])
          } else {
            video = await navigator.mediaDevices.getUserMedia({
              video: {
                width: 320,
                height: 240,
                deviceId: action.payload.deviceId,
              },
            })
            console.log('Adding local video tracks to peer connection: ', video)
            camSender = peerConnection.addTrack(video.getTracks()[0])
            peerConnection.getTransceivers().forEach((transceiver) => {
              transceiver.direction = 'sendrecv'
            })
          }
          store.dispatch(setLocalStream(video))
          // currentChannel?.push('sdp_offer', { body: null })

        } catch (error) {
          console.error('Error starting camera:', error)
        }
        break

      case 'STOP_CAM':
        console.log('SENDERS', peerConnection.getSenders())
        store.dispatch(setLocalStream(null))
        video?.getTracks().forEach((track) => {
          track.stop()
        })

        peerConnection.removeTrack(camSender)
        // camSender.track.stop()
        video = null
        currentChannel?.push('device_event', {
          device: 'video',
          event: false,
          user_id: id
        })
        console.log("SENDERS",peerConnection.getSenders())
        // currentChannel?.push('sdp_offer', { body: null })
        // await camSender?.replaceTrack(null)
        // peerConnection?.getTransceivers().forEach((transceiver) => {
        //   if (transceiver.sender.track === null) {
        //     peerConnection.removeTrack(transceiver.sender)
        //     transceiver.stop()
        //   }
        // })
        break

      case 'STOP_MIC':
        await micSender?.replaceTrack(null)
        audio?.getTracks().forEach((track) => track.stop())
        audio = null
        break

      case 'START_MIC':
        if (!peerConnection) break
        try {
          if (micSender) {
            audio = await navigator.mediaDevices.getUserMedia({
              audio: {
                deviceId: action.payload.deviceId,
              },
            })
            await micSender?.replaceTrack(audio.getTracks()[0])
          } else {
            audio = await navigator.mediaDevices.getUserMedia({
              audio: {
                deviceId: action.payload.deviceId,
              },
            })
            micSender = peerConnection.addTrack(audio.getTracks()[0])
          }
          // await negotiate()
        } catch (error) {
          /* empty */
        }
        break

      case 'CLOSE_WEBRTC':
        // await camTransceiver?.sender?.replaceTrack(null);
        // camTransceiver?.stop()
        // camTransceiver = undefined
        // video?.getTracks().forEach((track) => { track.stop() });
        // video = null
        // await micTransceiver?.sender?.replaceTrack(null);
        // micTransceiver?.stop()
        // micTransceiver = undefined
        // audio?.getTracks().forEach((track) => track.stop())
        // audio = null
        currentChannel.leave()
        store.dispatch(setRemoteStreams([]))
        store.dispatch(setLocalStream(null))
        const socketChannel = socket.channel(
          `peer:signalling-${currentChannelId}`,
          {
            id: id,
            in: false,
          }
        )
        const presence = new Presence(socketChannel)
        presence.onSync(() => {
          console.log('presence update ', presence.list())
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
                  muted: false,
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
          .receive('ok', (_) =>
            console.log('Joined currentChannel peer:signalling')
          )
          .receive('error', (resp) => {
            console.error('Unable to join the room:', resp)
            socket.disconnect()
            //TODO handle deconnection

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
