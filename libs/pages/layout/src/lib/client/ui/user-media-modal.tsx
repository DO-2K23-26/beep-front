import { Device } from "@beep/contracts"
import { Button, ButtonStyle, InputSelect } from "@beep/ui"
import { getVoiceState, voiceActions } from "@beep/voice"
import { useDispatch, useSelector } from "react-redux"

interface UserMediaModalProps {
    closeModal: () => void
    onSaveMediaParameters: () => void
    audioOutputs: Device[]
    audioInputs: Device[]
    videoInputs: Device[]
  }
  
export function UserMediaModal({
    closeModal,
    onSaveMediaParameters,
    audioOutputs,
    audioInputs,
    videoInputs,
  }: UserMediaModalProps) {
    const dispatch = useDispatch()
  
    return (
      <div className="p-6">
        <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">Voice & video</h3>
        <div className="text-slate-500 text-sm">
          Make changes to your method of communication
        </div>
        <div className="flex flex-col gap-4 py-4">
          <InputSelect
            label="Audio outputs"
            options={audioOutputs.map((device) => ({
              label: device.label,
              value: device.label,
            }))}
            value={useSelector(getVoiceState).audioOutputDevice?.name}
            onChange={(value) => {
              navigator.mediaDevices.enumerateDevices().then(function (devices) {
                const devicesFiltered = devices.filter(
                  (device) => device.label === value
                )
                dispatch(
                  voiceActions.setAudioOutputDevice({
                    id: devicesFiltered[0].deviceId,
                    name: devicesFiltered[0].label,
                  })
                )
              })
            }}
          />
          <InputSelect
            label="Audio inputs"
            options={audioInputs.map((device) => ({
              label: device.label,
              value: device.label,
            }))}
            value={useSelector(getVoiceState).audioInputDevice?.name}
            onChange={(value) => {
              navigator.mediaDevices.enumerateDevices().then(function (devices) {
                const devicesFiltered = devices.filter(
                  (device) => device.label === value
                )
                dispatch(
                  voiceActions.setAudioInputDevice({
                    id: devicesFiltered[0].deviceId,
                    name: devicesFiltered[0].label,
                  })
                )
              })
            }}
          />
          <InputSelect
            label="Video inputs"
            options={videoInputs.map((device) => ({
              label: device.label,
              value: device.label,
            }))}
            value={useSelector(getVoiceState).videoDevice?.name}
            onChange={(value) => {
              navigator.mediaDevices.enumerateDevices().then(function (devices) {
                const devicesFiltered = devices.filter(
                  (device) => device.label === value
                )
                dispatch(
                  voiceActions.setVideoDevice({
                    id: devicesFiltered[0].deviceId,
                    name: devicesFiltered[0].label,
                  })
                )
              })
            }}
          />
        </div>
        <div className="flex gap-3 justify-between">
          <Button
            className="btn--no-min-w"
            style={ButtonStyle.STROKED}
            onClick={() => closeModal()}
          >
            Cancel
          </Button>
          <Button
            className="btn--no-min-w"
            style={ButtonStyle.BASIC}
            onClick={() => {
              onSaveMediaParameters()
            }}
          >
            Update
          </Button>
        </div>
      </div>
    )
  }