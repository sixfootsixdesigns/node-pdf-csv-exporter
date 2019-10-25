import * as Router from 'koa-router';
import { initFileRoutes } from './file/file-routes';

export const initApiRoutes = mainRouter => {
  const apiRouter: Router = new Router();

  initFileRoutes(apiRouter);

  mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
};
