import { Device } from '@beep/contracts'
import {
  getVoiceState,
  setAudioInputDevice,
  setAudioOutputDevice,
  setDevices,
  setVideoDevice,
} from '@beep/voice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserMedia } from '../ui/user-media'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserMediaFeatureProps {}

export function UserMediaFeature({}: UserMediaFeatureProps) {
  const { t } = useTranslation()

  const [audioOutputs, setAudioOutputs] = useState<Device[]>([])
  const [audioInputs, setAudioInputs] = useState<Device[]>([])
  const [videoInputs, setVideoInputs] = useState<Device[]>([])
  const { devices, audioOutputDevice, videoDevice, audioInputDevice } =
    useSelector(getVoiceState)
  const audioOutputFeatureFlag = false
  const dispatch = useDispatch()

  const onChangeVideoInputDevice = (value: string | string[]) => {
    const selectedDevice = devices.find((device) => device.label === value)
    if (selectedDevice) {
      dispatch(setVideoDevice(selectedDevice))
      dispatch({ type: 'START_CAM', payload: selectedDevice })
    }
  }

  const onChangeAudioInputDevice = (value: string | string[]) => {
    const selectedDevice = devices.find((device) => device.label === value)
    if (selectedDevice) {
      dispatch(setAudioInputDevice(selectedDevice))
      dispatch({ type: 'START_MIC', payload: selectedDevice })
    }
  }

  const onChangeAudioOutputDevice = (value: string | string[]) => {
    const selectedDevice = devices.find(
      (device) => device.label === value && device.kind === 'audiooutput'
    )
    if (selectedDevice) {
      dispatch(
        setAudioOutputDevice({
          id: selectedDevice.deviceId,
          name: selectedDevice.label,
        })
      )
    }
  }

  useEffect(() => {
    const updateDeviceLists = () => {
      const audioInputs = devices.filter(
        (device) => device.kind === 'audioinput'
      )
      const videoInputs = devices.filter(
        (device) => device.kind === 'videoinput'
      )
      const audioOutputs = devices.filter(
        (device) => device.kind === 'audiooutput'
      )


      setAudioInputs(audioInputs)
      setVideoInputs(videoInputs)
      setAudioOutputs(audioOutputs)

      if (!audioInputDevice && audioInputs.length > 0) {
        dispatch(setAudioInputDevice(audioInputs[0]))
      }

      if (!videoDevice && videoInputs.length > 0) {
        dispatch(setVideoDevice(videoInputs[0]))
      }

      if (!audioOutputDevice && audioOutputs.length > 0) {
        dispatch(
          setAudioOutputDevice({
            id: audioOutputs[0].deviceId,
            name: audioOutputs[0].label,
          })
        )
      }
    }

    updateDeviceLists()
  }, [devices, dispatch, audioInputDevice, videoDevice, audioOutputDevice])

  useEffect(() => {
    const handleDeviceChange = () => {
      navigator.mediaDevices.enumerateDevices().then((updatedDevices) => {
        dispatch(setDevices(updatedDevices))
      })
    }

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        handleDeviceChange
      )
    }
  }, [dispatch])

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
