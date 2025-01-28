import {
  ModifyProfileCardFeature,
  ModifyPasswordFeature,
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

import { UserMediaFeature } from '../feature/user-media-feature'
import { useTranslation } from 'react-i18next'
import { SecuritySettingFeature } from '../feature/security-setting-feature'
import { useCurrentUser } from '../feature/current-user/current-user-context'
import UserImage from './user-image'
import Username from './user-name'

export default function CurrentUser() {
  const { t } = useTranslation()
  const { onMicrophone, isCamera, isMuted, isVoiceMuted, onPhone, onCamera } =
    useCurrentUser()
  const iconSize = '!w-4 !h-4 sm:!w-4 sm:!h-4 md:!w-5 md:!h-5'
  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.current-user.account'),
    settings: [
      {
        title: t('layout.current-user.profile'),
        id: 'profile',
        settingComponent: <> <ModifyProfileCardFeature />  <ModifyPasswordFeature/> </>,
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
        <UserImage />
        <div className="flex flex-row sm:flex-col gap-2 justify-between">
          <Username />
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

// List of setting in the user setting modal
const subSetting: SubSettings = {
  subGroupSettingTitle: 'User settings',
  settings: [
    {
      title: 'Account - test',
      settingComponent: <ModifyProfileCardFeature />,
      id: 'account'
    },
    // { title: 'Profile', settingComponent: "test" },
    {
      title: 'Voice & Video',
      settingComponent: <UserMediaFeature />,
      id: 'voice-and-video'
    },
  ],
}
