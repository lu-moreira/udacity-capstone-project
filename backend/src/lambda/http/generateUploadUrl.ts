import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { recoverS3PreSignedUrl } from '../../infra/s3/s3';

const responseOK = (uploadUrl: string) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
  }
};

const generateUploadUrlHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters.scratchId
  const uploadUrl = recoverS3PreSignedUrl(id)
  return responseOK(uploadUrl)
};

export const handler = middy(generateUploadUrlHandler).use(cors({ credentials: true }));