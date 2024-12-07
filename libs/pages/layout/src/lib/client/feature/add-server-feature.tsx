import { CreateServerRequest, HttpError } from '@beep/contracts'
import {
  useCreateServerMutation,
  useJoinPublicServerMutation,
} from '@beep/server'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AddServerModal from '../ui/add-server/add-server-modal'
import AddServerNavigation from '../ui/add-server/add-server-navigation'
import CreateServerModal from '../ui/add-server/create-server-modal'
import { JoinServerModal } from '../ui/add-server/join-server-modal'
import SelectVisibilityModal from '../ui/add-server/select-visibility-modal'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const { handleSubmit, control } = useForm<AddServerForm>()
  const [serverStep, setServerStep] = useState<AddServerStep | undefined>(
    undefined
  )
  const [
    joinPublicServer,
    {
      isLoading: isLoadingJoinServer,
      isSuccess: isSuccessJoinServer,
      isError: isErrorJoinServer,
    },
  ] = useJoinPublicServerMutation()

  const [
    createServer,
    {
      isLoading: isLoadingCreateServer,
      isSuccess: isSuccessCreateServer,
      isError: isErrorCreateServer,
      error: errorCreateServer,
    },
  ] = useCreateServerMutation()

  const onCreateServer = (data: CreateServerRequest) => {
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
    if (payload.icon !== null && payload.icon !== undefined)
      request.append('icon', payload.icon)
    createServer(request)
  }

  const onSubmit = handleSubmit((data) => {
    if (data.serverId) {
      joinPublicServer(data.serverId)
    } else {
      const createServerRequest: CreateServerRequest = {
        name: data.serverName,
        description: data.description,
        icon: data.icon,
        visibility: data.visibility,
      }
      onCreateServer(createServerRequest)
    }
  })

  useEffect(() => {
    if (!isLoadingCreateServer && isSuccessCreateServer) {
      toast.success(t('layout.add-server.success_create_server'))
      closeModal()
    }
  }, [closeModal, isLoadingCreateServer, isSuccessCreateServer])

  useEffect(() => {
    if (isErrorCreateServer && errorCreateServer !== undefined) {
      const error = errorCreateServer as HttpError
      if (error.data.code === 'E_SERVER_ALREADY_EXISTS') {
        control.setError('serverName', {
          message: t('layout.add-server.error_name_already_exists'),
          type: 'validate',
        })
      } else {
        toast.error(t('layout.add-server.error_create_server'))
        closeModal()
      }
    }
  }, [closeModal, control, errorCreateServer, isErrorCreateServer, serverStep])

  useEffect(() => {
    if (!isLoadingJoinServer && isSuccessJoinServer) {
      toast.success(t('layout.add-server.success_join_server'))
      closeModal()
    } else if (!isLoadingJoinServer && isErrorJoinServer) {
      toast.error(t('layout.add-server.error_join_server'))
      closeModal()
    }
  }, [isSuccessJoinServer, isLoadingJoinServer, isErrorJoinServer, closeModal])

  const render = {
    private: (
      <CreateServerModal
        closeModal={() => setServerStep('create')}
        onSubmit={onSubmit}
        control={control}
        loading={isLoadingCreateServer}
        visibility="private"
      />
    ),
    public: (
      <CreateServerModal
        closeModal={() => setServerStep('create')}
        onSubmit={onSubmit}
        control={control}
        loading={isLoadingJoinServer}
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
        onSubmit={onSubmit}
        control={control}
        loading={isLoadingJoinServer}
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

  return <AddServerNavigation serverStep={serverStep} render={render} />
}
