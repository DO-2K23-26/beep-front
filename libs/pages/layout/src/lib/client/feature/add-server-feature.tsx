import { SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import AddServerNavigation from '../ui/add-server/add-server-navigation'
import CreateServerModal from '../ui/add-server/create-server-modal'
import AddServerModal from '../ui/add-server/add-server-modal'
import SelectVisibilityModal from '../ui/add-server/select-visibility-modal'
import {
  useCreateServerMutation,
  useJoinPublicServerMutation,
} from '@beep/server'
import toast from 'react-hot-toast'
import { CreateServerRequest } from '@beep/contracts'
import { JoinServerModal } from '../ui/add-server/join-server-modal'

export interface CreateServerForm {
  serverName: string
  description: string
  icon: File
  visibility: 'private' | 'public'
}

export interface JoinServerForm {
  serverId: string
}

export interface AddServerForm extends CreateServerForm, JoinServerForm {}

export interface AddServerFeatureProps {
  closeModal: () => void
}

export type AddServerStep =
  | 'undefined'
  | 'private'
  | 'public'
  | 'invite'
  | 'create'

export interface ServerStepsRender {
  private: JSX.Element
  public: JSX.Element
  invite: JSX.Element
  undefined: JSX.Element
}

export default function AddServerFeature({
  closeModal,
}: AddServerFeatureProps) {
  const { handleSubmit, control } = useForm<AddServerForm>()
  const [loading, setLoading] = useState<boolean>(false)
  const [serverStep, setServerStep] = useState<AddServerStep | undefined>(
    undefined
  )
  const [joinPublicServer] = useJoinPublicServerMutation()

  const [createServer] = useCreateServerMutation()

  const onCreateServer = (data: CreateServerRequest) => {
    setLoading(true)
    const payload: CreateServerRequest = {
      name: data.name,
      description: data.description,
      icon: data.icon,
      visibility: serverStep === 'private' ? 'private' : 'public',
    }
    const request: FormData = new FormData()
    request.append('name', payload.name)
    request.append('description', payload.description)
    request.append('visibility', payload.visibility)
    request.append('icon', payload.icon)
    createServer(request)
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

  const onSubmit: SubmitHandler<AddServerForm> = (data) => {
    if (data.serverId) {
      onJoinServer(data.serverId)
    } else {
      const createServerRequest: CreateServerRequest = {
        name: data.serverName,
        description: data.description,
        icon: data.icon,
        visibility: data.visibility,
      }
      onCreateServer(createServerRequest)
    }
  }

  const onJoinServer = (serverId: string) => {
    joinPublicServer(serverId)
    closeModal()
  }

  const render = {
    private: (
      <CreateServerModal
        closeModal={() => setServerStep('create')}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        loading={loading}
        visibility="private"
      />
    ),
    public: (
      <CreateServerModal
        closeModal={() => setServerStep('create')}
        onSubmit={handleSubmit(onSubmit)}
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
    invite: (
      <JoinServerModal
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        loading={loading}
        closeModal={() => setServerStep('undefined')}
      />
    ),
    create: (
      <SelectVisibilityModal
        createPrivateServer={() => setServerStep('private')}
        createPublicServer={() => setServerStep('public')}
      />
    ),
  }

  return (
    <AddServerNavigation
      serverStep={serverStep}
      render={render}
    />
  )
}
