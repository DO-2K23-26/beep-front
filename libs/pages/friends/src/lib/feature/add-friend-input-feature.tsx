import { useCreateFriendsInvitationByUsernameMutation } from '@beep/friend'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AddFriendInput } from '../ui/add-friend-input'
import { HttpError } from '@beep/contracts'
import { useTranslation } from 'react-i18next'

export function AddFriendInputFeature() {
  const { t } = useTranslation()
  const formSchema = z.object({
    username: z.string().min(1, {
      message: t('friends.add-friend-input.username-required'),
    }),
  })
  const [createInvitation, createInvitationResult] =
    useCreateFriendsInvitationByUsernameMutation()
  const form = useForm<z.infer<typeof formSchema>>({
    reValidateMode: 'onChange',
    mode: 'onTouched',
    resetOptions: {
      keepIsSubmitSuccessful: false,
      keepErrors: false,
      keepValues: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
    },
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createInvitation({ targetUsername: data.username })
  }

  useEffect(() => {
    const error = createInvitationResult.error as HttpError
    if (
      createInvitationResult.isError &&
      error.data.code === 'E_ROW_NOT_FOUND'
    ) {
      form.setError('username', {
        type: 'manual',
        message: t('friends.add-friend-input.user-not-found'),
      })
    } else if (createInvitationResult.isError) {
      form.setError('username', {
        type: 'manual',
        message: t('friends.add-friend-input.error'),
      })
    }
  }, [createInvitationResult.error, createInvitationResult.isError, form, t])

  useEffect(() => {
    if (createInvitationResult.isSuccess) form.setValue('username', '')
  }, [createInvitationResult, createInvitationResult.isSuccess, form])
  return (
    <AddFriendInput
      onSubmit={onSubmit}
      form={form}
      invitationSucceded={createInvitationResult.isSuccess}
      isLoadingInvitation={createInvitationResult.isLoading}
    />
  )
}
