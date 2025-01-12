import { ReactNode } from "react";

interface SwappableProps {
  slot: string;
  item: string;
  children: ReactNode
}


export function Swappable({
  slot,
  item,
  children
}: SwappableProps) {
  return (
    <div data-swapy-slot={slot}>
      <div data-swapy-item={item}>
        {children}
      </div>
    </div>
  )
}
