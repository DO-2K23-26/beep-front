import { SubmitHandler, useForm } from 'react-hook-form'
import CreateServerModal from '../ui/create-server-modal'
import { useState } from 'react'

export interface CreateServerForm {
  serverName: string
  description: string
  icon: File
}

export interface CreateServerFeatureProps {
  closeModal: () => void
}

export type CreateServerStep = 'private' | 'public' | 'invite'

export default function CreateServerFeature({
  closeModal,
}: CreateServerFeatureProps) {
  const { register, handleSubmit, control } = useForm<CreateServerForm>()
  const [loading, setLoading] = useState<boolean>(false)
  const [serverStep, setServerStep] = useState<CreateServerStep | undefined>(
    undefined
  )
  const onSubmit: SubmitHandler<CreateServerForm> = (data) => console.log(data)

  const STEP_DELAY = 75

  const handleNextStep = (nextStep: CreateServerStep) => {
    setTimeout(() => {
      setServerStep(nextStep)
    }, STEP_DELAY)
  }

  return (
    <CreateServerModal
      closeModal={closeModal}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      control={control}
      loading={loading}
    />
  )
}
