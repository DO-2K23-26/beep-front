import { FormProvider, useForm } from 'react-hook-form'
import { PageSignup } from '../ui/page-signup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function PageSignupFeature() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
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

  const onSubmit = methods.handleSubmit((data) => {
    console.log('ENVOIE DU SIGNUP', data)
    //TODO: implement signup + catch error
    setError('Email already used')
  })

  const toSignin = () => {
    navigate('/authentication/signin')
  }

  return (
    <FormProvider {...methods}>
      <PageSignup onSubmit={onSubmit} toSignin={toSignin} error={error} />
    </FormProvider>
  )
}
