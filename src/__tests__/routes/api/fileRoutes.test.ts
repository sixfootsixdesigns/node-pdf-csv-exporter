import * as supertest from 'supertest';
import {
  ExportFile,
  ExportFileTypes,
  ExportFileWithData,
  ExportFileStatus,
} from '../../../entity/ExportFile';
import { getTestApp } from '../../../helpers/test.helpers';
import { getRepository } from 'typeorm';

describe('File Routes', () => {
  describe('Insert /api/file/create', () => {
    it('no post data', async () => {
      const app = await getTestApp();
      const response = await supertest(app).post(`/api/file/create`);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        status: 400,
        message: 'You must send data',
      });
    });

    it('post data is empty', async () => {
      const app = await getTestApp();
      const fileData: Partial<ExportFileWithData> = {};
      const response = await supertest(app)
        .post(`/api/file/create`)
        .send(fileData);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        status: 400,
        message: 'You must send data',
      });
    });

    it('validates file', async () => {
      const app = await getTestApp();
      const fileData: Partial<ExportFileWithData> = {
        uuid: 'abc',
        name: '',
        type: ExportFileTypes.CSV,
        data: { csvData: [] },
      };
      const response = await supertest(app)
        .post(`/api/file/create`)
        .send(fileData);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        status: 400,
        message: 'Invalid data',
      });
    });

    it('validates data', async () => {
      const app = await getTestApp();
      const fileData: Partial<ExportFileWithData> = {
        uuid: 'abc',
        name: '',
        type: ExportFileTypes.CSV,
      };
      const response = await supertest(app)
        .post(`/api/file/create`)
        .send(fileData);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        status: 400,
        message: 'You must send data',
      });
    });

    it.only('inserts', async () => {
      const app = await getTestApp();
      const fileData: Partial<ExportFileWithData> = {
        uuid: 'abc',
        name: 'myfile',
        type: ExportFileTypes.CSV,
        data: {
          csvFields: ['name', 'city', 'state'],
          csvData: [
            {
              name: 'bob',
              city: 'Denver',
              state: 'Colorado',
            },
            {
              name: 'dave',
              city: 'Lakewood',
              state: 'Colorado',
            },
          ],
        },
      };
      const response = await supertest(app)
        .post(`/api/file/create`)
        .send(fileData);
      const data = response.body.data;

      expect(response.status).toEqual(200);
      expect(data.id).not.toEqual(null);
      expect(data.status).toEqual(ExportFileStatus.PENDING);
      expect(data.name).toEqual(fileData.name);
      expect(data.type).toEqual(fileData.type);
      expect(data.uuid).toEqual(fileData.uuid);
      expect(data.path).toEqual(null);
    });
  });

  describe('getById api/file/:id', () => {
    it('missing', async () => {
      const app = await getTestApp();
      const repository = getRepository(ExportFile);
      const fileData: Partial<ExportFile> = {
        uuid: 'abc',
        name: 'theFile',
        type: ExportFileTypes.CSV,
      };
      await repository.create(fileData).save();
      const response = await supertest(app).get(`/api/file/0`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        status: 404,
        message: 'Could not find any entity of type "ExportFile" matching: "0"',
      });
    });

    it('responds with file', async () => {
      const app = await getTestApp();
      const repository = getRepository(ExportFile);
      const fileData: Partial<ExportFile> = {
        uuid: 'abc',
        name: 'theFile',
        type: ExportFileTypes.CSV,
      };
      const result = await repository.create(fileData).save();
      const response = await supertest(app).get(`/api/file/${result.id}`);

      expect(response.status).toEqual(200);
      expect(response.body.data.id).toEqual(result.id);
    });
  });

  describe('updateById api/file/update/:id', () => {
    it('missing', async () => {
      const app = await getTestApp();
      const repository = getRepository(ExportFile);
      const fileData: Partial<ExportFile> = {
        uuid: 'abc',
        name: 'theFile',
        type: ExportFileTypes.CSV,
      };
      await repository.create(fileData).save();
      const response = await supertest(app).put(`/api/file/update/0`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        status: 404,
        message: 'Could not find any entity of type "ExportFile" matching: "0"',
      });
    });

    it('validates', async () => {
      const app = await getTestApp();
      const repository = getRepository(ExportFile);
      const fileData: Partial<ExportFile> = {
        uuid: 'abc',
        name: 'theFile',
        type: ExportFileTypes.CSV,
      };
      const result = await repository.create(fileData).save();
      const response = await supertest(app)
        .put(`/api/file/update/${result.id}`)
        .send({
          name: '',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        status: 400,
        message: 'Invalid data',
      });
    });

    it('updates', async () => {
      const app = await getTestApp();
      const repository = getRepository(ExportFile);
      const fileData: Partial<ExportFile> = {
        uuid: 'abc',
        name: 'theFile',
        type: ExportFileTypes.CSV,
      };
      const result = await repository.create(fileData).save();
      const response = await supertest(app)
        .put(`/api/file/update/${result.id}`)
        .send({
          name: 'otherFileName',
        });

      expect(response.status).toEqual(200);
      expect(response.body.data.id).toEqual(result.id);
      expect(response.body.data.name).toEqual('otherFileName');
    });
  });

  describe('get download link api/file/download/:id', () => {
    it('missing', async () => {
      const app = await getTestApp();
      const repository = getRepository(ExportFile);
      const fileData: Partial<ExportFile> = {
        uuid: 'abc',
        name: 'theFile',
        type: ExportFileTypes.CSV,
      };
      await repository.create(fileData).save();
      const response = await supertest(app).get(`/api/file/download/0`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        status: 404,
        message: 'Could not find any entity of type "ExportFile" matching: "0"',
      });
    });

    it('responds with download link', async () => {
      const app = await getTestApp();
      const repository = getRepository(ExportFile);
      const fileData: Partial<ExportFile> = {
        uuid: 'abc',
        name: 'theFile',
        type: ExportFileTypes.CSV,
      };
      const result = await repository.create(fileData).save();
      const response = await supertest(app).get(`/api/file/download/${result.id}`);

      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual({
        downloadUrl: 'https://s3.amazonaws.com/',
      });
    });
  });
});
