import { classNames } from '@beep/utils'
import { useEffect, useState } from 'react'
import { Icon } from '../icons/icon'
import { Value } from '@beep/contracts'

export interface InputSelectSmallProps {
  name: string
  label?: string
  items: Value[]
  getValue?: (name: string, value: Value | null) => void
  className?: string
  dataTestId?: string
  onChange?: (item: string | undefined) => void
  defaultValue?: string
  inputClassName?: string
  disabled?: boolean
}

export function InputSelectSmall({
  name,
  label,
  items,
  getValue,
  className = '',
  dataTestId,
  onChange,
  defaultValue,
  inputClassName = '',
  disabled,
}: InputSelectSmallProps) {
  const [value, setValue] = useState(defaultValue)

  function onClickItem(value: string) {
    const selectedItem = items.find((i) => i.value === value) || null
    if (!selectedItem) return
    if (value !== defaultValue) {
      setValue(value)
      onChange && onChange(value)
    }

    if (getValue) getValue(name, selectedItem)
  }

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  return (
    <div className={classNames('relative flex gap-1 flex-col', className)}>
      {label && <label className="text-sm shrink-0">{label}</label>}
      <select
        data-testid={dataTestId || 'input-select-small'}
        name={name}
        value={value}
        className={`input input__select--small ${inputClassName}`}
        onChange={(e) => onClickItem(e.target.value)}
      >
        {items.map((item: Value, index: number) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <Icon
        name="icon-solid-angle-down"
        className="absolute top-8 right-4 text-sm text-neutral-400 leading-3 translate-y-0.5 pointer-events-none"
      />
    </div>
  )
}
