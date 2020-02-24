import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../infra/logger/logger';
import { ScratchRepo } from '../../repository/ScratchRepo';
import { ScratchAccess } from '../../infra/dynamodb/ScratchAccess';
import { isLikeType } from '../../domain/scratch/ScratchItem';

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

const responseBadRequest = (msg: string) => {
    return {
      statusCode: 400,
      body: msg
    }
  };

const likeHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.scratchId
  const typeLike = event.pathParameters.typeLike

  if (!isLikeType(typeLike)) {
    return responseBadRequest("Invalid like type");
  }

  try {
    await repository.updateLike(id, typeLike)
    logger.info('Updated item', { id });
    return responseOK()
  }
  catch (e) {
    logger.error('Unable to update item', { e });
    return responseError(e)
  }
};

export const handler = middy(likeHandler).use(cors({ credentials: true }));