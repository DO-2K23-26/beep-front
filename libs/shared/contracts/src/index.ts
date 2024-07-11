export * from './lib/entities'
export * from './lib/enums'
export * from './lib/value.interface'
export * from './lib/state'
export * from './lib/response'
export * from './lib/request'
const backendUrlRaw = import.meta.env.VITE_BACKEND_URL
export const backendUrl =
  backendUrlRaw[backendUrlRaw.length - 1] === '/'
    ? backendUrlRaw.slice(0, -1)
    : backendUrlRaw
const webrtcUrlRaw = import.meta.env.VITE_WEBRTC_URL
export const webrtcUrl =
  webrtcUrlRaw[webrtcUrlRaw.length - 1] === '/'
    ? webrtcUrlRaw.slice(0, -1)
    : webrtcUrlRaw
