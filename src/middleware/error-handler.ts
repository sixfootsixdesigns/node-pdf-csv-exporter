import { ValidationError, NotFoundError } from '../lib/error';

export const handleErrors = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      const message = 'Protected resource';
      ctx.state.error = err;
      console.log('info', message, err.status);
      ctx.throw(err.status, message);
    } else if (err instanceof ValidationError || err instanceof NotFoundError) {
      ctx.status = err.status;
      ctx.state.error = err;
      ctx.state.context = err.context || null;
      ctx.body = {
        status: ctx.status,
        message: err.message || 'Error',
      };
    } else {
      ctx.status = 500;
      ctx.state.error = err;
      console.log(err, '500');
      ctx.throw(500, err.message || err.detail, err.stack);
    }
  }
};
