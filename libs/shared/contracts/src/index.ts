export * from './lib/entities'
export * from './lib/enums'
export * from './lib/value.interface'
export * from './lib/state'
export * from './lib/response'
export * from './lib/request'

export * from './lib/meta.interface'

const backendUrlRaw = import.meta.env.VITE_BACKEND_URL
export const backendUrl =
  backendUrlRaw[backendUrlRaw.length - 1] === '/'
    ? backendUrlRaw.slice(0, -1)
    : backendUrlRaw
