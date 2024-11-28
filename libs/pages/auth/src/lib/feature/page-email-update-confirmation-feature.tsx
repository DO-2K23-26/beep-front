import { useConfirmEmailMutation, userActions } from '@beep/user'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { PageEmailUpdateConfirmation } from '../ui/page-email-update-confirmation'

export function PageEmailUpdateConfirmationFeature() {
  const [pageState, setPageState] = useState<'pending' | 'error' | 'success'>(
    'pending'
  )
  const dispatch = useDispatch()
  const { token = '' } = useParams<{ token: string }>()
  const [confirmEmail, result] = useConfirmEmailMutation()
  useEffect(() => {
    confirmEmail({ token: token })
  }, [confirmEmail, token])

  const navigate = useNavigate()

  useEffect(() => {
    if (result.isSuccess) {
      setPageState('success')
      dispatch(userActions.setTokens({}))
      navigate('/authentication/signin')
      setTimeout(() => {
        navigate('/authentication/signin')
      }, 2000)
    } else if (result.isError) {
      setPageState('error')
    }
  }, [result, dispatch, navigate])
  return (
    <PageEmailUpdateConfirmation
      state={pageState}
      onErrorClick={() => {
        navigate('/authentication/signin')
      }}
    />
  )
}
