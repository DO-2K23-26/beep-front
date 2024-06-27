import { SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import AddServerNavigation from '../ui/add-server/add-server-navigation'
import CreateServerModal from '../ui/add-server/create-server-modal'
import AddServerModal from '../ui/add-server/add-server-modal'
import SelectVisibilityModal from '../ui/add-server/select-visibility-modal'
import { useCreateServerMutation } from '@beep/server'
import toast from 'react-hot-toast'

export interface CreateServerForm {
  serverName: string
  description: string
  icon: File
  visibility: 'private' | 'public'
}

export interface AddServerFeatureProps {
  closeModal: () => void
}

export type AddServerStep = 'private' | 'public' | 'invite' | 'create'

export interface ServerStepsRender {
  private: JSX.Element
  public: JSX.Element
  invite: JSX.Element
  undefined: JSX.Element
}

export default function AddServerFeature({
  closeModal,
}: AddServerFeatureProps) {
  const { register, handleSubmit, control } = useForm<CreateServerForm>()
  const [loading, setLoading] = useState<boolean>(false)
  const [serverStep, setServerStep] = useState<AddServerStep | undefined>(
    undefined
  )

  const [createServer, result] = useCreateServerMutation()

  const onSubmit: SubmitHandler<CreateServerForm> = (data) => {
    setLoading(true)
    const payload = {
      name: data.serverName,
      description: data.description,
      icon: data.icon,
      visibility: serverStep === 'private' ? 'private' : 'public',
    }
    createServer(payload)
      .unwrap()
      .then(() => {
        setLoading(false)
        closeModal()
      })
      .catch(() => {
        setLoading(false)
        toast.error('An error occurred while creating the server')
      })
  }

  const render = {
    private: (
      <CreateServerModal
        closeModal={() => setServerStep('create')}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        control={control}
        loading={loading}
        visibility="private"
      />
    ),
    public: (
      <CreateServerModal
        closeModal={() => setServerStep('create')}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        control={control}
        loading={loading}
        visibility="public"
      />
    ),
    undefined: (
      <AddServerModal
        goToCreateServer={() => setServerStep('create')}
        goToJoinServer={() => setServerStep('invite')}
      />
    ),
    //TODO: Dorian - Add the Invite components
    invite: <div>Invite</div>,
    create: (
      <SelectVisibilityModal
        createPrivateServer={() => setServerStep('private')}
        createPublicServer={() => setServerStep('public')}
      />
    ),
  }

  return (
    <AddServerNavigation
      closeModal={() => setServerStep('create')}
      onCreateServer={() => setServerStep('private')}
      onJoinServer={(serverId) => console.log(serverId)}
      serverStep={serverStep}
      setServerStep={setServerStep}
      render={render}
    />
  )
}
