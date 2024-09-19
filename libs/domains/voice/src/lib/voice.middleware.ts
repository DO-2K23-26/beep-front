import { Middleware } from '@reduxjs/toolkit';
import { addRemoteStream, setConnectionState, setLocalStream, setRemoteStreams } from './voice.slice';

const WebRTCMiddleware: Middleware = (store) => {
  let peerConnection: RTCPeerConnection | null = null;
  let offerChannel: RTCDataChannel | null = null;
  let camTransceiver: RTCRtpTransceiver | undefined = undefined;
  let micTransceiver: RTCRtpTransceiver | undefined = undefined;
  let callback: ((value: string | PromiseLike<string>) => void) | null;
  let path: string;
  let offer: RTCSessionDescriptionInit
  let response
  let server_answer
  let remoteAnswer
  let audio: MediaStream | null;
  let video: MediaStream | null;
  const endpoint = import.meta.env.VITE_WEBRTC_URL;

  //After further investigation it looks like this function is useless
  //In fact we already negotiate the connection in the INITIALIZE_WEBRTC case
  async function negotiate() {
    if (!peerConnection) return;
    const negotiate_offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(negotiate_offer);
    offerChannel?.send(JSON.stringify(negotiate_offer));

    // I don't get it
    const json = (await new Promise((resolve) => {
      callback = resolve;
    })) as string;
    console.log(json)
    const negotiate_answer = JSON.parse(json);
    await peerConnection.setRemoteDescription(negotiate_answer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next) => async (action: any) => {
    switch (action.type) {
      case 'INITIALIZE_WEBRTC':
        path = endpoint + "/offer/" + action.payload.token.data.token;
        peerConnection = new RTCPeerConnection();

        //Track the state of the peer connection
        peerConnection.onconnectionstatechange = () => {
          store.dispatch(setConnectionState(peerConnection?.connectionState || 'failed'))
        }

        //When a new person join its stream is added to the store
        peerConnection.ontrack = (event: RTCTrackEvent) => {
          const stream = event.transceiver
          store.dispatch(addRemoteStream(stream));
        };

        //If I got it right this is the channel to transfer datas
        offerChannel = peerConnection.createDataChannel('offer/answer');

        //If I got it right it allows to send data when the channel is open
        offerChannel.onopen = async () => {
          setTimeout(async () => {
            //If the user allow the use of the microphone we add it to the peer connection
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
            //If the user allow the use of the camera we add it to the peer connection
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

            //Once all variables are set we can start the negotiation
            //I don't why we need to do this negotiation here as it looks
            //to be a mock function
            await negotiate()
          }, 1000)
        };

        offerChannel.onmessage = (event: MessageEvent) => {
          //Looks like this is never used
          if (event.data === 'leaving') {
            console.log('leaving');
            store.dispatch(setRemoteStreams([]));
          }
          const json = JSON.parse(event.data);
          //Will trigger mechanism to get remote streams
          //Edit: Is there really message coming from the server?
          if (json.type === 'offer') {
            store.dispatch({ type: 'HANDLE_REMOTE_OFFER', payload: json });
          } else if (json.type === 'answer') {
            callback?.(event.data)
          }
        };

        //Create an offer that will be sent to the server
        //Note: The negotiate function is doing the same thing
        //but it looks like it is mocked
        offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        //Send offer to the server
        response = await fetch(path, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(offer),
        })

        //Setting the configuration of the peer connection
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
          // Get the local video stream
          video = await navigator.mediaDevices.getUserMedia({
            video: {
              width: 320,
              height: 240,
              deviceId: action.payload.deviceId,
            }
          })
          if (camTransceiver) {
            video.getTracks()[0].enabled = true;
            await camTransceiver?.sender.replaceTrack(video.getTracks()[0]);
          } else {
            camTransceiver = peerConnection?.addTransceiver(video.getTracks()[0], {
              direction: 'sendonly',
            });
          }
          store.dispatch(setLocalStream(video));
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
          audio = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: action.payload.deviceId,
            }
          })
          if (micTransceiver) {
            await micTransceiver?.sender.replaceTrack(audio.getTracks()[0]);
          } else {
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
