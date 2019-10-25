import { FileModel } from './file-model';
import { ValidationError } from '../../lib/error';

export class FileBuilder {
  public static buildFileFromRequest(raw: any): FileModel {
    if (!raw || !Object.keys(raw).length) {
      throw new ValidationError('You must send a file.');
    }
    return this.buildFromObject(raw);
  }

  public static buildFromObject(rawObject: any): FileModel {
    const file: FileModel = new FileModel();
    file.setFieldsFromRequest(rawObject);
    return file;
  }
}
