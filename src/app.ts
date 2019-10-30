import * as express from 'express';
import * as bodyParser from 'body-parser';
import { statusCheck } from './routes/status-check';
import { fileRoutes } from './routes/api/file/file-routes';
import { errorHandler, corsRules } from './middleware';
import * as helmet from 'helmet';
import * as cors from 'cors';
import { checkJwt } from './middleware/checkJwt';

export const createApp = (): express.Express => {
  const app = express();
  app.use(helmet());
  app.use(cors(corsRules));
  app.use(bodyParser.json());
  app.use('/api', checkJwt, fileRoutes);
  app.get('/status-check', statusCheck);
  app.use(errorHandler);
  return app;
};
