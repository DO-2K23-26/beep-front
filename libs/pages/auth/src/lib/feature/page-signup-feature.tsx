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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      username: '',
      firstname: '',
      lastname: '',
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
    console.log(data)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('username', data.username)
    formData.append('firstname', data.firstname)
    formData.append('lastname', data.lastname)
    formData.append('password', data.password)
    formData.append('profilePicture', data.profilePicture)
    const request: RegisterRequest = {
      email: data.email,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      password: data.password,
      profilePicture: methods.getValues('profilePicture')
        ? methods.getValues('profilePicture')
        : undefined,
    }
    console.log(formData)
    setLoading(true)
    register(formData)
    setLoading(false)
    result.isSuccess = true
  })

  return (
    <FormProvider {...methods}>
      <PageSignup
        onSubmit={onSubmit}
        toSignin={toSignin}
        error={error}
        loading={loading}
        addProfilePicture={addProfilePicture}
        previewUrl={previewUrl}
      />
    </FormProvider>
  )
}
