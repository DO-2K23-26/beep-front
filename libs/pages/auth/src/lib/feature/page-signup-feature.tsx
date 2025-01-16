import { useRegisterMutation } from '@beep/user'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { PageSignup } from '../ui/page-signup'

export function PageSignupFeature() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [register, result] = useRegisterMutation()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
      profilePicture: new File([], ''),
    },
  })

  const toSignin = useCallback(
    () => navigate('/authentication/signedup'),
    [navigate]
  )

  const addProfilePicture = (file: File) => {
    if (file.type.includes('image')) {
      methods.setValue('profilePicture', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (result.isError) {
      setError('Email already used')
    } else if (result.isSuccess) {
      toSignin()
    }
  }, [result.isError, result.isSuccess, toSignin])

  const onSubmit = methods.handleSubmit((data) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('username', data.username)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('password', data.password)
    formData.append('profilePicture', data.profilePicture)
    register(formData)
  })

  return (
    <FormProvider {...methods}>
      <PageSignup
        onSubmit={onSubmit}
        error={error}
        loading={result.isLoading}
        addProfilePicture={addProfilePicture}
        previewUrl={previewUrl}
      />
    </FormProvider>
  )
}
