import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { IScratchRepoAdapter } from '../../repository/IScratchRepoAdapter';
import { ScratchItem } from '../../domain/scratch/ScratchItem';
import { removeEmptyStringElements } from '../../helpers/object';
import { createLogger } from '../logger/logger';
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('scratchAccess')

export class ScratchAccess implements IScratchRepoAdapter {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly scratchTable = process.env.SCRATCH_TABLE,
        private readonly userIdIndex = process.env.USER_INDEX_NAME,
        private readonly availableIndex = process.env.AVAILABLE_INDEX_NAME
    ) { }

    async post(item: ScratchItem) {
        let newItem: ScratchItem = removeEmptyStringElements(item)
        const params = {
            TableName: this.scratchTable,
            Item: newItem
        };

        await this.docClient.put(params).promise();
    }

    async delete(key: string) {
        const params = {
            TableName: this.scratchTable,
            Key: { id: key }
        };

        await this.docClient.delete(params).promise();
    }

    async getById(id: string): Promise<ScratchItem> {
        const params = { TableName: this.scratchTable, Key: { id } };
        const results = await this.docClient.get(params).promise();
        return results.Item as ScratchItem;
    }

    async patch(id: string, item: ScratchItem) {
        const params = {
            TableName: this.scratchTable,
            Key: { id },
            UpdateExpression: 'set attachmentUrl = :u, caption = :caption, available = :available, updatedAt = :updatedAt, disFavor = :disFavor, inFavor = :inFavor, #t = :text',
            ExpressionAttributeNames: {
                '#t': 'text'
            },
            ExpressionAttributeValues: {
                ':u': item.attachmentUrl,
                ':caption': item.caption,
                ':available': item.available,
                ':updatedAt': item.updatedAt,
                ':disFavor': item.disFavor,
                ':inFavor': item.inFavor,
                ':text': item.text
            }
        };
        logger.info("Update item params", params);
        await this.docClient.update(params).promise();
    }

    async getAllByUserId(userId: string): Promise<ScratchItem[]> {
        return this.getAllByUserIdWithQuery(userId);
    }

    async getAllAvailables(): Promise<ScratchItem[]> {
        const params = {
            TableName: this.scratchTable,
            IndexName: this.availableIndex,
            KeyConditionExpression: 'available = :u',
            ExpressionAttributeValues: {
                ':u': "yes"
            }
        };

        const result = await this.docClient.query(params).promise();
        return result.Items as ScratchItem[]
    }

    async getAllByUserIdWithQuery(userId: string): Promise<ScratchItem[]> {
        const params = {
            TableName: this.scratchTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :u',
            ExpressionAttributeValues: {
                ':u': userId
            }
        };

        const result = await this.docClient.query(params).promise();
        return result.Items as ScratchItem[]
    }

    async getAllByUserIdWithScan(userId: string): Promise<ScratchItem[]> {
        const params = {
            TableName: this.scratchTable,
            IndexName: this.userIdIndex,
            FilterExpression: 'userId=:u',
            ExpressionAttributeValues: { ':u': userId }
        };

        const result = await this.docClient.scan(params).promise();
        return result.Items as ScratchItem[]
    }
}
