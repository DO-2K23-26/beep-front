import { Input, Label } from '@beep/shadcn'
import { X } from 'lucide-react'
import {
  Control,
  Controller,
  FieldValues,
  Path,
} from 'react-hook-form'
import { ReactNode } from 'react'
import AuthError from './auth-error'

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  placeholder: string
  type?: string
  rules?: any
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  headerContent?: ReactNode
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  rules,
  onKeyDown,
  headerContent,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2 group/input">
          <div className="flex flex-row justify-between">
            <Label
              htmlFor={name}
              className="text-labelV2 group-hover/input:text-label-hoverV2 group-focus-within/input:text-label-hoverV2 font-medium text-xs transition-colors duration-200"
            >
              {label}
            </Label>
            {headerContent}
          </div>
          <Input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={field.value}
            onChange={field.onChange}
            onKeyDown={onKeyDown}
            className="text-whiteV2 font-medium border-input-borderV2 bg-input-backgroundV2 placeholder:text-input-placeholderV2 focus-visible:ring-primaryV2/25 focus-visible:ring-offset-primaryV2 focus-visible:ring-offset-1 focus-visible:ring-4"
          />
          {error && <AuthError error={error.message} />}
        </div>
      )}
    />
  )
}
