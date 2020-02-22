import 'source-map-support/register'
import { APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../infra/logger/logger';
import { ScratchRepo } from '../../repository/ScratchRepo';
import { ScratchAccess } from '../../infra/dynamodb/ScratchAccess';
import { ScratchItem } from '../../domain/scratch/ScratchItem';

const logger = createLogger('getAllAvailable')
const repository = new ScratchRepo(new ScratchAccess());

const responseOK = (items: ScratchItem[]) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ items })
  }
};

const responseError = (e: any) => {
  return {
    statusCode: 500,
    body: e.message
  }
};

const getAllAvailableHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const result = await repository.getAllAvailables()
    return responseOK(result)
  }
  catch (e) {
    logger.error('Unable to fetch items', { e });
    return responseError(e)
  }
};

export const handler = middy(getAllAvailableHandler).use(cors({ credentials: true }));