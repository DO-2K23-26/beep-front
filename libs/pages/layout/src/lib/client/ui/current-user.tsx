import { UserEntity } from '@beep/contracts'
import {
  ModifyProfileCardFeature,
  SettingsModal,
  SubSettings,
} from '@beep/settings'
import {
  Badge,
  BadgeType,
  Button,
  ButtonStyle,
  DialogCloseButton,
  Icon,
} from '@beep/ui'

import { UseFormReturn } from 'react-hook-form'
import { UserMediaFeature } from '../feature/user-media-feature'
import { useTranslation } from 'react-i18next'

interface CurrentUserProps {
  user: UserEntity
  onMicrophone?: () => void
  onPhone?: () => void
  onCamera?: () => void
  methods: UseFormReturn<{
    username: string
    email: string
    'actual-password': string
    'new-password': string
    'confirm-password': string
  }>

  isMuted?: boolean
  isVoiceMuted?: boolean
  isCamera?: boolean
}

export default function CurrentUser({
  user,
  isMuted,
  isVoiceMuted,
  isCamera,
  onMicrophone,
  onPhone,
  onCamera,
}: CurrentUserProps) {
  const { t } = useTranslation()

  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.current-user.account'),
    settings: [
      {
        title: t('layout.current-user.profile'),
        settingComponent: <ModifyProfileCardFeature />,
      },
      {
        title: t('layout.current-user.voice_video'),
        settingComponent: <UserMediaFeature />,
      },
    ],
  }

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
            title={t('layout.current-user.online')}
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
          <Icon
            name={isVoiceMuted ? 'lucide:mic-off' : 'lucide:mic'}
            className="!w-5 !h-5"
          />
        </Button>
        <Button
          style={ButtonStyle.NONE}
          onClick={onPhone}
          className="cursor-pointer"
        >
          <Icon
            name={isMuted ? 'lucide:volume-x' : 'lucide:volume-2'}
            className="!w-5 !h-5"
          />
        </Button>
        <Button
          style={ButtonStyle.NONE}
          onClick={onCamera}
          className="cursor-pointer"
        >
          <Icon
            name={isCamera ? 'lucide:video' : 'lucide:video-off'}
            className="!w-5 !h-5"
          />
        </Button>
        <DialogCloseButton content={<SettingsModal settings={[subSetting]} />}>
          <Icon name="lucide:settings" className="!w-5 !h-5" />
        </DialogCloseButton>
      </div>
    </div>
  )
}
