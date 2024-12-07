export interface HttpError {
  status: number
  data: {
    message?: string
    code?: string
  }
}
