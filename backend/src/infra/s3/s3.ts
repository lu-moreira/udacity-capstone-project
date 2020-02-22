import * as AWS from 'aws-sdk';

const FILE_UPLOAD_S3_BUCKET = process.env.FILE_UPLOAD_S3_BUCKET
const CLOUD_REGION = process.env.CLOUD_REGION

export function recoverS3AttachmentURL(id: string) : string{
    return `https://${FILE_UPLOAD_S3_BUCKET}.s3.${CLOUD_REGION}.amazonaws.com/${id}`
}

export function recoverS3PreSignedUrl(id: string): string {
    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: FILE_UPLOAD_S3_BUCKET,
      Key: id,
      Expires: 600 // Expires in 600s
    })
    return uploadUrl
}