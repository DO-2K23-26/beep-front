import { ServerEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, InputText, UseModalProps } from '@beep/ui'
import { ListServers } from './list-servers'
import {
  Controller,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from 'react-hook-form'
import { useState } from 'react'
import AddServerFeature from '../feature/add-server-feature'

interface ServersNavigationProps {
  servers: ServerEntity[] | undefined
  onPrivateMessage?: () => void
  onLogout?: () => void
  onCreateServer: () => void
  onJoinServer: (serverId: string) => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  methods: UseFormReturn<{ name: string }>
}

export default function ServersNavigation({
  servers,
  onPrivateMessage,
  onLogout,
  onCreateServer,
  onJoinServer,
  openModal,
  closeModal,
  methods,
}: ServersNavigationProps) {
  return (
    <div className="bg-violet-500 flex flex-col w-min p-6 ">
      <div className="pb-12">
        <Button
          onClick={onPrivateMessage}
          style={ButtonStyle.SQUARE}
          className="!bg-violet-50"
        >
          <Icon name="lucide:mail" className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-6 flex-grow overflow-y-scroll no-scrollbar scroll-smooth">
        <ListServers servers={servers} />
        <Button
          style={ButtonStyle.SQUARE}
          className="!bg-violet-50"
          onClick={() => {
            openModal({
              content: <AddServerFeature closeModal={closeModal} />,
            })
          }}
        >
          <Icon name="lucide:plus" className="w-5 h-5" />
        </Button>
      </div>
      <div className="pt-12">
        <Button
          onClick={onLogout}
          style={ButtonStyle.SQUARE}
          className="!bg-violet-50"
        >
          <Icon name="lucide:log-out" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

interface CreateServerModalProps {
  closeModal: () => void
  onCreateServer: () => void
  onJoinServer: (serverId: string) => void
}

function CreateServerModalOld({
  closeModal,
  onCreateServer,
  onJoinServer,
}: CreateServerModalProps) {
  const { control, getValues } = useFormContext()
  const [option, setOption] = useState('create')

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">
        Create or Join a Server
      </h3>
      <div className="text-slate-500 text-sm mb-4">
        Choose an option to proceed
      </div>
      <div className="ml-4 pb-2">
        <input
          className="mr-2"
          type="radio"
          name="option"
          value="create Server"
          checked={option === 'create'}
          onChange={() => setOption('create')}
        />
        Create Server
      </div>
      <div className="ml-4 pb-6">
        <input
          className="mr-2"
          type="radio"
          name="option"
          value="Join Server"
          checked={option === 'join'}
          onChange={() => setOption('join')}
        />
        Join Public Server
      </div>
      {option === 'create' && (
        <>
          <Controller
            name="name"
            rules={{
              required: 'Please enter a name.',
              minLength: {
                value: 1,
                message: 'Please enter a name.',
              },
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                className="w-full !rounded-lg min-h-[40px] mb-4"
                label={'Server name'}
                name="name"
                type="text"
                onChange={field.onChange}
                value={field.value}
                error={error?.message}
              />
            )}
          />
          <div className="flex gap-3 justify-between">
            <Button
              className="btn--no-min-w"
              style={ButtonStyle.STROKED}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className="btn--no-min-w"
              style={ButtonStyle.BASIC}
              onClick={onCreateServer}
            >
              Create
            </Button>
          </div>
        </>
      )}
      {option === 'join' && (
        <>
          <Controller
            name="serverId"
            rules={{
              required: 'Please enter a server ID.',
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                className="w-full !rounded-lg min-h-[40px] mb-4"
                label={'Public Server ID'}
                name="serverId"
                type="text"
                onChange={field.onChange}
                value={field.value}
                error={error?.message}
              />
            )}
          />
          <div className="flex gap-3 justify-between">
            <Button
              className="btn--no-min-w"
              style={ButtonStyle.STROKED}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              className="btn--no-min-w"
              style={ButtonStyle.BASIC}
              onClick={() => {
                const serverId = getValues('serverId')
                onJoinServer(serverId)
              }}
            >
              Join
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
