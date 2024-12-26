import { Device } from '@beep/contracts'
import { InputSelect, Button } from '@beep/ui'
import { useDispatch } from 'react-redux'
import { initializeDevices } from '@beep/voice'
import { useTranslation } from 'react-i18next'
import { AppDispatch } from '@beep/store'
import { useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserMediaProps {
  audioOutputFeatureFlag: boolean
  audioOutputDeviceLabel: string
  audioInputDeviceLabel: string
  videoDeviceLabel: string
  audioOutputs: Device[]
  audioInputs: Device[]
  videoInputs: Device[]
  onChangeVideoInputDevice: (values: string | string[]) => void
  onChangeAudioOutputDevice: (values: string | string[]) => void
  onChangeAudioInputDevice: (values: string | string[]) => void
}

export function UserMedia({
  audioOutputFeatureFlag,
  audioOutputDeviceLabel,
  audioInputDeviceLabel,
  videoDeviceLabel,
  audioOutputs,
  audioInputs,
  videoInputs,
  onChangeVideoInputDevice,
  onChangeAudioOutputDevice,
  onChangeAudioInputDevice,
}: UserMediaProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const [isError, setIsError] = useState(false)

  const handleRequestPermissions = async () => {
    setIsError(false)
    try {
      const resultAction = await dispatch(initializeDevices())
      unwrapResult(resultAction)
    } catch (error) {
      setIsError(true)
    }
  }

  return (
    <div className="p-6">
      <div className="text-base sm:text-xl md:text-3xl text-slate-700 font-bold mb-2 max-w-sm">
        {t('layout.current-user.voice_video')}
      </div>
      <div className="text-slate-800 text-xs sm:text-sm md:text-base">
        {t('layout.user-media.change_method')}
      </div>

      {!audioInputs.length && !videoInputs.length && (
        <div className="py-4">
          <Button onClick={handleRequestPermissions}>
            {t('layout.user-media.permission_to_use')}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4 py-4">
        {audioOutputFeatureFlag && (
          <InputSelect
            label={t('layout.user-media.audio_outputs')}
            options={audioOutputs.map((device) => ({
              label: device.label,
              value: device.label,
            }))}
            value={audioOutputDeviceLabel}
            onChange={onChangeAudioOutputDevice}
          />
        )}
        <InputSelect
          label={t('layout.user-media.audio_inputs')}
          options={audioInputs.map((device) => ({
            label: device.label,
            value: device.label,
          }))}
          value={audioInputDeviceLabel}
          onChange={onChangeAudioInputDevice}
          disabled={!audioInputs.length}
        />
        <InputSelect
          label={t('layout.user-media.video_inputs')}
          options={videoInputs.map((device) => ({
            label: device.label,
            value: device.label,
          }))}
          value={videoDeviceLabel}
          onChange={onChangeVideoInputDevice}
          disabled={!videoInputs.length}
        />
      </div>

      {isError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mt-4">
          {t('layout.user-media.access_blocked')}
        </div>
      )}
    </div>
  )
}
