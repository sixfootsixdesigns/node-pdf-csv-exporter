import { createApp } from '../app';
import * as http from 'http';
import { createConnection } from 'typeorm';

let app: http.Server;

export const getTestApp = async (): Promise<http.Server> => {
  if (app) {
    return app;
  }
  const connection = await createConnection();
  app = http.createServer(createApp(connection).callback());
  return app;
};
