import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../infra/logger/logger';
import { ScratchRepo } from '../../repository/ScratchRepo';
import { ScratchAccess } from '../../infra/dynamodb/ScrachAccess';
import { getUserIdFromJwt } from '../../infra/auth/utils';
import { ScratchItem } from '../../domain/scratch/ScratchItem';

const logger = createLogger('getAllByUserId')
const repository = new ScratchRepo(new ScratchAccess());

const responseOK = (result: ScratchItem[]) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ items: result })
  };
};

const responseError = (e: any) => {
  return {
    statusCode: 500,
    body: e.message
  }
};

const getByUserIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserIdFromJwt(event);
    const result = await repository.getByUserId(userId)
    return responseOK(result)
  }
  catch (e) {
    logger.error('Unable to fecth items', { e });
    return responseError(e)
  }
};

export const handler = middy(getByUserIdHandler).use(cors({ credentials: true }));

