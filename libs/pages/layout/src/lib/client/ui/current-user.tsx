import { UserEntity } from '@beep/contracts'
import {
  ModifyProfileCardFeature,
  ChangeLanguageFeature,
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
import { SecuritySettingFeature } from '../feature/security-setting-feature'

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
  const iconSize = '!w-4 !h-4 sm:!w-4 sm:!h-4 md:!w-5 md:!h-5'
  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.current-user.account'),
    settings: [
      {
        title: t('layout.current-user.profile'),
        id: 'profile',
        settingComponent: <ModifyProfileCardFeature />,
      },
      {
        title: t('layout.current-user.voice_video'),
        id: 'voice_video',
        settingComponent: <UserMediaFeature />,
      },
      {
        title: t('layout.current-user.language'),
        id: 'language',
        settingComponent: <ChangeLanguageFeature />,
      },
      {
        title: t('layout.current-user.security'),
        settingComponent: <SecuritySettingFeature />,
        id: 'security',
      },
    ],
  }

  return (
    <div className="flex flex-col sm:flex-row sm:min-w-32 md:min-w-48 items-center md:justify-between gap-3 md:gap-4 lg:gap-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <img
          className="size-10 object-cover bg-violet-50 flex justify-center items-center rounded-lg"
          src={user.profilePicture ?? 'current user picture'}
          alt="Profilepicture"
        />
        <div className="flex flex-row sm:flex-col gap-2 justify-between">
          <div className="font-bold text-xs md:text-base max-w-12 md:max-w-24 truncate">
            {user.username}
          </div>
          <Badge
            type={BadgeType.ONLINE}
            title={t('layout.current-user.online')}
            className="!text-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-row sm:flex-col md:flex-row w-fit justify-center sm:w-fit gap-1 sm:gap-2">
        <div className="flex-row flex sm:w-fit justify-between sm:justify-normal gap-1 sm:gap-2 self-end">
          <Button
            style={ButtonStyle.NONE}
            onClick={onMicrophone}
            className="cursor-pointer "
          >
            <Icon
              name={isVoiceMuted ? 'lucide:mic-off' : 'lucide:mic'}
              className={iconSize}
            />
          </Button>
          <Button
            style={ButtonStyle.NONE}
            onClick={onPhone}
            className="cursor-pointer"
          >
            <Icon
              name={isMuted ? 'lucide:volume-x' : 'lucide:volume-2'}
              className={iconSize}
            />
          </Button>
        </div>
        <div className="flex-row flex sm:w-fit justify-between sm:justify-normal gap-1 sm:gap-2">
          <Button
            style={ButtonStyle.NONE}
            onClick={onCamera}
            className="cursor-pointer"
          >
            <Icon
              name={isCamera ? 'lucide:video' : 'lucide:video-off'}
              className={iconSize}
            />
          </Button>
          <DialogCloseButton
            content={<SettingsModal settings={[subSetting]} />}
          >
            <Icon name="lucide:settings" className={iconSize} />
          </DialogCloseButton>
        </div>
      </div>
    </div>
  )
}
