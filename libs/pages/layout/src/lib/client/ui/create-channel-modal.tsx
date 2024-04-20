import { InputText, ModalCrud } from '@beep/ui'
import { Controller, FormProvider, useForm } from 'react-hook-form'

export interface CreateChannelModalProps {
  closeModal: () => void
}
export function CreateChannelModal({ closeModal }: CreateChannelModalProps) {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  })

  const handleSubmit = methods.handleSubmit((data) => {
    console.log(data)
    closeModal()
  })
  return (
    <FormProvider {...methods}>
      <ModalCrud
        title={'Créer un channel'}
        onClose={closeModal}
        onSubmit={handleSubmit}
      >
        <div>
          <Controller
            name="name"
            control={methods.control}
            rules={{
              required: 'Nom du channel requis',
            }}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={'Nom du channel'}
                {...field}
                name="name"
                onChange={field.onChange}
                value={field.value}
                error={error?.message}
              />
            )}
          />
        </div>
      </ModalCrud>
    </FormProvider>
  )
}
