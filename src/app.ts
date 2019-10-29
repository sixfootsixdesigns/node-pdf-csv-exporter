import * as koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as cors from 'kcors';
import { statusCheck } from './routes/status-check';
import { handleErrors, corsRules } from './middleware';
import { initApiRoutes } from './routes/api/api-routes';

export const createApp = (): koa<koa.DefaultState, koa.DefaultContext> => {
  const app = new koa();
  const router = new Router();

  app.use(handleErrors);
  app.use(bodyParser());
  app.use(cors({ origin: corsRules, credentials: true }));

  initApiRoutes(router);
  router.get('/status-check', statusCheck);

  app.use(router.routes());

  return app;
};