import { buildResponseBody } from '../lib/response';
import * as express from 'express';

export const statusCheck = (req: express.Request, res: express.Response) => {
  res.json(buildResponseBody(`It's up`));
};
