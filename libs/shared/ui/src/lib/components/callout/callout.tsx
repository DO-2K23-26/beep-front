import { type VariantProps, cva } from 'class-variance-authority'
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from 'react'
import { twMerge } from '@beep/utils'

const calloutRootVariants = cva(
  ['flex', 'flex-row', 'gap-x-3', 'p-3', 'border', 'rounded', 'text-sm'],
  {
    variants: {
      color: {
        green: ['border-green-600', 'bg-green-50', 'text-green-500'],
        red: ['border-red-500', 'bg-red-50', 'text-red-500'],
        sky: ['border-sky-500', 'bg-sky-50', 'text-sky-500'],
        yellow: ['border-yellow-600', 'bg-yellow-50', 'text-yellow-700'],
        neutral: ['bg-neutral-100', 'border-neutral-300', 'text-neutral-350'],
      },
    },
  }
)

interface CalloutRootProps
  extends VariantProps<typeof calloutRootVariants>,
    Omit<ComponentPropsWithoutRef<'div'>, 'color'> {}

const CalloutRoot = forwardRef<ElementRef<'div'>, CalloutRootProps>(
  function CalloutRoot({ color, children, className, ...props }, ref) {
    return (
      <div
        data-accent-color={color}
        {...props}
        className={twMerge(calloutRootVariants({ color }), className)}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)

const CalloutIcon = forwardRef<
  ElementRef<'div'>,
  ComponentPropsWithoutRef<'div'>
>(function CalloutIcon({ children, className, ...props }, ref) {
  return (
    <div
      {...props}
      className={twMerge('-order-2 text-base leading-6', className)}
      ref={ref}
    >
      {children}
    </div>
  )
})

const CalloutText = forwardRef<
  ElementRef<'div'>,
  ComponentPropsWithoutRef<'p'>
>(function CalloutText({ children, className, ...props }, ref) {
  return (
    <div
      {...props}
      className={twMerge(
        '-order-1 mr-auto gap-x-3 text-neutral-400',
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  )
})

const CalloutTextHeading = forwardRef<
  ElementRef<'span'>,
  ComponentPropsWithoutRef<'span'>
>(function CalloutTextHeading({ children, className, ...props }, ref) {
  return (
    <span
      {...props}
      className={twMerge('block font-medium leading-6', className)}
      ref={ref}
    >
      {children}
    </span>
  )
})

type CalloutTextDescriptionProps = ComponentPropsWithoutRef<'span'>

const CalloutTextDescription = forwardRef<
  ElementRef<'span'>,
  CalloutTextDescriptionProps
>(function CalloutTextDescription({ children, className, ...props }, ref) {
  return (
    <span
      {...props}
      className={twMerge('text-neutral-350', className)}
      ref={ref}
    >
      {children}
    </span>
  )
})

const Callout = Object.assign(
  {},
  {
    Root: CalloutRoot,
    Icon: CalloutIcon,
    Text: CalloutText,
    TextHeading: CalloutTextHeading,
    TextDescription: CalloutTextDescription,
  }
)

export {
  Callout,
  CalloutRoot,
  CalloutIcon,
  CalloutText,
  CalloutTextHeading,
  CalloutTextDescription,
}

export type { CalloutRootProps, CalloutTextDescriptionProps }
