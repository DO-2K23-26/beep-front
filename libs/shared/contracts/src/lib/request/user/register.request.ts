export interface RegisterRequest {
    email: string
    username: string
    firstname: string
    lastname: string
    password: string
    profilePicture: File | undefined
}
