import { FileModel } from '../../../models/file/file-model';
import { User } from '../../../lib/user';
import * as AWS from 'aws-sdk';
import { Exporter } from './exporter';
import { ExportStatus } from './export-types';

const processExport = async (file: FileModel, data: any, user: User): Promise<void> => {
  const s3Options: AWS.S3.ClientConfiguration = { region: process.env.AWS_REGION };

  if (process.env.AWS_ENDPOINT) {
    s3Options.endpoint = `http://${process.env.AWS_ENDPOINT}:4572`;
    s3Options.s3ForcePathStyle = true;
  }

  const exporter = new Exporter(new AWS.S3(s3Options), file, user, data);

  try {
    await exporter.export();
    file.status = ExportStatus.SUCCESS;
    await file.update(file.uuid);
  } catch (ex) {
    console.log('error', ex);
    file.status = ExportStatus.FAILED;
    await file.update(file.uuid);
  }
};

export const insert = async (file: FileModel, data: any, currentUser: User): Promise<FileModel> => {
  const fileResult: FileModel = await file.insert();
  processExport(file, data, currentUser);
  return fileResult;
};
