'use client'

import * as React from 'react'
import * as FullScreenDialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@beep/utils'

const FullScreenDialog = FullScreenDialogPrimitive.Root

const FullScreenDialogTrigger = FullScreenDialogPrimitive.Trigger

const FullScreenDialogPortal = FullScreenDialogPrimitive.Portal

const FullScreenDialogClose = FullScreenDialogPrimitive.Close

const FullScreenDialogOverlay = React.forwardRef<
  React.ElementRef<typeof FullScreenDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof FullScreenDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <FullScreenDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
FullScreenDialogOverlay.displayName =
  FullScreenDialogPrimitive.Overlay.displayName

const FullScreenDialogContent = React.forwardRef<
  React.ElementRef<typeof FullScreenDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof FullScreenDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <FullScreenDialogPortal>
    {/* <FullScreenDialogOverlay /> any sens for a full screen modal*/}
    <FullScreenDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ',
        className
      )}
      {...props}
    >
      {children}
      <FullScreenDialogPrimitive.Close className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </FullScreenDialogPrimitive.Close>
    </FullScreenDialogPrimitive.Content>
  </FullScreenDialogPortal>
))
FullScreenDialogContent.displayName =
  FullScreenDialogPrimitive.Content.displayName

const FullScreenDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
FullScreenDialogHeader.displayName = 'FullScreenDialogHeader'

const FullScreenDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
FullScreenDialogFooter.displayName = 'FullScreenDialogFooter'

const FullScreenDialogTitle = React.forwardRef<
  React.ElementRef<typeof FullScreenDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof FullScreenDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <FullScreenDialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
FullScreenDialogTitle.displayName = FullScreenDialogPrimitive.Title.displayName

const FullScreenDialogDescription = React.forwardRef<
  React.ElementRef<typeof FullScreenDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof FullScreenDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <FullScreenDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
FullScreenDialogDescription.displayName =
  FullScreenDialogPrimitive.Description.displayName

export {
  FullScreenDialog,
  FullScreenDialogPortal,
  FullScreenDialogOverlay,
  FullScreenDialogClose,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
}
