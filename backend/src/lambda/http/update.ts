import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../infra/logger/logger';
import { ScratchRepo } from '../../repository/ScratchRepo';
import { ScratchAccess } from '../../infra/dynamodb/ScratchAccess';
import { ScratchItemUpdateRequest } from '../../contracts/ScratchItemUpdateRequest';

const logger = createLogger('update')
const repository = new ScratchRepo(new ScratchAccess());

const responseOK = () => {
  return {
    statusCode: 204,
    body: ''
  }
};

const responseError = (e: any) => {
  return {
    statusCode: 500,
    body: e.message
  }
};

const updateHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.scratchId
  try {
    const item: ScratchItemUpdateRequest = JSON.parse(event.body)
    await repository.updateById(id, item)
    logger.info('Updated item', { id });
    return responseOK()
  }
  catch (e) {
    logger.error('Unable to update item', { e });
    return responseError(e)
  }
};

export const handler = middy(updateHandler).use(cors({ credentials: true }));