import { fileData } from '../../../db/data/files';
import { NotFoundError } from '../../../lib/error';
import { FileModel } from '../../../models/file/file-model';
import { S3 } from 'aws-sdk';

export const download = async (id: number, uuid: string): Promise<string> => {
  const file = await fileData.byId(id, uuid, false);

  if (!file) {
    throw new NotFoundError('File not found.');
  }

  const fileModel = new FileModel(file);

  const s3 = new S3();
  const expireSeconds = 300; // 5 minutes. Has to be long enough to download the file.
  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_EXPORT_PROCESSED_BUCKET,
    Key: `${fileModel.getFileName()}.${fileModel.type}`,
    Expires: expireSeconds,
  });

  return url;
};
