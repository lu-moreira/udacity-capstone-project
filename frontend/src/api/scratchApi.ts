import { ScratchItem } from "../domain/ScratchItem";
import { apiEndpoint } from "../config";
import Axios from 'axios'
import { ScratchItemCreateRequest } from "../contracts/ScratchItemCreateRequest";
import { ScratchItemUpdateRequest } from "../contracts/ScratchItemUpdateRequest";

const defaultHeaders = (authToken: string) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    }
}
export async function getAllAvailable(): Promise<ScratchItem[]> {
    const r = await Axios.get(`${apiEndpoint}/scratches`)
    return r.data.items
};

export async function getAllByUserId(userToken: string): Promise<ScratchItem[]> {
    const r = await Axios.get(`${apiEndpoint}/scratches/me`, {
        headers: defaultHeaders(userToken)
    })
    return r.data.items
};

export async function createItem(userToken: string, item: ScratchItemCreateRequest): Promise<ScratchItem> {
    const r = await Axios.post(`${apiEndpoint}/scratches`, JSON.stringify(item), {
        headers: defaultHeaders(userToken)
    })
    return r.data.item
};

export async function patchItem(userToken: string, id: string, item: ScratchItemUpdateRequest): Promise<void> {
    await Axios.patch(`${apiEndpoint}/scratches/${id}`, JSON.stringify(item), {
        headers: defaultHeaders(userToken)
    })
};

export async function deleteItem(userToken: string, id: string): Promise<void> {
    await Axios.delete(`${apiEndpoint}/scratches/${id}`, {
        headers: defaultHeaders(userToken)
    })
};

export async function getUploadUrl(userToken: string, id: string): Promise<string> {
    const r = await Axios.post(`${apiEndpoint}/scratches/${id}/attachment`, '', {
        headers: defaultHeaders(userToken)
    })
    return r.data.uploadUrl
};

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
    await Axios.put(uploadUrl, file)
};