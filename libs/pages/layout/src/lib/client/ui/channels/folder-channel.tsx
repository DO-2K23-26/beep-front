import { ChannelEntity } from "@beep/contracts"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, DialogCloseButton, Icon } from "@beep/ui"
import { ListChannels } from "../list-channels"
import { memo, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FolderContext } from "../../feature/folder-context";
import { SwappableTrigger, sortChannels } from "@beep/transmit";
import { ContextMenuFolderSettings } from "./settings-channel";
import OverviewSettingsChannelFeature from "../../feature/overview-settings-channel-feature";
import DeleteChannelFeature from "../../feature/delete-channel-feature";
import { SettingBodyWidth, SettingsModal, SubSettings } from "@beep/settings";
import { useTranslation } from "react-i18next";

const FolderChannel = memo(function FolderChannel({
  channel
}: {
  channel: ChannelEntity
}) {
  const { openCreateChannelModal } = useContext(FolderContext);
  const [isOpen, setIsOpen] = useState(true)
  const { t } = useTranslation()

  const open = isOpen ? "open" : "closed"

  const childrenChannels = sortChannels(channel.childrens || [])

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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <ContextMenuFolderSettings channel={channel}>
        <SwappableTrigger>
          <div className="flex items-center w-full pr-3 hover:opacity-100 opacity-60 cursor-pointer rounded-xl w-full flex flex-row justify-between group">
            <CollapsibleTrigger className="py-2 pl-3 flex-row flex items-center gap-2 w-full">
              <div data-state={open} className="transition-all [&[data-state=closed]>svg]:-rotate-90">
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" data-state={open} />
              </div>
              <p className="font-semibold max-w-10 md:max-w-36 truncate">
                {channel.name}
              </p>
            </CollapsibleTrigger>
            <div className="flex justify-center items-center gap-2">
              <DialogCloseButton
                content={<SettingsModal settings={[subSetting]} />}
              >
                <Icon name="lucide:settings" className="!w-4 !h-4 invisible group-hover:visible" />
              </DialogCloseButton>
              <button onClick={
                openCreateChannelModal
              }>
                <Icon name="lucide:plus" className="w-4 h-4" />
              </button>

            </div>
          </div>
        </SwappableTrigger>
      </ContextMenuFolderSettings>
      <CollapsibleContent>
        <div className="ml-5">
          <ListChannels parent={channel.id} channels={childrenChannels} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}, (prevProps, nextProps) => {
  if (prevProps.channel.childrens && nextProps.channel.childrens) {
    if (prevProps.channel.childrens.length !== nextProps.channel.childrens.length) {
      return false
    }
  }
  return prevProps.channel.id !== nextProps.channel.id

})

export default FolderChannel
