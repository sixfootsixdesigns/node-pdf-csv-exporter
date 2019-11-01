import { checkJwt } from './middleware/checkJwt';
import { corsRules } from './middleware/corsRules';
import { errorHandler } from './middleware/errorHandler';
import { fileRoutes } from './routes/api/fileRoutes';
import { statusCheck } from './routes/statusCheck';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as helmet from 'helmet';
import * as winston from 'winston';

export const createApp = (): express.Express => {
  const app = express();
  app.use(helmet());
  app.use(cors(corsRules));
  app.use(bodyParser.json());
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    })
  );
  app.use('/api', checkJwt, fileRoutes);
  app.get('/status-check', statusCheck);
  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    })
  );
  app.use(errorHandler);
  return app;
};
