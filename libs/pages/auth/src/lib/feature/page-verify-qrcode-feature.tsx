import { useParams } from 'react-router'
import PageQRCodeVerify from '../ui/page-verify-qrcode'
import { useValidateTokenMutation } from '@beep/authentication'
import { useEffect, useState } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { LoaderSpinner } from '@beep/ui'

export function PageQRCodeVerifyFeature() {
  const { token = '' } = useParams<{ token: string }>()
  const [validateToken, { isSuccess }] = useValidateTokenMutation()
  const [isValidated, setIsValidated] = useState(false)

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

  if (!isValidated) {
    return (
      <div
        className="flex justify-center items-center h-screen w-screen"
        style={{ backgroundImage: `url('/background.svg')` }}
      >
        <LoaderSpinner />
      </div>
    )
  }

  return <PageQRCodeVerify error={!isSuccess} />
}
