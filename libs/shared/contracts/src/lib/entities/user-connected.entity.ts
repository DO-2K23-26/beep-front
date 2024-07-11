export interface UserConnectedEntity {
    id: string
    username: string
    expiresAt: number | null
    muted?: boolean
    voiceMuted?: boolean
    userSn?: string
    camera?: boolean
}
