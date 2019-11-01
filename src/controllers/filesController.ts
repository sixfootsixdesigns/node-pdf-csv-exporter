import { buildResponseBody } from '../lib/response';
import { getRepository } from 'typeorm';
import * as express from 'express';
import { ExportFile } from '../entity/ExportFile';
import { ApiValidationError } from '../lib/apiValidationError';

const insert = async (req: express.Request, res: express.Response) => {
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
};

const updateById = async (req: express.Request, res: express.Response) => {
  const repository = getRepository(ExportFile);
  const fileData = await repository.findOneOrFail(req.params.id);

  repository.merge(fileData, req.body);

  const results = await repository.save(fileData);

  res.json(buildResponseBody(results));
};

const getDownloadLinkById = async (req: express.Request, res: express.Response) => {
  const repository = getRepository(ExportFile);

  const fileData = await repository.findOneOrFail(req.params.id);

  res.json(buildResponseBody({ downloadUrl: fileData.getDownloadUrl() }));
};

const getById = async (req: express.Request, res: express.Response) => {
  const repository = getRepository(ExportFile);
  const fileData = await repository.findOneOrFail(req.params.id);
  res.json(buildResponseBody(fileData));
};

export const filesController = {
  getById,
  getDownloadLinkById,
  insert,
  updateById,
};
