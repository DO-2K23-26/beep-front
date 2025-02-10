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
  const { activate, deactivate, active, swapping } = useSwappable()
  return (
    <div onMouseOver={activate} onMouseOut={() => {
      if (!swapping) {
        deactivate()
      }
    }} className={active ? "bg-red-200" : "bg-blue-200"}>
      {children}
    </div>
  )
}


interface SwappableContextContent {
  activate: () => void
  deactivate: () => void,
  active: boolean,
  swapping: boolean
}

const defaultContext: SwappableContextContent = {
  activate: () => {
    return
  },
  deactivate: () => {
    return
  },
  active: false,
  swapping: false
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

  const onSwapStart = useCallback((_event: { slotItemMap: { asArray: SwapPosition[] } }) => {
    setSwapping(true)
  }, [])

  const onSwapEnd = useCallback((event: { hasChanged: boolean; slotItemMap: { asArray: SwapPosition[] } }) => {
    if (event.hasChanged) {
      handleSwapEnd(event)
    }
    setSwapping(false)
  }, [handleSwapEnd])


  const activate = useCallback(() => {
    if (container.current) {
      setSwappable(true)
      swapy.current = createSwapy(container.current, {
        dragAxis: 'y',
        manualSwap:false,
      })
      swapy.current.onSwapStart(onSwapStart)
      swapy.current.onSwapEnd(onSwapEnd)
    }
  }, [container, onSwapStart, onSwapEnd])

  const deactivate = useCallback(() => {
    if (swapping) return
    if (swapy.current) {
      swapy.current.destroy()
      swapy.current = null
      setSwappable(false)
    }
  }, [swapping])


  return (
    <SwappableContext.Provider value={{
      activate,
      deactivate,
      active: swappable,
      swapping: swapping
    }}
    >
      <div ref={container} className={cn("overflow", swappable ? "bg-gray-100" : "")}>
        {children}
      </div>
    </SwappableContext.Provider>
  )
}

