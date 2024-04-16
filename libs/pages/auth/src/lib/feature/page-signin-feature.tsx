import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PageSignin } from '../ui/page-signin'
import { useNavigate } from 'react-router-dom'

export function PageSigninFeature() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const toForgetPassword = () => {
    navigate('/authentication/forget-password')
  }

  const toSignup = () => {
    navigate('/authentication/signup')
  }

  const methods = useForm({
    mode: 'onChange',
  })

  const onSubmit = methods.handleSubmit((data) => {
    console.log('ENVOIE DU SIGNIN', data)
    //TODO: implement login + catch error
    setError('Email or password incorrect')
  })

  return (
    <FormProvider {...methods}>
      <PageSignin
        onSubmit={onSubmit}
        loading={loading}
        toSignup={toSignup}
        toForgetPassword={toForgetPassword}
        error={error}
      />
    </FormProvider>
  )
}
