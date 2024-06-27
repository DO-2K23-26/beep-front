import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { GenerateCodePrivateInvitation } from './generate-code-private-invitation'
import { GeneratedCodePrivateInvitation } from './generated-code-private-invitation'
import { IdCodePublicInvitation } from './id-code-public-invitation'
import { addDays, addHours, addWeeks } from 'date-fns'

interface InviteMemberModalProps {
  serverInviteCode: string | undefined
  serverVisibility: string | undefined
  serverId: string | undefined
  onGenerateCode: (uniqueCode: boolean, expirationDate: Date) => void
  onGenerateNewCode: () => void
  copyToClipboard: (copiedText: string, toastText: string) => void
}

export function InviteMemberModal({
  serverInviteCode,
  serverVisibility,
  serverId,
  onGenerateCode,
  onGenerateNewCode,
  copyToClipboard,
}: InviteMemberModalProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedOption, setSelectedOption] = useState('')
  const [isDatePassed, setIsDatePassed] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)

  const handleSelectChange = (value: string) => {
    setSelectedOption(value)
    let newDate: Date  = new Date()
    const now = new Date()

    switch (value) {
      case 'hour':
        newDate = addHours(now, 1)
        break
      case 'day':
        newDate = addDays(now, 1)
        break
      case 'week':
        newDate = addWeeks(now, 1)
        break
    }

    setDate(newDate)
  }

  useEffect(() => {
    if (date) {
      const today = DateTime.now()
      const dateTime = DateTime.fromJSDate(date)
      setIsDatePassed(dateTime < today && !dateTime.hasSame(today, 'day'))
    }
  }, [date])

  useEffect(() => {
    setIsButtonDisabled(
      !selectedOption ||
        (selectedOption === 'custom' && (!date || isDatePassed))
    )
  }, [selectedOption, date, isDatePassed])

  const handleGenerateNewCode = () => {
    onGenerateNewCode()
    setIsButtonDisabled(true)
    setSelectedOption('')
  }

  function ModalHeader({ text }: { text: string }) {
    return (
      <>
        <h3 className="text-slate-700 font-bold mb-2 max-w-sm">
          Invite your friends
        </h3>
        <div className="text-slate-500 text-sm">{text}</div>
      </>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      {serverVisibility === 'private' ? (
        <>
          <ModalHeader
            text={
              'Share this code id to invite your friends to this private server'
            }
          />
          {serverInviteCode === null ||
          serverInviteCode === '' ||
          serverInviteCode === undefined ? (
            <GenerateCodePrivateInvitation
              isDateInPast={isDatePassed}
              isButtonDisabled={isButtonDisabled}
              date={date}
              selectedOption={selectedOption}
              onGenerateCode={onGenerateCode}
              setDate={setDate}
              handleSelectChange={handleSelectChange}
            />
          ) : (
            <GeneratedCodePrivateInvitation
              serverInviteCode={serverInviteCode}
              onGenerateNewCode={handleGenerateNewCode}
              copyToClipboard={copyToClipboard}
            />
          )}
        </>
      ) : (
        <>
          <ModalHeader
            text={
              'Share this server id to invite your friends to this public server'
            }
          />
          <IdCodePublicInvitation
            serverId={serverId}
            copyToClipboard={copyToClipboard}
          />
        </>
      )}
    </div>
  )
}
