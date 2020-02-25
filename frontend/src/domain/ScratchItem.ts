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

export function isAvailable(v: string): boolean {
    if (!v) {
        return false
    }
    return v == "yes" ? true : false;
}

export function setAvailable(v: boolean): string {
    return v ? "yes" : "no";
}

export function addInFavor(item: ScratchItem) : ScratchItem {
    if (!item.inFavor) {
        item.inFavor = 0
    }
    item.inFavor = item.inFavor + 1
    return item
}

export function addDisFavor(item: ScratchItem) : ScratchItem{
    if (!item.disFavor) {
        item.disFavor = 0
    }
    item.disFavor = item.disFavor + 1
    return item
}