import { UserEntity } from '@beep/contracts'
import {
  Badge,
  BadgeType,
  Button,
  ButtonStyle,
  Icon,
  InputText,
  UseModalProps,
} from '@beep/ui'
import {
  Controller,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from 'react-hook-form'

interface CurrentUserProps {
  user: UserEntity
  onMicrophone?: () => void
  onPhone?: () => void
  onSaveParameters: () => void
  openModal: React.Dispatch<React.SetStateAction<UseModalProps | undefined>>
  closeModal: () => void
  methods: UseFormReturn<{
    username: string
    email: string
    'actual-password': string
    'new-password': string
    'confirm-password': string
  }>
}

export default function CurrentUser({
  user,
  onMicrophone,
  onPhone,
  onSaveParameters,
  openModal,
  closeModal,
  methods,
}: CurrentUserProps) {
  console.log('user', user)
  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex flex-row gap-3">
        <img
          className="w-[50px] min-w-[50px] h-[50px] min-h-[50px] bg-violet-50 flex justify-center items-center rounded-2xl"
          src={user.profilePicture || 'current user picture'}
          alt="Profilepicture"
        />
        <div className="flex flex-col justify-between">
          <h5 className="font-bold max-w-[100px] truncate">{user.username}</h5>
          <Badge
            type={BadgeType.ONLINE}
            title="Online"
            className="!text-slate-900"
          />
        </div>
      </div>

      <div className="flex-row flex gap-4 ">
        <Button
          style={ButtonStyle.NONE}
          onClick={onMicrophone}
          className="cursor-pointer "
        >
          <Icon name="lucide:mic hidden" className="!w-5 !h-5" />
        </Button>
        <Button
          style={ButtonStyle.NONE}
          onClick={onPhone}
          className="cursor-pointer"
        >
          <Icon name="lucide:phone hidden" className="!w-5 !h-5" />
        </Button>
        <Button
          style={ButtonStyle.NONE}
          className="cursor-pointer"
          onClick={() => {
            openModal({
              content: (
                <FormProvider {...methods}>
                  <SettingsUserModal
                    user={user}
                    closeModal={closeModal}
                    onSaveParameters={onSaveParameters}
                  />
                </FormProvider>
              ),
            })
          }}
        >
          <Icon name="lucide:settings hidden" className="!w-5 !h-5" />
        </Button>
      </div>
    </div>
  )
}

interface SettingsUserModalProps {
  user: UserEntity
  closeModal: () => void
  onSaveParameters: () => void
}

function SettingsUserModal({
  user,
  closeModal,
  onSaveParameters,
}: SettingsUserModalProps) {
  const { control, watch } = useFormContext()

  return (
    <div className="p-6">
      <h3 className=" text-slate-700 font-bold mb-2 max-w-sm">Edit profile</h3>
      <div className="text-slate-500 text-sm">
        Choose a name for your channel
      </div>
      <div className="flex flex-col gap-4 py-4">
        <Controller
          name="username"
          rules={{
            required: 'Username is required',
            pattern: {
              value: /^[a-z]+$/,
              message:
                'Username should only contain lowercase letters of the alphabet',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Username"
              type="text"
              name="username"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Email"
              type="email"
              name="email"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="actual-password"
          rules={{
            required: 'Password is required',
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
              message:
                'Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Actual password"
              type="password"
              name="actual-password"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="new-password"
          rules={{
            required: 'Password is required',
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*[|/\]{}()])(?=.{8,})/,
              message:
                'Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character',
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Password"
              type="password"
              name="new-password"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="confirm-password"
          rules={{
            required: 'You must confirm your password',
            validate: (val: string) => {
              if (val !== watch('new-password')) {
                return 'Your passwords do not match'
              }
            },
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <InputText
              label="Confirm password"
              type="password"
              name="confirm-password"
              className="w-full !rounded-lg min-h-[40px]"
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="flex gap-3 justify-between">
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.STROKED}
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          className="btn--no-min-w"
          style={ButtonStyle.BASIC}
          onClick={() => {
            onSaveParameters()
          }}
        >
          Update
        </Button>
      </div>
    </div>
  )
}
