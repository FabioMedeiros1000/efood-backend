declare interface JWTPayload {
  id: string
  username: string
}

declare namespace Express {
  export interface Request {
    user?: JWTPayload
  }
}
