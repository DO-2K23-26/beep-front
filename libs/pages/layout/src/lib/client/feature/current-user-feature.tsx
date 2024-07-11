import { Device, UserEntity } from '@beep/contracts'
import { useGetCurrentStreamingUsersQuery } from '@beep/server'
import { RootState } from '@beep/store'
import { useModal } from '@beep/ui'
import {
  getUserState,
  useFetchProfilePictureQuery,
  useGetMeQuery,
  userActions,
} from '@beep/user'
import { TransmitSingleton } from '@beep/utils'
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import CurrentUser from '../ui/current-user'
import { getVoiceState, setAudioInputDevice, setDevices, setVideoDevice } from '@beep/voice';

export default function CurrentUserFeature() {
  const { data } = useGetMeQuery()
  const server = useSelector((state: RootState) => state.servers.server)
  const { isMuted, isVoiceMuted, isCamera } = useSelector(getUserState)
  const dispatch = useDispatch()
  const [audioOutputs, setAudioOutputs] = useState<Device[]>([])
  const [audioInputs, setAudioInputs] = useState<Device[]>([])
  const [videoInputs, setVideoInputs] = useState<Device[]>([])
  const { devices , videoDevice, audioInputDevice} = useSelector(getVoiceState)
  const onMicrophone = () => {
    if (server) dispatch(userActions.toggleIsVoiceMuted(server.id))
    if (isVoiceMuted) {
      dispatch({ type: 'START_MIC', payload: audioInputDevice });
    } else {
      dispatch({ type: 'STOP_MIC' })
    }
  }

  const onPhone = () => {
    if (server) dispatch(userActions.toggleIsMuted(server.id))
  }
  const onCamera = () => {
    if (server) {
      dispatch(userActions.toggleIsCamera(server.id))
      if (!isCamera) {
        dispatch({ type: 'START_CAM', payload: videoDevice });
      } else {
        dispatch({ type: 'STOP_CAM' });
      }
    }
  }

  const { refetch } = useGetCurrentStreamingUsersQuery(server?.id ?? '')
  useEffect(() => {
    if (!server?.id) return
    TransmitSingleton.subscribe(`users/${server?.id}/state`, () => {
      refetch()
    })
  }, [refetch, server])

  const { currentData } = useFetchProfilePictureQuery(data ? data.id : '1')

  const { openModal, closeModal } = useModal()

  const currentUser: UserEntity = data
    ? {
      id: data.id,
      email: data.email,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      profilePicture: currentData ?? '/picture.svg',
      verifiedAt: new Date(),
    }
    : {
      id: '1',
      email: 'rapidement@gmail.com',
      username: 'rapidement',
      firstname: 'Dorian',
      lastname: 'Grasset',
      profilePicture: '/picture.svg',
      verifiedAt: new Date(),
    }

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      'actual-password': '',
      'new-password': '',
      'confirm-password': '',
    },
  })

  const onSaveParameters = methods.handleSubmit(() => {
    toast.success('Settings updated !')
    closeModal()
  })



  const handleDeviceChange = useCallback(() => {
    navigator.mediaDevices.enumerateDevices().then((streams) => {
      dispatch(setDevices(streams))
    })
  }, [dispatch])
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((streams) => {
      dispatch(setDevices(streams))
      dispatch(setAudioInputDevice(streams.filter((info) => info.kind === 'audioinput')?.[0]))
      dispatch(setVideoDevice(streams.filter((info) => info.kind === 'videoinput')?.[0]))
    })
  }, [dispatch])

  useEffect(() => {
    const audioOutputs: Device[] = []
    const audioInputs: Device[] = []
    const videoInputs: Device[] = []
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)
    if (devices.length === 0) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        dispatch(setDevices(devices))
      })
    }
    devices.forEach(function (device: Device) {
      if (device.kind === 'audiooutput') {
        audioOutputs.push({
          kind: device.kind,
          label: device.label,
          deviceId: device.deviceId,
        })
      } else if (device.kind === 'audioinput') {
        audioInputs.push({
          kind: device.kind,
          label: device.label,
          deviceId: device.deviceId,
        })
      } else if (device.kind === 'videoinput') {
        videoInputs.push({
          kind: device.kind,
          label: device.label,
          deviceId: device.deviceId,
        })
      }
    })

    if (audioOutputs.length > 0) {
      if (audioOutputs[0].deviceId === '') {
        audioOutputs[0].deviceId = 'No audio output device found'
      }
      if (audioOutputs[0].label === '') {
        audioOutputs[0].label = 'No audio output device found'
      }
    }

    if (audioInputs.length > 0) {
      if (audioInputs[0].deviceId === '') {
        audioInputs[0].deviceId = 'No audio input device found'
        dispatch({
          type: 'voice/setAudioDeviceId',
          payload: audioInputs[0].deviceId,
        })
      }
      if (audioInputs[0].label === '') {
        audioInputs[0].label = 'No audio input device found'
      }
    }

    if (videoInputs.length > 0) {
      if (videoInputs[0].deviceId === '') {
        videoInputs[0].deviceId = 'No video input device found'
        dispatch({
          type: 'voice/setVideoDeviceId',
          payload: videoInputs[0].deviceId,
        })
      }
      if (videoInputs[0].label === '') {
        videoInputs[0].label = 'No video input device found'
      }
    }

    setAudioInputs(audioInputs)
    setAudioOutputs(audioOutputs)
    setVideoInputs(videoInputs)
    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        handleDeviceChange
      )
    }
  }, [devices, handleDeviceChange, dispatch])

  return (
    <CurrentUser
      user={currentUser}
      isMuted={isMuted}
      isVoiceMuted={isVoiceMuted}
      isCamera={isCamera}
      onMicrophone={onMicrophone}
      onPhone={onPhone}
      onCamera={onCamera}
      onSaveParameters={onSaveParameters}
      openModal={openModal}
      closeModal={closeModal}
      methods={methods}
      audioOutputs={audioOutputs}
      audioInputs={audioInputs}
      videoInputs={videoInputs}
    />
  )
}
