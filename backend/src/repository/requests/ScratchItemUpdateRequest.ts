import { ScratchItemUpdateRequest } from "../../contracts/ScratchItemUpdateRequest";
import { isAvailable } from "../../domain/scratch/ScratchItem";

export interface ItemUpdateRequest {
    caption?: string
    text?: string
    inFavor?: number
    disFavor?: number
    attachmentUrl?: string
    available?: string
}

export function parseUpdateRequest(i : ScratchItemUpdateRequest) : ItemUpdateRequest {
    return {
        attachmentUrl : i.attachmentUrl,
        caption : i.caption,
        disFavor : i.disFavor,
        inFavor : i.inFavor,
        text : i.text,
        available: isAvailable(i.available),
    }
}