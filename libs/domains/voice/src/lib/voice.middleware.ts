import { Middleware } from '@reduxjs/toolkit';
import {
  addRemoteStream,
  setAudioInputDevice,
  setConnectionState,
  setDevices,
  setLocalStream,
  setRemoteStreams,
  setServerPresence,
  setUserStreams,
  setVideoDevice
} from './voice.slice'
import { webrtcUrl } from '@beep/contracts'
import {Socket, Presence, Channel} from 'phoenix'


const WebRTCMiddleware: Middleware = (store) => {
  const pcConfig : RTCConfiguration = {
    iceServers: [{ urls: 'turn:162.38.112.211:33436?transport=udp', username: 'user-1', credential: 'pass-1'}],
    iceTransportPolicy: "relay",
  };
  let peerConnection: RTCPeerConnection | null = null;
  let socket: Socket = null;
  let watchedChannels: {id: string, channel: Channel}[] = []
  let currentChannel: Channel | undefined = undefined;
  let currentPresence: Presence | undefined = undefined;
  let localTracksAdded = false;
  let camTransceiver: RTCRtpTransceiver | undefined = undefined;
  let micTransceiver: RTCRtpTransceiver | undefined = undefined;
  let callback: ((value: string | PromiseLike<string>) => void) | null;
  let path: string;
  let offer
  let response
  let server_answer
  let remoteAnswer
  let audio: MediaStream | null;
  let video: MediaStream | null;
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
        socket = new Socket("wss://"+endpoint + "/socket/"+ action.payload.server)
        socket.connect()
        for (const channelId of action.payload.channels) {
          const socketChannel = socket.channel(`peer:signalling-${channelId}`, {
            id: action.payload.id,
            in: false
          })
          const presence = new Presence(socketChannel);
          presence.onSync(() => {
            const users = presence.list().map((user) => {
              if (!user.metas[0].user.watcher) {
                return {
                  id: user.metas[0].user.id,
                  username: user.metas[0].user.username,
                  expiresAt: 0,
                  userSn: "not used",
                  voiceMuted: ! user.metas[0].user.audio !== null,
                  muted: false,
                  camera: user.metas[0].user.video !== null                }
              }
            }).filter((user) => user !== undefined)
            store.dispatch(setServerPresence({
              channelId: channelId, users: users
            }))
          })
          socketChannel
            .join()
            .receive('ok', (_) => console.log('Joined currentChannel peer:signalling'))
            .receive('error', (resp) => {
              console.error('Unable to join the room:', resp);
              socket.disconnect();
              //TODO handle deconnection

              let innerText = 'Unable to join the room';
              if (resp === 'peer_limit_reached') {
                innerText +=
                  ': Peer limit reached. Try again in a few minutes';
              }

              store.dispatch(setConnectionState(innerText))
            });

          watchedChannels.push({id: channelId, channel: socketChannel})
        }
        break

      case 'INITIALIZE_WEBRTC':
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
          if (action.payload.audioInputDevice) store.dispatch(setAudioInputDevice(action.payload.audioInputDevice))
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
          store.dispatch(setLocalStream(video));
        }
        console.log("audio", audio)
        peerConnection = new RTCPeerConnection(pcConfig);

        peerConnection.onconnectionstatechange = () => {
          console.log("CONNECTION STATE CHANGE", peerConnection.connectionState);
          store.dispatch(setConnectionState(peerConnection?.connectionState || 'failed'))
          if (peerConnection.connectionState === 'failed') {
            peerConnection.restartIce();
          }
        }

        peerConnection.onicecandidateerror= (ev)=>{
          console.log(ev)
        }

        peerConnection.onicegatheringstatechange = (e) => {
          console.log(e)
        }

        peerConnection.onsignalingstatechange = (e) => {
          console.log(e)
        }

        peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          console.log('icecandidate', event);
          if (event.candidate == null) {
            console.log('Gathering candidates complete');
            return;
          }

          const candidate = JSON.stringify(event.candidate);
          console.log('Sending ICE candidate: ' + candidate);
          currentChannel.push('ice_candidate', { body: candidate });
        }

        peerConnection.ontrack = (event: RTCTrackEvent) => {
          const stream = event.transceiver
          store.dispatch(addRemoteStream(stream));
        };


        watchedChannels = watchedChannels.filter((channel) => {
          if (channel.id === action.payload.channel){
            channel.channel.leave()
            return false;
          }
          return true;
        })
        console.log("username", action.payload)
        currentChannel = socket.channel(`peer:signalling-${action.payload.channel}`, {id: action.payload.token, isVoiceMuted: action.payload.isVoiceMuted, isCamera: action.payload.isCamera, video: null, audio: null, in: true, username: action.payload.username});

        currentChannel.onError(() => {
          socket.disconnect();
          //window.location.reload();
        });
        currentChannel.onClose(() => {
          socket.disconnect();
          //window.location.reload();
        });

        currentChannel.on('sdp_offer', async (payload) => {
          const sdpOffer = payload.body;

          console.log('SDP offer received', payload);

          await peerConnection.setRemoteDescription({ type: 'offer', sdp: sdpOffer });

          if (!localTracksAdded) {
            console.log('Adding local tracks to peer connection');
            audio.getTracks().forEach((track) => peerConnection.addTrack(track))
            video.getTracks().forEach((track) => peerConnection.addTrack(track))
            localTracksAdded = true;
          }

          const sdpAnswer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(sdpAnswer);

          console.log('SDP offer applied, forwarding SDP answer', sdpAnswer);
          const answer = peerConnection.localDescription;
          currentChannel.push('sdp_answer', { body: answer?.sdp });
        });

        currentChannel.on('ice_candidate', (payload) => {
          const candidate = JSON.parse(payload.body);
          console.log('Received ICE candidate: ' + payload.body);
          peerConnection.addIceCandidate(candidate);
        });


        //TODO know why
        store.dispatch(setServerPresence({channelId: action.payload.channel, users: []}))
        currentPresence = new Presence(currentChannel);

        currentPresence.onSync(() => {
          const presence = []
          currentPresence.list().map((user) => {
            if (!user.metas[0].user.watcher){
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
          console.log("presence update", presence)

          store.dispatch(setUserStreams(presence))
          const users = []
          currentPresence.list().map((user) => {
            if(!user.metas[0].user.watcher){
              const outbounds = user.metas[0].user.outbounds
              console.log("outbounds outbounds",outbounds)
              if (!(outbounds && Object.keys(outbounds))){
                users.push({
                  id: outbounds.id,
                  username: outbounds.username,
                  expiresAt: 0,
                  userSn: "not used",
                  voiceMuted: false,
                  muted: false,
                  camera: true
                })
              }else if(outbounds){
                Object.keys(outbounds).map((inbound) => {
                  console.log(outbounds)
                  const inbounds = outbounds[inbound]
                  users.push({
                    id: inbounds.stream,
                    username: currentPresence.list().find(user => user.metas[0].user.id === inbounds.stream).username,
                    expiresAt: 0,
                    userSn: "not used",
                    voiceMuted: inbounds.audio !== null,
                    muted: false,
                    camera: ! inbounds.video !== null
                  })
                })
              }
            }
          })
          console.log("updated server Presence ", {
            channelId: action.payload.channel, users: users
          });
          store.dispatch(setServerPresence({
            channelId: action.payload.channel, users: users.filter((user)=> user.id !== undefined),
          }))
        });

        currentChannel
          .join()
          .receive('ok', (_) => console.log('Joined currentChannel peer:signalling'))
          .receive('error', (resp) => {
            console.error('Unable to join the room:', resp);
            socket.disconnect();
            //TODO handle deconnection

            let innerText = 'Unable to join the room';
            if (resp === 'peer_limit_reached') {
              innerText +=
                ': Peer limit reached. Try again in a few minutes';
            }

            store.dispatch(setConnectionState(innerText))
          });

        break;

      case 'HANDLE_REMOTE_OFFER':
        if (!peerConnection) return;
        await peerConnection.setRemoteDescription(action.payload);
        remoteAnswer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(remoteAnswer);
        // offerChannel?.send(JSON.stringify(remoteAnswer));
        break;

      case 'START_CAM':
        if (!peerConnection) break;
        try {
          if (camTransceiver) {
            video = await navigator.mediaDevices.getUserMedia({
              video: {
                width: 320,
                height: 240,
                deviceId: action.payload.deviceId,
              }
            })
            video.getTracks()[0].enabled = true;
            await camTransceiver?.sender.replaceTrack(video.getTracks()[0]);
            if (camTransceiver) {
              store.dispatch(setLocalStream(video));
            }
          } else {
            video = await navigator.mediaDevices.getUserMedia({
              video: {
                width: 320,
                height: 240,
                deviceId: action.payload.deviceId,
              }
            })
            camTransceiver = peerConnection?.addTransceiver(video.getTracks()[0], {
              direction: 'sendonly',
            });
            if (camTransceiver) {
              store.dispatch(setLocalStream(video));
            }
          }
          // await negotiate()
        } catch (error) { /* empty */ }
        break;

      case 'STOP_CAM':
        await camTransceiver?.sender?.replaceTrack(null);
        store.dispatch(setLocalStream(null));
        video?.getTracks().forEach((track) => { track.stop() });
        video = null
        break;

      case 'STOP_MIC':
        await micTransceiver?.sender?.replaceTrack(null);
        audio?.getTracks().forEach((track) => track.stop())
        audio = null
        break;

      case 'START_MIC':
        if (!peerConnection) break;
        try {
          if (micTransceiver) {
            audio = await navigator.mediaDevices.getUserMedia({
              audio: {
                deviceId: action.payload.deviceId,
              }
            })
            await micTransceiver?.sender.replaceTrack(audio.getTracks()[0]);
          } else {
            audio = await navigator.mediaDevices.getUserMedia({
              audio: {
                deviceId: action.payload.deviceId,
              }
            })
            micTransceiver = peerConnection?.addTransceiver(audio.getTracks()[0], {
              direction: 'sendonly',
            });
          }
          // await negotiate()
        } catch (error) { /* empty */ }
        break;

      case 'CLOSE_WEBRTC':
        await camTransceiver?.sender?.replaceTrack(null);
        camTransceiver?.stop()
        camTransceiver = undefined
        video?.getTracks().forEach((track) => { track.stop() });
        video = null
        await micTransceiver?.sender?.replaceTrack(null);
        micTransceiver?.stop()
        micTransceiver = undefined
        audio?.getTracks().forEach((track) => track.stop())
        audio = null
        peerConnection?.close()
        peerConnection = null;
        currentChannel.leave();
        store.dispatch(setRemoteStreams([]));
        store.dispatch(setLocalStream(null))
        break;

      default:
        break;
    }
    return next(action);
  };
};

export const webRTCMiddleware = WebRTCMiddleware;
