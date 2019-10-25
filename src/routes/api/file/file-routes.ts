import * as InsertController from './insert-controller';
import * as SearchController from './search-controller';
import * as UpdateController from './update-controller';
import * as DownloadController from './download-controller';
import { buildResponseBody } from '../../../lib/response';
import { ValidationError } from '../../../lib/error';
import { FileModel } from '../../../models/file/file-model';
import { FileBuilder } from '../../../models/file/file-builder';

async function insert(ctx, next) {
  const file: FileModel = FileBuilder.buildFileFromRequest(ctx.request.body);
  const fileJson = ctx.request.body.data || null;

  if (!fileJson) {
    throw new ValidationError('No file data sent.');
  }

  if (!file.uuid) {
    throw new ValidationError('UUID not sent.', this);
  }

  if (!file.name) {
    throw new ValidationError('Name is required.', this);
  }

  const result: any = await InsertController.insert(file, fileJson, ctx.state.user);

  ctx.body = buildResponseBody({
    id: result.id,
  });
}

async function update(ctx, next) {
  const file: FileModel = FileBuilder.buildFileFromRequest(ctx.request.body);
  const result: any = await UpdateController.update(file, file.uuid);
  ctx.body = buildResponseBody({
    id: result.id,
  });
}

async function search(ctx, next) {
  ctx.query.uuid = 'foo';
  const results = await SearchController.search(ctx.query);
  ctx.body = buildResponseBody(results);
}

async function downloadLink(ctx, next) {
  if (!ctx.query.fileId) {
    throw new ValidationError('Missing file id.');
  }
  const uuid = 'foo';
  const url = await DownloadController.download(ctx.query.fileId, uuid);
  ctx.body = buildResponseBody({ downloadUrl: url });
}

export const initFileRoutes = router => {
  router.post('/file/create', insert);
  router.post('/file/update', update);
  router.get('/file/download', downloadLink);
  router.get('/file', search);
};
