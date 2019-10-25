import * as Router from 'koa-router';
import { initFileRoutes } from './file/file-routes';
import { Connection } from 'typeorm';

export const initApiRoutes = (mainRouter: Router, connection: Connection) => {
  const apiRouter: Router = new Router();

  initFileRoutes(apiRouter, connection);

  mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
};
