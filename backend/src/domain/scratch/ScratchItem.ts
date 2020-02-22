export interface ScratchItem {
    userId: string
    id: string
    createdAt: string
    updatedAt: string
    caption: string
    text?: string
    inFavor?: number
    disFavor?: number
    attachmentUrl?: string
    available: string
}

export function isAvailable(v : boolean) : string {
    return v ? "yes": "no";
}