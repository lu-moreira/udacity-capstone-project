import { IScratchRepoAdapter } from './IScratchRepoAdapter'
import { ScratchItemCreateRequest } from '../contracts/ScratchItemCreateRequest';
import { ScratchItem, isAvailable, LikeType, isLikeOrDislike } from '../domain/scratch/ScratchItem';
import { v4 as uuid } from 'uuid';
import { ScratchItemUpdateRequest } from '../contracts/ScratchItemUpdateRequest';
import { recoverS3AttachmentURL } from '../infra/s3/s3';
import { parseUpdateRequest } from './requests/ScratchItemUpdateRequest';
import { createLogger } from '../infra/logger/logger';

const logger = createLogger('repository')

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

        logger.info("Item to be created", newItem)
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
        logger.info("Item recovered", current);
        let attUrl = recoverS3AttachmentURL(id)
        let updatedAt = new Date().toISOString();
        const newItem : ScratchItem = { ...current, ...parseUpdateRequest(request), attachmentUrl: attUrl, updatedAt };
        logger.info("Item to be updated", newItem);
        await this.store.patch(id, newItem);
        return newItem;
    }

    async getByUserId(userId: string): Promise<ScratchItem[]> {
        return this.store.getAllByUserId(userId)
    }

    async getAllAvailables(): Promise<ScratchItem[]> {
        return this.store.getAllAvailables()
    }

    async updateLike(id: string, typeLike: string) {
        let current = await this.getById(id)
        if (!current.inFavor) {
            current.inFavor = 0
        }
        if (!current.disFavor) {
            current.disFavor = 0
        }

        if (isLikeOrDislike(typeLike) == LikeType.LIKE) {
            current.inFavor = current.inFavor + 1
        } else {
            current.disFavor = current.disFavor + 1
        }

        logger.info("Item to be updated", current);
        await this.store.patch(id, current);
        return current;
    }
}