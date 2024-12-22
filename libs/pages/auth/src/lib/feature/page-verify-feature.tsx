import { useNavigate, useParams } from 'react-router'
import { PageVerify } from '../ui/page-verify'
import { useVerifyEmailMutation } from '@beep/user'
import { useEffect, useState } from 'react'

export default function PageVerifyFeature () {
  const navigate = useNavigate()

  const { token = '' } = useParams<{ token: string }>()

  const [verifyEmail, result] = useVerifyEmailMutation()
  const [stateVerification, setStateVerification] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (token !== '') {
      setLoading(true)
      verifyEmail({ token: token })
    }
  }, [token, verifyEmail])

  useEffect(() => {
    setStateVerification(result.isSuccess)
    setLoading(false)
  }, [result])

  const onClickButton = () => {
    navigate('/authentication/signin')
  }

  return (
    <PageVerify
      stateVerification={true}
      loading={loading}
      onClickButton={onClickButton}
    />
  )
}
