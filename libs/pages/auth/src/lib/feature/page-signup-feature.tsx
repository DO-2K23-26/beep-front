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
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('username', data.username)
    formData.append('firstname', data.firstname)
    formData.append('lastname', data.lastname)
    formData.append('password', data.password)
    formData.append('profilePicture', data.profilePicture)
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
