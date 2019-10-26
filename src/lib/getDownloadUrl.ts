import { S3 } from 'aws-sdk';
import { File } from '../entity/File';

export const getDownloadUrl = async (file: File) => {
  const s3 = new S3();
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_EXPORT_BUCKET,
    Key: `${file.id}.${file.type}`,
    Expires: 300,
  });
};
