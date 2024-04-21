import { Icon } from '@beep/ui'
import { classNames } from '@beep/utils'
import { type ReactElement, useRef, useState } from 'react'

export interface InputSearchProps {
  placeholder?: string
  className?: string
  onChange?: (value: string) => void
  isEmpty?: boolean
  emptyContent?: ReactElement
  autofocus?: boolean
  customSize?: string
}

export function InputSearch(props: InputSearchProps) {
  const {
    placeholder = '',
    className = '',
    onChange,
    isEmpty = false,
    emptyContent,
    customSize = 'h-9 text-xs',
    autofocus = false,
  } = props

  const ref = useRef<HTMLInputElement>(null)
  const [toggleDelete, setToggleDelete] = useState(false)

  const getValue = (value: string) => {
    if (onChange) onChange(value)
    if (value !== '') {
      setToggleDelete(true)
    } else {
      setToggleDelete(false)
    }
  }

  const deleteValue = () => {
    setToggleDelete(false)
    if (ref.current) ref.current.value = ''
    if (onChange) onChange('')
  }

  return (
    <>
      <div className={classNames('relative w-full ', className)}>
        <Icon
          name={'heroicons:magnifying-glass'}
          className="w-4 absolute text-gray-600 left-2 top-1/2 -translate-y-1/2"
        ></Icon>

        <input
          data-testid="input-search"
          ref={ref}
          autoFocus={autofocus}
          className={classNames(
            'w-full rounded border border-gray-200 bg-gray-100 text-gray-600 placeholder:text-neutral-350 pl-8 pr-6 leading-none focus:outline-none focus:border-brand-400 focus:transition-[border-color]',
            customSize
          )}
          type="text"
          placeholder={placeholder}
          disabled={false}
          onChange={(e) => getValue(e.currentTarget.value)}
          name="search"
        />

        {toggleDelete && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={deleteValue}
          >
            <Icon name={'heroicons:x-mark'} className="text-neutral-350 w-5" />
          </button>
        )}
      </div>

      {isEmpty && (
        <div>
          {emptyContent ? (
            emptyContent
          ) : (
            <div className="text-center px-3 py-6">
              <Icon
                name={'icon-solid-wave-pulse'}
                className="text-neutral-350"
              />
              <p className="text-neutral-350 font-medium text-xs mt-1">
                No result for this search
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
