import { ServerEntity } from '@beep/contracts'
import { Button, ButtonStyle, Icon, InputText, UseModalProps } from '@beep/ui'
import { ListServers } from './list-servers'
import {
  Controller,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from 'react-hook-form'

interface ServersNavigationProps {
  servers: ServerEntity[]
  onPrivateMessage?: () => void
  onLogout?: () => void
  onCreateServer: () => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  methods: UseFormReturn<{ name: string }>
}

export default function ServersNavigation({
  servers,
  onPrivateMessage,
  onLogout,
  onCreateServer,
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
              content: (
                <FormProvider {...methods}>
                  <CreateServerModal
                    closeModal={closeModal}
                    onCreateServer={onCreateServer}
                  />
                </FormProvider>
              ),
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
}

function CreateServerModal({
  closeModal,
  onCreateServer,
}: CreateServerModalProps) {
  const { control } = useFormContext()
  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">Create server</h3>
      <div className="text-slate-500 text-sm mb-4">
        Choose a name for your server
      </div>
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
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.BASIC}
          onClick={() => {
            onCreateServer()
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}
