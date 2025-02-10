import { useTranslation } from "react-i18next";
import { ChannelEntity, ChannelType } from "@beep/contracts";
import { SettingBodyWidth, SettingsModal, SubSettings } from "@beep/settings";
import DeleteChannelFeature from "../../feature/delete-channel-feature";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger, DialogCloseButton, Icon } from "@beep/ui";
import { useContext } from "react";
import { ChannelContext } from "../../feature/channels-navigation-context";
import OverviewSettingsChannelFeature from "../../feature/overview-settings-channel-feature";

export default function ChannelSettings({
  channel }: {
    channel: ChannelEntity
  }) {
  const { t } = useTranslation()


  // List of setting in the user setting modal
  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.display-channel.channel'),
    settings: [
      {
        title: t('layout.display-channel.overview'),
        id: 'overview',
        settingComponent: <OverviewSettingsChannelFeature channel={channel} />,
        settingBodySize: SettingBodyWidth.S,
      },
      {
        title: t('layout.display-channel.delete'),
        id: 'delete',
        settingComponent: <DeleteChannelFeature channel={channel} />,
      },
    ],
  }

  return (
    <DialogCloseButton
      content={<SettingsModal settings={[subSetting]} />}
    >
      <Icon name="lucide:settings" className="!w-4 !h-4" />
    </DialogCloseButton>
  )
}


export function ContextMenuChannelSettings({
  channel, children
}: {
  channel: ChannelEntity,
  children: React.ReactNode
}) {
  const { channels, openDeleteChannelModal, moveToFolder } = useContext(ChannelContext)
  const folders = channels.filter(channel => channel.type === ChannelType.folder)

  const { t } = useTranslation()


  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.display-channel.channel'),
    settings: [
      {
        title: t('layout.display-channel.overview'),
        id: 'overview',
        settingComponent: <OverviewSettingsChannelFeature channel={channel} />,
        settingBodySize: SettingBodyWidth.S,
      },
      {
        title: t('layout.display-channel.delete'),
        id: 'delete',
        settingComponent: <DeleteChannelFeature channel={channel} />,
      },
    ],
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {
          children
        }
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>
            {
              t("channels.context-menu.move-to-folder")
            }
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {
              folders.map(folder => {
                return (
                  <ContextMenuItem
                    key={folder.id}
                    className="hover:cursor-pointer"
                    onClick={() => {
                      moveToFolder(channel.id, folder.id)
                    }}
                  >
                    {folder.name}
                  </ContextMenuItem>
                )
              })
            }
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem className="hover:cursor-pointer" onClick={() => moveToFolder(channel.id, null)}>
          {t("channels.context-menu.ungroup")}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-red-500 hover:cursor-pointer" onClick={() => openDeleteChannelModal(channel)}>
          {t("channels.context-menu.delete-channel")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}



export function ContextMenuFolderSettings({
  channel, children
}: {
  channel: ChannelEntity,
  children: React.ReactNode
}) {
  const { channels, openDeleteChannelModal } = useContext(ChannelContext)

  const { t } = useTranslation()


  const subSetting: SubSettings = {
    subGroupSettingTitle: t('layout.display-channel.channel'),
    settings: [
      {
        title: t('layout.display-channel.overview'),
        id: 'overview',
        settingComponent: <OverviewSettingsChannelFeature channel={channel} />,
        settingBodySize: SettingBodyWidth.S,
      },
      {
        title: t('layout.display-channel.delete'),
        id: 'delete',
        settingComponent: <DeleteChannelFeature channel={channel} />,
      },
    ],
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {
          children
        }
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem className="text-red-500 hover:cursor-pointer" onClick={() => openDeleteChannelModal(channel)}>
          Delete folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
