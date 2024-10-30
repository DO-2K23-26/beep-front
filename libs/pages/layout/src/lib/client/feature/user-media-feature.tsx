import { Device } from '@beep/contracts'
import {
  getVoiceState,
  setAudioInputDevice,
  setAudioOutputDevice,
  setDevices,
  setVideoDevice,
} from '@beep/voice'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserMedia } from '../ui/user-media'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserMediaFeatureProps {}

export function UserMediaFeature({}: UserMediaFeatureProps) {
  const [audioOutputs, setAudioOutputs] = useState<Device[]>([])
  const [audioInputs, setAudioInputs] = useState<Device[]>([])
  const [videoInputs, setVideoInputs] = useState<Device[]>([])
  const { devices } = useSelector(getVoiceState)
  const audioOutputFeatureFlag = false
  const dispatch = useDispatch()
  const { audioOutputDevice, videoDevice, audioInputDevice } =
    useSelector(getVoiceState)

  const onChangeVideoInputDevice = (value: string | string[]) => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      const devicesFiltered = devices.filter((device) => device.label === value)
      dispatch(setVideoDevice(devicesFiltered[0]))
      dispatch({ type: 'START_CAM', payload: devicesFiltered[0] })
    })
  }
  const onChangeAudioInputDevice = (value: string | string[]) => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      const devicesFiltered = devices.filter((device) => device.label === value)
      dispatch(setAudioInputDevice(devicesFiltered[0]))
      dispatch({ type: 'START_MIC', payload: devicesFiltered[0] })
    })
  }
  const onChangeAudioOutputDevice = (value: string | string[]) => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      const devicesFiltered = devices.filter((device) => device.label === value)
      dispatch(
        setAudioOutputDevice({
          id: devicesFiltered[0].deviceId,
          name: devicesFiltered[0].label,
        })
      )
    })
  }
  const handleDeviceChange = useCallback(() => {
    navigator.mediaDevices.enumerateDevices().then((streams) => {
      dispatch(setDevices(streams))
    })
  }, [dispatch])
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((streams) => {
      dispatch(setDevices(streams))
      dispatch(
        setAudioInputDevice(
          streams.filter((info) => info.kind === 'audioinput')?.[0]
        )
      )
      dispatch(
        setVideoDevice(
          streams.filter((info) => info.kind === 'videoinput')?.[0]
        )
      )
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
    <UserMedia
      audioOutputDeviceLabel={audioOutputDevice?.name ?? ''}
      audioInputDeviceLabel={audioInputDevice?.label ?? ''}
      videoDeviceLabel={videoDevice?.label ?? ''}
      audioInputs={audioInputs}
      audioOutputs={audioOutputs}
      videoInputs={videoInputs}
      audioOutputFeatureFlag={audioOutputFeatureFlag}
      onChangeAudioInputDevice={onChangeAudioInputDevice}
      onChangeAudioOutputDevice={onChangeAudioOutputDevice}
      onChangeVideoInputDevice={onChangeVideoInputDevice}
    />
  )
}
