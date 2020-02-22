import { IScratchRepoAdapter } from './IScratchRepoAdapter'
import { ScratchItemCreateRequest } from '../contracts/ScratchItemCreateRequest';
import { ScratchItem, isAvailable } from '../domain/scratch/ScratchItem';
import { v4 as uuid } from 'uuid';
import { ScratchItemUpdateRequest } from '../contracts/ScratchItemUpdateRequest';
import { recoverS3AttachmentURL } from '../infra/s3/s3';
import { parseUpdateRequest } from './requests/ScratchItemUpdateRequest';

export class ScratchRepo {

    constructor(
        private readonly store: IScratchRepoAdapter
    ) { }

    async create(request: ScratchItemCreateRequest, userId: string): Promise<ScratchItem> {
        const dateNow = new Date().toISOString();
        const newItem: ScratchItem = {
            id: uuid(),
            userId,
            createdAt: dateNow,
            updatedAt: dateNow,
            available: isAvailable(request.available),
            caption: request.caption,
            text: request.text,
            attachmentUrl:  request.attachmentUrl
        }

        await this.store.post(newItem);
        return newItem
    }

    async delete(key: string) {
        await this.store.delete(key)
    }

    async getById(id: string): Promise<ScratchItem> {
        return await this.store.getById(id)
    }

    // TODO maybe will be good review this
    async updateById(id: string, request: ScratchItemUpdateRequest) : Promise<ScratchItem> {
        let current = await this.getById(id)
        let attUrl = recoverS3AttachmentURL(id)
        let updatedAt = new Date().toISOString();
        const newItem : ScratchItem = { ...current, ...parseUpdateRequest(request), attachmentUrl: attUrl, updatedAt };
        await this.store.patch(id, newItem);
        return newItem;
    }

    async getByUserId(userId: string): Promise<ScratchItem[]> {
        return this.store.getAllByUserId(userId)
    }

    async getAllAvailables(): Promise<ScratchItem[]> {
        return this.store.getAllAvailables()
    }
}