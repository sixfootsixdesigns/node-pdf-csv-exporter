import { expect } from 'chai';
import * as supertest from 'supertest';
import { getTestApp } from '../../../test.helpers';
import { File, ExportFileTypes } from '../../../../entity/File';

describe('File Routes', async () => {
  describe('Insert', () => {
    const endpoint = '/api/file/create';

    it('responds with error if nothing posted', async () => {
      const app = await getTestApp();

      const response = await supertest(app).post(endpoint);
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({
        status: 400,
        message: 'Invalid data',
      });
    });

    it('responds with error if file data is missing', async () => {
      const app = await getTestApp();

      const fileData: Partial<File> = {};
      const response = await supertest(app)
        .post(endpoint)
        .send(fileData);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Invalid data');
    });

    it('responds with error if file name is missing', async () => {
      const app = await getTestApp();

      const fileData: Partial<File> = {
        uuid: 'abc',
        name: '',
        type: ExportFileTypes.CSV,
      };

      const response = await supertest(app)
        .post(endpoint)
        .send(fileData);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Invalid data');
    });

    it('inserts new csv file', async () => {
      const app = await getTestApp();

      const fileData: Partial<File> = {
        uuid: 'abc',
        name: 'myfile',
        type: ExportFileTypes.CSV,
      };
      const response = await supertest(app)
        .post(endpoint)
        .send(fileData);
      const data = response.body.data;

      expect(response.status).to.equal(200);
      expect(data.id).to.not.equal(null);
      expect(data.status).to.equal('pending');
      expect(data.name).to.equal(fileData.name);
      expect(data.type).to.equal(fileData.type);
      expect(data.uuid).to.equal(fileData.uuid);
      expect(data.path).to.equal(null);
      expect(data.size).to.equal(null);
    });
  });
});
