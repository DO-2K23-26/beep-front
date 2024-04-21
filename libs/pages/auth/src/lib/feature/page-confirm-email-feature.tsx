import { useNavigate } from 'react-router-dom'
import PageConfirmEmail from '../ui/page-confirm-email'

export default function PageConfirmEmailFeature() {
  const navigate = useNavigate()

  const onSignin = () => {
    navigate('/authentication/signin')
  }

  return <PageConfirmEmail onSignin={onSignin} />
}
