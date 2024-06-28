import { Device, UserEntity } from '@beep/contracts'
import CurrentUser from '../ui/current-user'
import { useModal } from '@beep/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { getUserState, useFetchProfilePictureQuery } from '@beep/user'
import { useEffect, useState } from 'react'
import { voiceSliceSelector } from '@beep/voice'

const onMicrophone = () => {
  console.log('Microphone')
}

const onPhone = () => {
  console.log('Phone')
}

export default function CurrentUserFeature() {
  const { payload } = useSelector(getUserState)

  const dispatch = useDispatch()

  const { currentData } = useFetchProfilePictureQuery(
    payload ? payload.sub : '1'
  )

  const { openModal, closeModal } = useModal()

  const currentUser: UserEntity = payload
    ? {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        firstname: payload.firstName,
        lastname: payload.lastName,
        profilePicture: currentData || '/picture.svg',
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

  const onSaveParameters = methods.handleSubmit((data) => {
    console.log('Save parameters')
    toast.success('Settings updated !')
    closeModal()
  })

  const [audioOutputs, setAudioOutputs] = useState<Device[]>([])
  const [audioInputs, setAudioInputs] = useState<Device[]>([])
  const [videoInputs, setVideoInputs] = useState<Device[]>([])
  const devices = useSelector(voiceSliceSelector.selectDevices)

  const handleDeviceChange = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      dispatch({
        type: 'voice/setDevices',
        payload: devices.map((device) => ({
          kind: device.kind,
          label: device.label,
          deviceId: device.deviceId,
        })),
      })
    })
  }
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          dispatch({
            type: 'voice/setDevices',
            payload: devices.map((device) => ({
              kind: device.kind,
              label: device.label,
              deviceId: device.deviceId,
            })),
          })
        })
      })
  }, [])

  useEffect(() => {
    const audioOutputs: Device[] = []
    const audioInputs: Device[] = []
    const videoInputs: Device[] = []
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)
    if (devices.length === 0) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        dispatch({
          type: 'voice/setDevices',
          payload: devices.map((device) => ({
            kind: device.kind,
            label: device.label,
            deviceId: device.deviceId,
          })),
        })
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
  }, [dispatch, devices])

  return (
    <CurrentUser
      user={currentUser}
      onMicrophone={onMicrophone}
      onPhone={onPhone}
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
