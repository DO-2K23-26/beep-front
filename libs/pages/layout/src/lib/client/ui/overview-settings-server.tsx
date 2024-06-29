import { ServerEntity } from '@beep/contracts'
import { Button, ButtonStyle, Input, InputText } from '@beep/ui'

export interface OverviewSettingsServerProps {
  server: ServerEntity
}

export function OverviewSettingsServer({
  server,
}: OverviewSettingsServerProps) {
  console.log('OverviewSettingsServer')
  return (
    <div className="w-full	 bg-white p-10 overflow-y-auto">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        SERVER OVERVIEW
      </h3>
      <div className="flex gap-10 items-center py-10">
        {server.picture ? (
          <img
            src={server.picture}
            alt={server.name}
            className="rounded-full  truncate h-60 w-60  flex items-center justify-center"
          />
        ) : (
          <p className=" rounded-full truncate h-60 w-60 bg-slate-300 flex items-center justify-center text-black">
            {server.name}
          </p>
        )}

        {server.banner ? (
          <img
            src={server.banner}
            alt={server.banner}
            className="rounded-xl truncate h-60 flex-grow flex items-center justify-center"
          />
        ) : (
          <p className="rounded-xl truncate h-60 flex-grow bg-slate-300 flex items-center justify-center"></p>
        )}
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
            value={server.name}
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
            value={server.description}
          />
        </div>
      </div>
      <Button style={ButtonStyle.BASIC}>SAVE</Button>
    </div>
  )
}
