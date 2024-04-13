import { cva, VariantProps } from 'class-variance-authority';
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ComponentProps, ElementRef, forwardRef, ReactNode } from 'react';
import { classNames } from '@beep/utils';

const tooltipContentVariants = cva(['rounded-sm', 'px-2', 'py-1', 'text-xs', 'font-medium', 'z-20'], {
  variants: {
    color: {
      neutral: ['bg-neutral-600', 'text-neutral-50', 'dark:bg-neutral-100', 'dark:text-neutral-400'],
      orange: ['bg-orange-500', 'text-neutral-500']
    }
  }
})

const tooltipArrowVariants = cva('', {
  variants: {
    color: {
      neutral: ['fill-neutral-600', 'dark:fill-neutral-100'],
      orange: ['fill-orange-500']
    }
  }
})

export interface TooltipProps extends VariantProps<typeof tooltipArrowVariants>, TooltipPrimitive.TooltipProps {
  content: ReactNode,
  container?: ComponentProps<typeof TooltipPrimitive.Portal>['container']
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  classNameTrigger?: string
}

export const Tooltip = forwardRef<ElementRef<typeof TooltipPrimitive.Content>, TooltipProps>(function Tooltip(
  {
    children,
    content,
    open,
    defaultOpen,
    onOpenChange,
    container,
    side = 'top',
    align = 'center',
    delayDuration = 200,
    classNameTrigger = '',
    color = 'neutral'
  },
  forwardedRef
) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild className={classNameTrigger}>
        {children}
      </TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal container={container}>
        <TooltipPrimitive.Content
          className={classNames(
            tooltipContentVariants({ color }),
            'z-[100]'
          )}
          side={side}
          sideOffset={6}
          align={align}
          ref={forwardedRef}
        >
          { content }
          <TooltipPrimitive.Arrow className={classNames(tooltipArrowVariants({ color }))} offset={10} width={11} height={5}/>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
})
