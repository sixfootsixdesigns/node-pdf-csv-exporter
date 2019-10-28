import { buildResponseBody } from '../../../lib/response';
import { getRepository } from 'typeorm';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import { ExportFile, ExportFileStatus } from '../../../entity/ExportFile';
import { validate } from 'class-validator';
import { ValidationError } from '../../../lib/error';

async function insert(ctx: Koa.ParameterizedContext) {
  const repository = getRepository(ExportFile);
  const { data, ...exportFile } = ctx.request.body;

  if (!data) {
    throw new ValidationError('You must send data');
  }

  const file = repository.create(exportFile);
  const errors = await validate(file);

  if (errors.length > 0) {
    throw new ValidationError('Invalid data', this);
  } else {
    const result = await repository.save(file);
    const singularResult = Array.isArray(result) ? result[0] : result;
    singularResult.processExport(data);
    ctx.body = buildResponseBody(result);
  }
}

async function updateById(ctx: Koa.ParameterizedContext) {
  const repository = getRepository(ExportFile);
  const fileData = await repository.findOneOrFail(ctx.params.id);

  repository.merge(fileData, ctx.request.body);

  const errors = await validate(fileData);

  if (errors.length > 0) {
    throw new ValidationError('Invalid data', this);
  } else {
    const results = await repository.save(fileData);
    ctx.body = buildResponseBody(results);
  }
}

async function getDownloadLinkById(ctx: Koa.ParameterizedContext) {
  const repository = getRepository(ExportFile);
  const fileData = await repository.findOneOrFail(ctx.params.id);
  ctx.body = buildResponseBody({ downloadUrl: fileData.getDownloadUrl() });
}

async function getById(ctx: Koa.ParameterizedContext) {
  const repository = getRepository(ExportFile);
  const fileData = await repository.findOneOrFail(ctx.params.id);
  ctx.body = buildResponseBody(fileData);
}

export const initFileRoutes = (router: Router) => {
  router.post('/file/create', insert);
  router.put('/file/update/:id', updateById);
  router.get('/file/download/:id', getDownloadLinkById);
  router.get('/file/:id', getById);
};
