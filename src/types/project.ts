export type Project = {
    id: string
    user_id: string
    name: string
    icon: string
    created: string

    activity_images: string[]
    minutes_spent: number
    sessions: ProjectSession[]
}

export type ProjectSession = {
    activity: string
    minutes_spent: number
    started: string
    pings: {
        activity_ongoing: boolean
        activity_ongoing_probability: number
        activity_image: string,
        at: string
        usage: any
    }[]
}