import {
  ButtonShadCn,
  Calendar,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@beep/ui'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { useState } from 'react'

interface GenerateCodePrivateInvitationProps {
  isDateInPast: boolean
  isButtonDisabled: boolean
  date: Date | undefined
  selectedOption: string
  onGenerateCode: (
    uniqueCode: boolean,
    expirationDate: Date | undefined
  ) => void
  setDate: (date: Date | undefined) => void
  handleSelectChange: (value: string) => void
}

export function GenerateCodePrivateInvitation({
  isDateInPast,
  isButtonDisabled,
  date,
  selectedOption,
  onGenerateCode,
  setDate,
  handleSelectChange,
}: GenerateCodePrivateInvitationProps) {
  const [isUniqueCode, setIsUniqueCode] = useState(false)
  const checkHandler = () => {
    setIsUniqueCode(!isUniqueCode)
  }
  return (
    <>
      <ButtonShadCn
        variant="default"
        className={`w-full ${
          isButtonDisabled ? 'bg-violet-200' : 'bg-violet-400'
        }`}
        disabled={isButtonDisabled}
        onClick={() => onGenerateCode(isUniqueCode, date)}
      >
        <div className="text-violet-50">Generate invitation link</div>
      </ButtonShadCn>
      {isDateInPast && selectedOption === 'custom' && (
        <div className="text-red-500 text-sm">The date has already passed.</div>
      )}
      <div className="flex flex-row gap-4 items-center">
        <Checkbox
          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          id="code"
          checked={isUniqueCode}
          onCheckedChange={checkHandler}
        />
        <label
          htmlFor="code"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Unique invite code
        </label>
      </div>
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="hour">1 hour</SelectItem>
            <SelectItem value="day">1 day</SelectItem>
            <SelectItem value="week">1 week</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedOption === 'custom' && (
        <Popover>
          <PopoverTrigger asChild>
            <ButtonShadCn
              variant={'outline'}
              className={`w-[280px] justify-start text-left font-normal ${
                !date && 'text-muted-foreground'
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, 'PPP')
              ) : (
                <span>Pick an expiration date</span>
              )}
            </ButtonShadCn>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}
