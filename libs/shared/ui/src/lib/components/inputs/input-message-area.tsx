import { cn } from '@beep/transmit'
import autosize from 'autosize' //library to autosize the text area. Sorry I couldn't do better than that myself
import React, { useEffect } from 'react'

export type InputMessageArea = React.InputHTMLAttributes<HTMLTextAreaElement>

const InputMessageArea = React.forwardRef<
  HTMLTextAreaElement,
  InputMessageArea
>(({ className, ...props }, ref) => {
  useEffect(() => {
    if (ref.current) {
      autosize(ref.current)
    }
  }, [ref])

  const paddingBottom = props.value
    ? props.value.toString().includes('\n')
      ? 'pb-4'
      : 'pb-0'
    : 'pb-0'

  return (
    <textarea
      className={cn(
        'flex w-full rounded-md border border-input bg-background px-3  pt-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-1',
        className,
        paddingBottom
      )}
      ref={ref}
      style={{
        resize: 'none',
      }}
      {...props}
    />
  )
})

InputMessageArea.displayName = 'InputtextArea'

export { InputMessageArea }
