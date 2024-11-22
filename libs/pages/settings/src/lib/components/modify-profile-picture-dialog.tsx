import { DialogComponent } from '@beep/ui'
import { HoverModifyPicture } from './hover-modify-picture'
import { useTranslation } from 'react-i18next'

interface ModifyProfilePictureDialogProps {
  currentPicture?: string
  isModalOpen: boolean
  selectedProfilePicture: string | null
  errorMessage: string
  setIsModalOpen: (value: boolean) => void
  action: () => void
  addProfilePicture: (file: File) => void
}

export function ModifyProfilePictureDialog({
  action,
  currentPicture,
  isModalOpen,
  selectedProfilePicture,
  setIsModalOpen,
  addProfilePicture,
  errorMessage,
}: ModifyProfilePictureDialogProps) {
  const { t } = useTranslation()

  return (
    <DialogComponent
      title={t(
        'settings.components.modify-profile-picture-dialog.choose_picture'
      )}
      triggerModalButton={
        <HoverModifyPicture
          profilePicture={currentPicture}
          onClick={() => {
            setIsModalOpen(!isModalOpen)
          }}
        />
      }
      content={
        <>
          <label
            htmlFor="file_upload"
            className="w-full h-fit input !cursor-pointer !rounded-lg !bg-violet-50 flex flex-col justify-center items-center"
          >
            <p>
              {t(
                'settings.components.modify-profile-picture-dialog.select_picture'
              )}
            </p>
          </label>
          <p className="text-red-500">{errorMessage}</p>
          <input
            id="file_upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target?.files) addProfilePicture(e.target.files[0])
            }}
          />
          {selectedProfilePicture && (
            <div className="flex justify-center items-center w-full">
              <img
                src={selectedProfilePicture}
                alt="profile"
                className="w-40 h-40 bg-violet-50 flex justify-center items-center border-2 border-black rounded-2xl"
              />
            </div>
          )}
        </>
      }
      action={action}
      actionButtonTitle={t(
        'settings.components.modify-profile-picture-dialog.confirm'
      )}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
