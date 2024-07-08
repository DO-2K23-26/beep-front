
import { PropsWithChildren, ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useModal } from '../modal/use-modal'
import { Callout } from '../../callout/callout'
import { Icon } from '../../icons/icon'
import { Tooltip } from '../../tooltip/tooltip'
import { Button, ButtonStyle } from '../../buttons/button'
import { InputText } from '../../inputs/input-text'

export interface ModalConfirmationProps extends PropsWithChildren {
  title: string
  description?: string | ReactNode
  name?: string
  callback: () => void
  warning?: string
  placeholder?: string
  ctaButton?: string
  isDelete?: boolean
}

export function ModalConfirmation({
  title,
  description,
  name,
  callback,
  warning,
  isDelete = false,
  placeholder = isDelete ? 'Enter "delete"' : 'Enter the current name',
  ctaButton = 'Confirm',
  children,
}: ModalConfirmationProps) {
  const { handleSubmit, control } = useForm()
  const { closeModal } = useModal()

  const onSubmit = handleSubmit((data) => {
    if (data) {
      closeModal()
      callback()
    }
  })

  const copyToClipboard = () => {
    name && navigator.clipboard.writeText(name)
  }

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">{title}</h3>
      {warning && (
        <Callout.Root className="mb-2" color="yellow">
          <Callout.Icon>
            <Icon name={'icon-solid-triangle-exclamation'} />
          </Callout.Icon>
          <Callout.Text>{warning}</Callout.Text>
        </Callout.Root>
      )}
      <div className="text-slate-500 text-sm mb-4">
        {isDelete ? (
          description ?? (
            <>
              To confirm the deletion of <strong>{name}</strong>, please type
              "delete"
            </>
          )
        ) : (
          <>
            {description}
            <Tooltip>
              <span
                data-testid="copy-cta"
                onClick={copyToClipboard}
                className="link inline cursor-pointer text-sky-500 text-sm ml-1 truncate max-w-[250px]"
              >
                {name} <Icon name="icon-solid-copy" />
              </span>
            </Tooltip>
          </>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: isDelete
              ? 'Please enter "delete".'
              : 'Please enter a name.',
            validate: (value) =>
              (isDelete ? value === 'delete' : value === name) ||
              (isDelete
                ? 'Please confirm by entering "delete".'
                : 'Please enter the right name.'),
          }}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <InputText
              className="w-full !rounded-lg min-h-[40px] mb-4"
              label={placeholder}
              // placeholder={placeholder}
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              error={error?.message}
            />
          )}
        />
        {children}
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
            style={isDelete ? ButtonStyle.ERROR : ButtonStyle.BASIC}
            type="submit"
          >
            {ctaButton}
          </Button>
        </div>
      </form>
    </div>
  )
}
