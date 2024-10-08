import { Middleware } from '@reduxjs/toolkit';
import { addRemoteStream, setConnectionState, setLocalStream, setRemoteStreams } from './voice.slice';
import { webrtcUrl } from '@beep/contracts';

const WebRTCMiddleware: Middleware = (store) => {
  let peerConnection: RTCPeerConnection | null = null;
  let offerChannel: RTCDataChannel | null = null;
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
  async function negotiate() {
    if (!peerConnection) return;
    const negotiate_offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(negotiate_offer);
    offerChannel?.send(JSON.stringify(negotiate_offer));
    const json = (await new Promise((resolve) => {
      callback = resolve;
    })) as string;
    const negotiate_answer = JSON.parse(json);
    await peerConnection.setRemoteDescription(negotiate_answer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next) => async (action: any) => {
    switch (action.type) {
      case 'INITIALIZE_WEBRTC':
        path = endpoint + "/offer/" + action.payload.token.data.token;
        peerConnection = new RTCPeerConnection();

        peerConnection.onconnectionstatechange = () => {
          store.dispatch(setConnectionState(peerConnection?.connectionState || 'failed'))
        }

        peerConnection.ontrack = (event: RTCTrackEvent) => {
          const stream = event.transceiver
          store.dispatch(addRemoteStream(stream));
        };

        offerChannel = peerConnection.createDataChannel('offer/answer');
        offerChannel.onopen = async () => {
          setTimeout(async () => {
            if (!action.payload.isVoiceMuted) {
              audio = await navigator.mediaDevices.getUserMedia({
                audio: {
                  deviceId: action.payload.audioInputDevice.deviceId,
                }
              })
              micTransceiver = peerConnection?.addTransceiver(audio.getTracks()[0], {
                direction: 'sendonly',
              });
            }
            if (action.payload.isCamera) {
              video = await navigator.mediaDevices.getUserMedia({
                video: {
                  width: 320,
                  height: 240,
                  deviceId: action.payload.videoDevice.deviceId,
                }
              })
              camTransceiver = peerConnection?.addTransceiver(video.getTracks()[0], {
                direction: 'sendonly',
              });
              if (camTransceiver) {
                store.dispatch(setLocalStream(video));
              }
            }
            await negotiate()
          }, 1000)
        };

        offerChannel.onmessage = (event: MessageEvent) => {
          if (event.data === 'leaving') {
            store.dispatch(setRemoteStreams([]));
          }
          const json = JSON.parse(event.data);
          if (json.type === 'offer') {
            store.dispatch({ type: 'HANDLE_REMOTE_OFFER', payload: json });
          } else if (json.type === 'answer') {
            callback?.(event.data)
          }
        };
        offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        response = await fetch(path, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(offer),
        })
        server_answer = await response.json();
        await peerConnection.setRemoteDescription(server_answer);

        break;

      case 'HANDLE_REMOTE_OFFER':
        if (!peerConnection) return;
        await peerConnection.setRemoteDescription(action.payload);
        remoteAnswer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(remoteAnswer);
        offerChannel?.send(JSON.stringify(remoteAnswer));
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
          await negotiate()
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
          await negotiate()
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
