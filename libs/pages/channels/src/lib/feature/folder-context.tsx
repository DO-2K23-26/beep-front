import { ChannelEntity, ChannelType, CreateChannelRequest, ServerEntity } from "@beep/contracts"
import { useCreateChannelInServerMutation } from "@beep/server"
import { useModal } from "@beep/ui"
import { createContext } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { CreateChannelInFolderModal } from "../ui/create-channel-in-folder-modal"

interface FolderContextInterface {
  openCreateChannelModal: () => void
}



const FolderContext = createContext<FolderContextInterface>({
  openCreateChannelModal: () => {
    return
  },
})

function FolderProvider({
  server,
  channel,
  children,
}: {
  server: ServerEntity | undefined
  channel: ChannelEntity
  children: React.ReactNode
}) {
  const { openModal, closeModal } = useModal() //channel creation modal
  const [createChannel, resultCreatedChannel] =
    useCreateChannelInServerMutation()
  const methodsAddChannel = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      parentId: channel.id,
      type: ChannelType.text_server,
    },
  })
  const onCreateChannel = methodsAddChannel.handleSubmit((data) => {
    const createChannelRequest: CreateChannelRequest = {
      serverId: server?.id ?? '',
      name: data.name,
      type: data.type,
      parentId: channel.id
    }
    createChannel(createChannelRequest)
    closeModal()
  })
  const openCreateChannelModal = () => {
    openModal({
      content: (
        <FormProvider {...methodsAddChannel}>
          <CreateChannelInFolderModal
            closeModal={closeModal}
            onCreateChannel={onCreateChannel}
            methodsAddChannel={methodsAddChannel}
            parentName={channel.name}
          />
        </FormProvider>
      ),
    })
  }

  return (
    <FolderContext.Provider value={{
      openCreateChannelModal
    }}>
      {children}
    </FolderContext.Provider>
  )
}

export { FolderContext, FolderProvider }
