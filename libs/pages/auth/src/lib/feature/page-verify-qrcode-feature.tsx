import { useParams } from 'react-router'
import PageQRCodeVerify from '../ui/page-verify-qrcode'
import { useValidateTokenMutation } from '@beep/authentication'
import { useEffect } from 'react'

export function PageQRCodeVerifyFeature() {
  const { token = '' } = useParams<{ token: string }>()
  const [validateToken] = useValidateTokenMutation()
  useEffect(() => {
    validateToken({ token })
      .unwrap()
      .then((data) => {
        console.log(data)
      })
  }, [validateToken])
  return <PageQRCodeVerify />
}
