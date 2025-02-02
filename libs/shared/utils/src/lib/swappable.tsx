import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createSwapy, Swapy } from 'swapy'
import { cn } from "./tw-merge";

interface SwappableProps {
  slot: string;
  item: string;
  children: ReactNode
}

export interface SwapPosition {
  slot: string
  item: string
}


export function SwappableItem({
  slot,
  item,
  children
}: SwappableProps) {
  const { active } = useSwappable()

  if (!active) {
    return (
      children
    )
  }
  return (
    <div data-swapy-slot={slot}>
      <div data-swapy-item={item}>
        {children}
      </div>
    </div>
  )
}

export function SwappableTrigger({
  children
}: {
  children: ReactNode
}) {
  const { activate, deactivate, active } = useSwappable()
  return (
    <div onMouseOver={activate} onMouseLeave={deactivate} >
      {children}
    </div>
  )
}


interface SwappableContextContent {
  activate: () => void
  deactivate: () => void,
  active: boolean
}

const defaultContext: SwappableContextContent = {
  activate: () => {
    return
  },
  deactivate: () => {
    return
  },
  active: false
}


const SwappableContext = createContext<SwappableContextContent>(defaultContext);

const useSwappable = () => useContext(SwappableContext);

export function SwapProvider({
  children,
  handleSwapEnd
}: {
  children: ReactNode,
  handleSwapStart: (event: { slotItemMap: { asArray: SwapPosition[] } }) => void,
  handleSwapEnd: (event: { hasChanged: boolean; slotItemMap: { asArray: SwapPosition[] } }) => void
}
) {
  const container = useRef<HTMLDivElement>(null)
  const swapy = useRef<Swapy | null>(null)
  const [swappable, setSwappable] = useState(false)
  const [swapping, setSwapping] = useState(false)

  const onSwapStart = useCallback((event: { slotItemMap: { asArray: SwapPosition[] } }) => {
    setSwapping(true)
  }, [])

  const onSwapEnd = useCallback((event: { hasChanged: boolean; slotItemMap: { asArray: SwapPosition[] } }) => {
    if (event.hasChanged) {
      handleSwapEnd(event)
    }
    setSwapping(false)
  }, [])

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        dragAxis: 'y'
      })
      swapy.current.onSwapStart(onSwapStart)
      swapy.current.onSwapEnd(onSwapEnd)
    }
    return () => {
      if (swapy.current) {
        swapy.current.destroy()
        swapy.current = null
      }
    }
  }, [])

  const activate = useCallback(() => {
    if (container.current && swapy.current) {
      swapy.current.enable(true)
      setSwappable(true)
    }
  }, [container, onSwapStart, onSwapEnd, swapping])

  const deactivate = useCallback(() => {
    if (swapping) return
    if (swapy.current) {
      swapy.current.enable(false)
      setSwappable(false)
    }
  }, [swapping])


  return (
    <SwappableContext.Provider value={{
      activate,
      deactivate,
      active: swappable
    }}
    >
      <div ref={container} className={cn("overflow")}>
        {children}
      </div>
    </SwappableContext.Provider>
  )
}

