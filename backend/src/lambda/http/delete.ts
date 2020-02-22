import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../infra/logger/logger'
import { ScratchAccess } from '../../infra/dynamodb/ScrachAccess'
import { ScratchRepo } from '../../repository/ScratchRepo'

const logger = createLogger('delete')
const repository = new ScratchRepo(new ScratchAccess());

const responseOk = () => {
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

const deleteHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.scratchId
  try {
    await repository.delete(id);
    logger.info('Deleted item', { id });
    return responseOk()
  }
  catch (e) {
    logger.error('Unable to delete item', { e });
    return responseError(e)
  }
};

export const handler = middy(deleteHandler).use(cors({ credentials: true }));
