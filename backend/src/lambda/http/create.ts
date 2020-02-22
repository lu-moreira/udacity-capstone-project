import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { ScratchItemCreateRequest } from '../../contracts/ScratchItemCreateRequest';
import { ScratchRepo } from '../../repository/ScratchRepo';
import { ScratchAccess } from '../../infra/dynamodb/ScrachAccess';
import { createLogger } from '../../infra/logger/logger';
import { getUserIdFromJwt } from '../../infra/auth/utils';

const logger = createLogger('create')
const repository = new ScratchRepo(new ScratchAccess());

const responseOK = (item: any) => {
  return {
    statusCode: 201,
    body: JSON.stringify({ item })
  }
};

const responseError = (e: any) => {
  return {
    statusCode: 500,
    body: e.message
  }
}

const createHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const request = JSON.parse(event.body) as ScratchItemCreateRequest
    const userId = getUserIdFromJwt(event);
    var newItem = await repository.create(request, userId)
    logger.info("New item created", { item: newItem })
    return responseOK(newItem)
  }
  catch (e) {
    logger.error('Unable to create item', { e });
    return responseError(e)
  }
};

export const handler = middy(createHandler).use(cors({ credentials: true }));