import { cn } from '@beep/utils'
import {
  ButtonIcon,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@beep/ui'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface AddFriendInputProps {
  onSubmit: (data: { username: string }) => void
  isLoadingInvitation?: boolean
  invitationSucceded?: boolean
  form: UseFormReturn<{ username: string }>
}

export function AddFriendInput({
  onSubmit,
  form,
  invitationSucceded,
  isLoadingInvitation,
}: AddFriendInputProps) {
  const { t } = useTranslation()
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row w-full gap-2 pb-2 "
      >
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem className="max-w-lg w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder={t('friends.add-friend-input.placeholder')}
                  className="w-full h-8 sm:h-9 md:h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage
                hidden={isLoadingInvitation}
                className={cn({
                  'text-red-600': form.formState.errors,
                  'text-green-600': invitationSucceded && invitationSucceded,
                })}
              >
                {invitationSucceded && (t('friends.add-friend-input.success') )}
              </FormMessage>
            </FormItem>
          )}
        />
        <ButtonIcon
          type="submit"
          icon="lucide:user-plus"
          buttonProps={{ variant: 'hoverRounded', size: 'responsiveSquare' }}
          className="bg-violet-500 !h-8 !w-8 sm:!h-9 sm:!w-9 md:!h-10 md:!w-10"
          loading={isLoadingInvitation}
        />
      </form>
    </Form>
  )
}
