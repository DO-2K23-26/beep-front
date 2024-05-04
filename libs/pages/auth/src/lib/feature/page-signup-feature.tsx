import { RegisterRequest } from '@beep/contracts'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { PageSignup } from '../ui/page-signup'
import { useRegisterMutation } from '@beep/user'

export function PageSignupFeature() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [register, result] = useRegisterMutation()
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      username: '',
      firstname: '',
      lastname: '',
    },
  })

  const toSignin = useCallback(
    () => navigate('/authentication/signin'),
    [navigate]
  )

  useEffect(() => {
    if (result.isError) {
      setError('Email already used')
    } else if (result.isSuccess) {
      toSignin()
    }
  }, [result.isError, result.isSuccess, toSignin])

  const onSubmit = methods.handleSubmit((data) => {
    const request: RegisterRequest = {
      email: data.email,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      password: data.password,
      profilePicture: '',
    }
    register(request)
    result.isSuccess = true
  })

  return (
    <FormProvider {...methods}>
      <PageSignup onSubmit={onSubmit} toSignin={toSignin} error={error} />
    </FormProvider>
  )
}
