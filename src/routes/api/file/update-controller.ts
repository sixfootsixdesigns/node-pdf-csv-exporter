import { FileModel } from '../../../models/file/file-model';
import { ValidationError } from '../../../lib/error';

export const update = async (file: FileModel, uuid: string): Promise<FileModel> => {
  if (!file.id) {
    throw new ValidationError('id is required.');
  }
  if (!uuid) {
    throw new ValidationError('uuid is required.');
  }

  return await file.update(file.uuid);
};
