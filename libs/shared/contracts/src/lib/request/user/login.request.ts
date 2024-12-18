export interface LoginRequest {
    email: string
    password: string
    totpToken?: string
}