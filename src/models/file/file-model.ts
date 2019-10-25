import { NotFoundError } from '../../lib/error';
import { fileData } from '../../db/data/files';
import { fileMapping } from './file-column-mapping';

export interface FileModel {
  id: number;
  uuid: string;
  name: string;
  type: string;
  path: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  size: string;
}

export class FileModel implements FileModel {
  public id: number;
  public uuid: string;
  public name: string;
  public type: string;
  public path: string;
  public status: string;
  public created_at: string;
  public updated_at: string;
  public deleted_at: string;
  public size: string;
  public static table = 'files';
  public static colums = [
    'created_at',
    'deleted_at',
    'id',
    'name',
    'path',
    'size',
    'status',
    'type',
    'updated_at',
    'uuid',
  ];
  public static fillable = ['deleted_at', 'id', 'name', 'path', 'size', 'status', 'type', 'uuid'];
  public static readable = [
    'created_at',
    'deleted_at',
    'id',
    'name',
    'path',
    'size',
    'status',
    'type',
    'updated_at',
    'uuid',
  ];

  constructor(fields = {}) {
    Object.keys(fields).forEach(f => {
      this[f] = fields[f];
    });
  }

  public setField(field: string, value: any): void {
    this[field] = value;
  }

  public getFieldValue(field: string): any {
    return this[field] || null;
  }

  public getFileName(): string {
    return this.type && this.id ? `${this.type}-export-${this.id}` : null;
  }

  public setFieldsFromRequest(obj: object): void {
    for (const field in obj) {
      if (obj.hasOwnProperty(field) && fileMapping.columns.includes(field)) {
        this.setField(field, obj[field]);
      }
    }
  }

  public async insert(): Promise<FileModel> {
    const result = await fileData.insert(this);
    this.setField('id', result[0].id);
    this.setField('created_at', result[0].created_at || null);
    this.setField('updated_at', result[0].updated_at || null);
    return this;
  }

  public async update(uuid: string): Promise<FileModel> {
    const result = await fileData.update(this, uuid);

    if (!result || !result.length) {
      throw new NotFoundError(`File not found.`, this);
    }

    this.setField('updated_at', result[0].updated_at || null);
    this.setField('deleted_at', result[0].deleted_at || null);

    return this;
  }
}
