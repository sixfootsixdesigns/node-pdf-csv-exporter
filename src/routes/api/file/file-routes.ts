import { buildResponseBody } from '../../../lib/response';
import { getRepository } from 'typeorm';
import * as express from 'express';
import { ExportFile } from '../../../entity/ExportFile';
import { ApiValidationError } from '../../../lib/apiValidationError';
import { asyncHandler } from '../../../middleware/asyncHandler';

async function insert(req: express.Request, res: express.Response) {
  const repository = getRepository(ExportFile);
  const { data, ...exportFile } = req.body;

  if (!data) {
    throw new ApiValidationError('You must send data');
  }

  const file = repository.create(exportFile);
  const result = await repository.save(file);

  const singularResult = Array.isArray(result) ? result[0] : result;

  singularResult.processExport(data).then(() => {
    // don't care
  });

  res.json(buildResponseBody(result));
}

async function updateById(req: express.Request, res: express.Response) {
  const repository = getRepository(ExportFile);
  const fileData = await repository.findOneOrFail(req.params.id);

  repository.merge(fileData, req.body);

  const results = await repository.save(fileData);

  res.json(buildResponseBody(results));
}

async function getDownloadLinkById(req: express.Request, res: express.Response) {
  const repository = getRepository(ExportFile);

  const fileData = await repository.findOneOrFail(req.params.id);

  res.json(buildResponseBody({ downloadUrl: fileData.getDownloadUrl() }));
}

async function getById(req: express.Request, res: express.Response) {
  const repository = getRepository(ExportFile);
  const fileData = await repository.findOneOrFail(req.params.id);
  res.json(buildResponseBody(fileData));
}

export const fileRoutes = express.Router();
fileRoutes.post('/file/create', asyncHandler(insert));
fileRoutes.put('/file/update/:id', asyncHandler(updateById));
fileRoutes.get('/file/download/:id', asyncHandler(getDownloadLinkById));
fileRoutes.get('/file/:id', asyncHandler(getById));
