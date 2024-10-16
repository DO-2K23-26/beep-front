import { NavigateFunction, useNavigate } from 'react-router-dom'
import PageConfirmEmail from '../ui/page-confirm-email'
import { AppDispatch } from '@beep/store'
import { useDispatch } from 'react-redux'
import { userActions } from '@beep/user'

export default function PageConfirmEmailFeature() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const onSignin = (navigation: NavigateFunction) => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    dispatch(userActions.setTokens({}))
    navigation('/authentication/signin')
  }

  return <PageConfirmEmail onSignin={() => onSignin(navigate)} />
}
