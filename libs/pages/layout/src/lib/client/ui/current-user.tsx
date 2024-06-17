import { Device, UserEntity } from '@beep/contracts'
import {
  Badge,
  BadgeType,
  Button,
  ButtonStyle,
  Icon,
  Input,
  UseModalProps
} from '@beep/ui'
import { SubSettings } from 'libs/pages/settings/src/lib/models/setting-navigation-models'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { UserMediaModal } from './user-media-modal'

interface CurrentUserProps {
  user: UserEntity
  onMicrophone?: () => void
  onPhone?: () => void
  onSaveParameters: () => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  methods: UseFormReturn<{
    username: string
    email: string
    'actual-password': string
    'new-password': string
    'confirm-password': string
  }>
  audioOutputs: Device[]
  audioInputs: Device[]
  videoInputs: Device[]
}

export default function CurrentUser({
  user,
  onMicrophone,
  onPhone,
  onSaveParameters,
  openModal,
  closeModal,
  methods,
  audioOutputs,
  audioInputs,
  videoInputs,
}: CurrentUserProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex flex-row gap-3">
        <img
          className="w-[50px] min-w-[50px] h-[50px] min-h-[50px] object-cover bg-violet-50 flex justify-center items-center rounded-2xl"
          src={user.profilePicture ?? 'current user picture'}
          alt="Profilepicture"
        />
        <div className="flex flex-col justify-between">
          <h5 className="font-bold max-w-[100px] truncate">{user.username}</h5>
          <Badge
            type={BadgeType.ONLINE}
            title="Online"
            className="!text-slate-900"
          />
        </div>
      </div>

      <div className="flex-row flex gap-4 ">
        <Button
          style={ButtonStyle.NONE}
          onClick={onMicrophone}
          className="cursor-pointer "
        >
          <Icon name="lucide:mic hidden" className="!w-5 !h-5" />
        </Button>
        <Button
          style={ButtonStyle.NONE}
          onClick={onPhone}
          className="cursor-pointer"
        >
          <Icon name="lucide:phone hidden" className="!w-5 !h-5" />
        </Button>
        {/* <DialogCloseButton
          triggerButton={<Icon name="lucide:settings" className="!w-5 !h-5" />}
          content={<SettingsModal settings={[subSetting]} />}
        /> */}
        <button
          className="cursor-pointer"
          onClick={() => {
            openModal({
              content: (
                <FormProvider {...methods}>
                  <UserMediaModal
                    closeModal={closeModal}
                    audioOutputs={audioOutputs}
                    audioInputs={audioInputs}
                    videoInputs={videoInputs}
                    onSaveMediaParameters={onSaveParameters}
                  />
                </FormProvider>
              ),
            })
          }}
        >
          <Icon name="lucide:audio-lines" className="!w-5 !h-5" />
        </button>
      </div>
    </div>
  )
}

// for testing purpose
const subSetting: SubSettings = {
  subGroupSettingTitle: 'Account',
  settings: [
    { title: 'account', settingComponent: <Input /> },
    { title: 'voice', settingComponent: <Input /> },
    { title: 'text', settingComponent: <Input /> },
  ],
}
