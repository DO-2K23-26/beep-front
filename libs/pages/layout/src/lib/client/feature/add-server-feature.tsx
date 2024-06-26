import { SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import AddServerNavigation from '../ui/add-server/add-server-navigation'
import CreateServerModal from '../ui/add-server/create-server-modal'

export interface CreateServerForm {
  serverName: string
  description: string
  icon: File
}

export interface AddServerFeatureProps {
  closeModal: () => void
}

export type AddServerStep = 'private' | 'public' | 'invite'

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
  const onSubmit: SubmitHandler<CreateServerForm> = (data) => console.log(data)

  const render = {
    private: (
      <CreateServerModal
        closeModal={closeModal}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        control={control}
        loading={loading}
        visibility="private"
      />
    ),
    public: (
      <CreateServerModal
        closeModal={closeModal}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        control={control}
        loading={loading}
        visibility="public"
      />
    ),
    undefined: <div>Undefined</div>,
    invite: <div>Invite</div>,
  }

  return (
    <AddServerNavigation
      closeModal={closeModal}
      onCreateServer={() => setServerStep('private')}
      onJoinServer={(serverId) => console.log(serverId)}
      serverStep={serverStep}
      setServerStep={setServerStep}
      render={render}
    />
  )
}
