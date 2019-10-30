import { createApp } from '../app';
import * as http from 'http';
import { createConnection } from 'typeorm';

let app: http.Server;

export const getTestApp = async (): Promise<http.Server> => {
  if (app) {
    return app;
  }
  await createConnection();
  app = http.createServer(createApp());
  return app;
};
