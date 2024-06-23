import { SubmitHandler, useForm } from 'react-hook-form'
import CreateServerModal from '../ui/create-server-modal'
import { useState } from 'react'

export interface CreateServerForm {
  serverName: string
  description: string
  icon: File
}

export default function CreateServerFeature() {
  const { register, handleSubmit, control } = useForm<CreateServerForm>()
  const [loading, setLoading] = useState<boolean>(false)
  const onSubmit: SubmitHandler<CreateServerForm> = (data) => console.log(data)

  return (
    <CreateServerModal
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      control={control}
      loading={loading}
    />
  )
}
