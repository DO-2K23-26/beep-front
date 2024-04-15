export interface InputNumberProps {
  name: string
  step?: number
  description?: string
  uid: string
  value?: number
  max?: number
  min?: number
  placeholder: string
  setValue: (e: number) => void
}


export function InputNumber ({ name, step, description, uid, value, placeholder, setValue, min, max }: InputNumberProps) {
  return (
    <div>
      <label htmlFor={uid} className="block text-sm font-medium leading-6 text-gray-900">
        <span>{ name }</span>
        <span className="text-gray-400 pl-2 italic">{ description }</span>
      </label>

      <div className="mt-2">
        <input
          type="number"
          step={step}
          value={value}
          onInput={(e) => {
            setValue(parseFloat(e.currentTarget.value))
          }}
          min={min}
          max={max}
          name={uid}
          id={uid}
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}

        />
      </div>
    </div>
  )
}
