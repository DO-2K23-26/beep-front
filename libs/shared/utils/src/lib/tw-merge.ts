import { extendTailwindMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-sm', 'text-2xs', 'text-3xs'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
