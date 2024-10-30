import { Device } from '@beep/contracts'
import { InputSelect } from '@beep/ui'

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
  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">Voice & video</h3>
      <div className="text-slate-500 text-sm">
        Make changes to your method of communication
      </div>
      <div className="flex flex-col gap-4 py-4">
        {audioOutputFeatureFlag && (
          <InputSelect
            label="Audio outputs"
            options={audioOutputs.map((device) => ({
              label: device.label,
              value: device.label,
            }))}
            value={audioOutputDeviceLabel}
            onChange={onChangeAudioOutputDevice}
          />
        )}
        <InputSelect
          label="Audio inputs"
          options={audioInputs.map((device) => ({
            label: device.label,
            value: device.label,
          }))}
          value={audioInputDeviceLabel}
          onChange={onChangeAudioInputDevice}
        />
        <InputSelect
          label="Video inputs"
          options={videoInputs.map((device) => ({
            label: device.label,
            value: device.label,
          }))}
          value={videoDeviceLabel}
          onChange={onChangeVideoInputDevice}
        />
      </div>
    </div>
  )
}
