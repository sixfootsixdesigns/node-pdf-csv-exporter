import { buildResponseBody } from '../../../lib/response';
import { getRepository } from 'typeorm';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import { File, ExportStatus } from '../../../entity/File';
import { validate } from 'class-validator';
import { ValidationError } from '../../../lib/error';
import { getDownloadUrl } from '../../../lib/getDownloadUrl';
import * as AWS from 'aws-sdk';
import { Exporter } from '../../../lib/exporter';

async function processExport(file: File | File[], data: any): Promise<void> {
  if (Array.isArray(file)) {
    file = file[0];
  }
  const s3Options: AWS.S3.ClientConfiguration = { region: process.env.AWS_REGION };

  if (process.env.AWS_ENDPOINT) {
    s3Options.endpoint = `http://${process.env.AWS_ENDPOINT}:4572`;
    s3Options.s3ForcePathStyle = true;
  }

  const exporter = new Exporter(new AWS.S3(s3Options), file, data);

  try {
    const result = await exporter.export();
    file.status = ExportStatus.SUCCESS;
    file.size = result.size;
  } catch (ex) {
    file.status = ExportStatus.FAILED;
  }

  await file.save();
}

async function insert(ctx: Koa.ParameterizedContext) {
  const repository = getRepository(File);
  const { data, ...exportFile } = ctx.request.body;

  const file = repository.create(exportFile);
  const errors = await validate(file);

  if (errors.length > 0) {
    throw new ValidationError('Invalid data', this);
  } else {
    const results = await repository.save(file);
    processExport(file, data); // do this async
    ctx.body = buildResponseBody(results);
  }
}

async function updateById(ctx: Koa.ParameterizedContext) {
  const repository = getRepository(File);
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
  const repository = getRepository(File);
  const fileData = await repository.findOneOrFail(ctx.params.id);
  ctx.body = buildResponseBody({ downloadUrl: getDownloadUrl(fileData) });
}

async function getById(ctx: Koa.ParameterizedContext) {
  const repository = getRepository(File);
  const fileData = await repository.findOneOrFail(ctx.params.id);
  ctx.body = buildResponseBody(fileData);
}

export const initFileRoutes = (router: Router) => {
  router.post('/file/create', insert);
  router.put('/file/update/:id', updateById);
  router.get('/file/download/:id', getDownloadLinkById);
  router.get('/file/:id', getById);
};
