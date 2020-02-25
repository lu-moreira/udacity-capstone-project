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

export enum LikeType {
    LIKE, DISLIKE
}

export const LikeTypesStr = ["like", "dislike"]

export function isLikeType(v: string) : boolean {
    return LikeTypesStr.filter(x => v == x).length > 0
}

export function isLikeOrDislike(v: string) : LikeType {
    if (v == "like") {
        return LikeType.LIKE
    }
    return LikeType.DISLIKE
}