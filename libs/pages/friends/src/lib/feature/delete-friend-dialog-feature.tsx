import { UserDisplayedEntity } from '@beep/contracts'
import { DeleteFriendDialogContent } from '../ui/delete-friend-dialog-component'
import { useDeleteFriendMutation } from '@beep/friend'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface DeleteFriendDialogFeatureProps {
  user: UserDisplayedEntity
}

export function DeleteFriendDialogFeature({
  user,
}: DeleteFriendDialogFeatureProps) {
  const { t } = useTranslation()
  const [deleteFriend, { isError, isSuccess }] = useDeleteFriendMutation()
  const deleteFriendHandler = () => {
    deleteFriend({ friendId: user.id })
  }
  useEffect(() => {
    if (isSuccess) {
      toast.success(t('friends.delete-friend-dialog-feature.success'))
    }
    if (isError) {
      toast.error(t('friends.delete-friend-dialog-feature.error'))
    }
  }, [isError, isSuccess, t])

  return <DeleteFriendDialogContent onDelete={deleteFriendHandler} />
}
