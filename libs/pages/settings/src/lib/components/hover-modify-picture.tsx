import { ButtonIcon } from '@beep/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface HoverModifyPictureProps {
  profilePicture: string | undefined
  onClick: () => void
}

export function HoverModifyPicture({
  profilePicture,
  onClick,
}: HoverModifyPictureProps) {
  const { t } = useTranslation()
  return (
    <ButtonIcon
      className="w-fit h-fit p-0 bg-transparent"
      buttonProps={{ variant: 'ghost' }}
      onClick={onClick}
    >
      <div
        className="group size-20 sm:size-32 md:size-44 bg-cover bg-center fill-black rounded-2xl"
        style={{
          backgroundImage: `url(${profilePicture ?? '/picture.svg'})`,
        }}
      >
        <div className="flex flex-row size-full justify-center items-center text-slate-900 bg-slate-800/30 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100">
          {t('settings.components.hover-modify-picture.modify')}
        </div>
      </div>
    </ButtonIcon>
  )
}

