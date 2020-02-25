export interface ScratchItemUpdateRequest {
    caption?: string
    text?: string
    inFavor?: number
    disFavor?: number
    attachmentUrl?: string
    available?: boolean
}

/*
Json representation
{
    "caption": "",
    "text": "",
    "inFavor": 100000,
    "disFavor": 100000,
    "attachmentUrl": "",
    "available": false
}
*/