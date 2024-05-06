import { useNavigate } from 'react-router-dom'
import PageAfterSignup from '../ui/page-after-signup'

export default function PageAfterSignupFeature() {
  const navigate = useNavigate()

  const onSignin = () => {
    navigate('/authentication/signin')
  }

  return <PageAfterSignup onSignin={onSignin} />
}
