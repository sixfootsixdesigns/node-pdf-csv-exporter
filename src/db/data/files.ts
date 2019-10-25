import { getFillable } from '../../lib/get-fillable';
import { connect } from '../connect';
import { FileModel } from '../../models/file/file-model';

const files = () => {
  return connect()(FileModel.table);
};

const insert = async (record: any) => {
  record = getFillable(record, FileModel.fillable);
  return files()
    .returning(['id'])
    .insert(record);
};

const scopedFiles = (uuid: string) => {
  return files().where('uuid', uuid);
};

const byId = (id: number, uuid: string, withDeleted: boolean) => {
  if (withDeleted) {
    return scopedFiles(uuid)
      .where('id', id)
      .first();
  }
  return scopedFiles(uuid)
    .where('id', id)
    .whereNull('deleted_at')
    .first();
};

const byIds = (ids: number[], uuid: string, withDeleted: boolean) => {
  if (withDeleted) {
    return scopedFiles(uuid).whereIn('id', ids);
  }
  return scopedFiles(uuid)
    .whereIn('id', ids)
    .whereNull('deleted_at');
};

const update = async (record: any, uuid: string) => {
  record = getFillable(record, FileModel.fillable);
  return byId(record.id, uuid, true)
    .returning(['id'])
    .update(record);
};

const softDelete = (ids: string[], uuid: string) => {
  return scopedFiles(uuid)
    .returning(['id'])
    .whereIn('id', ids)
    .update('deleted_at', new Date().toISOString());
};

const restore = (ids: string[], uuid: string) => {
  return scopedFiles(uuid)
    .returning(['id'])
    .whereIn('id', ids)
    .update('deleted_at', null);
};

// use softDelete unless you are absolutely sure you really need to delete the record
const destroy = (ids: string[], uuid: string) => {
  return scopedFiles(uuid)
    .whereIn('id', ids)
    .del();
};

export const fileData = {
  files,
  scopedFiles,
  byId,
  byIds,
  destroy,
  restore,
  softDelete,
  update,
  insert,
};
