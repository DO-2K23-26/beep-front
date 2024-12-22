import { useValidateTokenMutation } from '@beep/authentication'
import { LoaderSpinner } from '@beep/ui'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PageQRCodeVerify from '../ui/page-verify-qrcode'

export function PageQRCodeVerifyFeature() {
  const { token = '' } = useParams<{ token: string }>()
  const [validateToken, { isSuccess }] = useValidateTokenMutation()
  const [isValidated, setIsValidated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const validate = async () => {
      if (isValidated) return
      const result = await validateToken({ token })
      if (result) {
        setIsValidated(true)
      }
    }
    validate()
  }, [validateToken, token])

  const onSignin = () => {
    navigate('/signin')
  }

  if (!isValidated) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <LoaderSpinner />
      </div>
    )
  }

  return <PageQRCodeVerify error={!isSuccess} onSignin={onSignin} />
}
