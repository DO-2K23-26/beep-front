import { ServerEntity } from '@beep/contracts'
import {
  Button,
  ButtonStyle,
  InputText,
  InputPictureSettings,
  InputBannerSettings,
} from '@beep/ui'
import { useState } from 'react'
import {
  useTransmitBannerQuery,
  useTransmitPictureQuery,
  useUpdateServerMutation,
} from '@beep/server'
import toast from 'react-hot-toast'

export interface OverviewSettingsServerProps {
  server: ServerEntity
  isAdmin: boolean
}

export function OverviewSettingsServer({
  server,
  isAdmin,
}: OverviewSettingsServerProps) {
  const [serverName, setServerName] = useState(server.name)
  const [serverDescription, setServerDescription] = useState(server.description)
  const [updateServer, result] = useUpdateServerMutation()

  const banner = useTransmitBannerQuery(server.id).currentData
  const icon = useTransmitPictureQuery(server.id).currentData

  const handleSave = async () => {
    try {
      const updatedServer = {
        id: server.id,
        name: serverName,
        description: serverDescription,
      }
      console.log('Sending data:', updatedServer)

      const updatedData = await updateServer({
        serverId: server.id,
        updatedServer,
      })

      console.log('Server updated successfully', updatedData)
      toast.success('Server updated !')
    } catch (error) {
      console.error('Failed to update server', result.error)
      toast.error('An error occured while updating the server !')
    }
  }

  return (
    <div className="w-full bg-violet-200 p-10 overflow-y-auto">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        SERVER OVERVIEW
      </h3>
      <div className="flex gap-10 items-center py-10">
        <div className="w-1/3 h-60 flex justify-center items-center">
          <InputPictureSettings
            name="picture"
            label="Add a picture."
            serverId={server.id}
            initialPicture={icon}
          />
        </div>
        <div className="w-2/3 h-60">
          <InputBannerSettings
            name="banner"
            label="Add a banner."
            serverId={server.id}
            initialBanner={banner}
          />
        </div>
      </div>
      <hr className="bg-violet-300 h-1"></hr>
      <div className="py-5 ">
        <div className="py-2">
          <h5 className="py-5 text-slate-700 font-bold mb-2 max-w-sm">
            Server name
          </h5>
          <InputText
            label="Server name"
            type="text"
            name="server-name"
            className="!rounded-lg min-h-[40px] w-1/3 "
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            disabled={!isAdmin}
          />
        </div>
        <div className="py-2">
          <h5 className="py-5 text-slate-700 font-bold mb-2 max-w-sm">
            Server description
          </h5>
          <InputText
            label="Server description"
            type="text"
            name="server-description"
            className="w-2/3 !rounded-lg min-h-[40px]"
            value={serverDescription}
            onChange={(e) => setServerDescription(e.target.value)}
            disabled={!isAdmin}
          />
        </div>
      </div>
      {isAdmin && (
        <Button style={ButtonStyle.BASIC} onClick={handleSave}>
          SAVE
        </Button>
      )}
    </div>
  )
}
