import { MessageEntity } from '@beep/contracts'
import { ButtonIcon, ButtonShadCnProps, InputMessageArea } from '@beep/ui'
import { useRef } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface InputChannelAreaProps {
  onChange?: (value: string, onChange: (value: string) => void) => void
  onAddFiles: (file: File) => void
  onCursorChange?: () => void
  sendMessage: () => void
  messageForm: UseFormReturn<{
    message: string
    replyTo: MessageEntity | null
  }>
  inputRef?: React.RefObject<HTMLTextAreaElement>
  handleKeyDownOnMessage: (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void
}

export function InputChannelArea({
  onAddFiles,
  inputRef,
  onChange,
  onCursorChange,
  sendMessage,
  messageForm,
  handleKeyDownOnMessage,
}: InputChannelAreaProps) {
  const inputButtonProps: ButtonShadCnProps = {
    variant: 'hoverRounded',
    size: 'responsiveSquare',
  }
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    // Trigger click on the hidden input
    if (fileInputRef.current) fileInputRef.current.click()
  }
  const { t } = useTranslation()
  return (
    <div className="flex flex-row gap-2 md:gap-6 justify-between w-full items-end font-medium">
      {/* text input */}
      <div className="w-full h-full">
        <Controller
          control={messageForm.control}
          name="message"
          render={({ field }) => (
            <InputMessageArea
              type="text"
              name={'message'}
              value={field.value}
              className="rounded-xl bg-violet-50 px-4 w-full flex-grow h-10 sm:h-12 md:h-14 "
              placeholder={t('channels.page-channel.message_placeholder')}
              ref={inputRef}
              onChange={
                onChange
                  ? (e) => onChange(e.target.value, field.onChange)
                  : field.onChange
              }
              onMouseUp={onCursorChange}
              onKeyUp={onCursorChange}
              onKeyDown={handleKeyDownOnMessage}
            />
          )}
        />
      </div>

      {/* buttons */}
      <div className="flex flex-row gap-2 md:gap-6">
        <ButtonIcon
          buttonProps={inputButtonProps}
          onClick={sendMessage}
          className="bg-violet-50"
          icon="lucide:send"
        />
        <div>
          <label htmlFor="file" className="cursor-pointer">
            <ButtonIcon
              buttonProps={inputButtonProps}
              className="bg-violet-50"
              icon="lucide:plus"
              onClick={handleButtonClick}
            />
          </label>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target?.files?.[0]) {
                onAddFiles(e.target.files[0])
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
