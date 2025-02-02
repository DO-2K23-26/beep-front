export interface UserConnectedEntity {
    id: string
    username: string
    expiresAt: number | null
    screenSharing?: boolean
    voiceMuted?: boolean
    userSn?: string
    camera?: boolean
}
