export type User = {
    id: string
    email: string
    name?: string
    avatar?: string
    created: string
}

export type DBUser = User & {
    access_token: string
}