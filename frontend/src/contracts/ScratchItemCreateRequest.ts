export interface ScratchItemCreateRequest {
    caption: string
    text?: string
    attachmentUrl?: string
    available: boolean
}

/*
Json representation
{
    "caption": "",
    "text": "",
    "attachmentUrl": "",
    "available": false
}
*/