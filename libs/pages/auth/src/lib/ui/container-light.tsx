import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

interface ContainerLightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export default function ContainerLight({
  children,
  className,
  ...props
}: ContainerLightProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])
  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-hidden flex relative flex-row rounded-md border border-input-borderV2 p-12 gap-12 shadow-custom-black',
        className
      )}
      {...props}
    >
      {children}
      <div className="absolute z-0 top-0 left-0 w-1/4 h-32 bg-gradient-to-r from-[#D458FF]/40 via-[#E43DFF] to-[#9A35FF] blur-3xl opacity-20 animate-breathe1"></div>
      <div className="absolute z-0 top-0 left-1/4 w-1/4 h-24 bg-[#D458FF] blur-3xl opacity-15 animate-breathe2"></div>
      <div className="absolute z-0 top-0 right-1/4 w-1/4 h-32 bg-[#E43DFF] blur-3xl opacity-15 animate-breathe3"></div>
      <div className="absolute z-0 top-0 right-0 w-1/4 h-48 bg-[#9A35FF] blur-3xl opacity-20 animate-breathe4"></div>
    </div>
  )
}
