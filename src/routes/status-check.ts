import { buildResponseBody } from '../lib/response';

export const statusCheck = async (ctx, next) => {
  const body = buildResponseBody("It's up");
  ctx.body = body;
};
