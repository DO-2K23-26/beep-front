import { ServerEntity } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerContext } from '@beep/pages/channels'
import {
  useTransmitBannerQuery,
  useTransmitPictureQuery,
  useUpdateServerMutation,
} from '@beep/server'
import { Button, ButtonStyle, InputText, InputImageSettings } from '@beep/ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState, useContext } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Permissions } from '@beep/contracts'

export interface OverviewSettingsServerProps {
  server?: ServerEntity
}

export function OverviewSettingsServer({
  server,
}: OverviewSettingsServerProps) {
  const { t } = useTranslation()

  const [serverName, setServerName] = useState(server?.name ?? '')
  const [serverDescription, setServerDescription] = useState(
    server?.description ?? ''
  )
  const [updateServer, resultUpdate] = useUpdateServerMutation()
  const { myMember } = useContext(ServerContext)
  const { currentData: banner } = useTransmitBannerQuery(
    server?.id ?? skipToken
  )
  const { data: icon } = useTransmitPictureQuery(server?.id ?? skipToken)

  const canEditServer =
    !myMember || myMember?.hasOnePermissions([Permissions.MANAGE_SERVER])
  const handleSave = async () => {
    const updatedServer = {
      id: server?.id ?? '',
      name: serverName,
      description: serverDescription,
    }

    updateServer({
      serverId: server?.id ?? '',
      updatedServer,
    })
  }

  useEffect(() => {
    if (resultUpdate.isSuccess) {
      toast.success(t('layout.overview-settings-server.success_update_server'))
    } else if (resultUpdate.isError) {
      toast.error(t('layout.overview-settings-server.error_update_server'))
    }
  }, [resultUpdate.isError, resultUpdate.isSuccess, t])

  return (
    <div className="flex flex-col w-full bg-violet-200 p-4 overflow-y-auto gap-4">
      <p className="text-slate-700 font-bold max-w-sm text-base sm:text-xl md:text-3xl">
        {t('layout.overview-settings-server.server_overview')}
      </p>
      <div className="flex flex-row gap-2 sm:gap-8 md:gap-10 items-start w-full ">
        <div className="w-1/3">
          <InputImageSettings
            type="picture"
            label={t('layout.overview-settings-server.upload_picture')}
            name="profile"
            serverId={server?.id}
            initialImage={icon}
            disabled={!canEditServer}
          />
        </div>
        <div className="w-2/3">
          <InputImageSettings
            disabled={!canEditServer}
            type="banner"
            label={t('layout.overview-settings-server.upload_banner')}
            name="banner"
            serverId={server?.id}
            initialImage={banner}
          />
        </div>
      </div>
      <hr className="bg-violet-300 h-1"></hr>
      <div className="flex flex-col gap-2 sm:gap-4 md:gap-6">
        <InputText
          label={t('layout.overview-settings-server.server_name')}
          type="text"
          name="server-name"
          className="!rounded-lg w-full "
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          disabled={!canEditServer}
        />
        <InputText
          label={t('layout.overview-settings-server.server_description')}
          type="text"
          name="server-description"
          className="!rounded-lg w-full"
          value={serverDescription}
          onChange={(e) => setServerDescription(e.target.value)}
          disabled={!canEditServer}
        />
        {canEditServer && (
          <div className="flex flex-row justify-end">
            <Button style={ButtonStyle.BASIC} onClick={handleSave}>
              {t('layout.overview-settings-server.save')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
