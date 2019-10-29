import { ValidationError } from 'class-validator';

export const handleErrors = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      const message = 'Protected resource';
      ctx.state.error = err;
      ctx.throw(err.status, message);
    } else if (err.name === 'EntityNotFound' || err.name === 'NotFoundError') {
      ctx.status = 404;
      ctx.state.error = err;
      ctx.state.context = err.context || null;
      ctx.body = {
        status: ctx.status,
        message: err.message || 'Error',
      };
    } else if (err.name === 'ApiValidationError') {
      ctx.status = err.status;
      ctx.state.error = err;
      ctx.state.context = err.context || null;
      ctx.body = err.response;
    } else if (Array.isArray(err)) {
      ctx.body = {
        status: 400,
        message: {
          errors: err.reduce((acc: string[], err: ValidationError) => {
            return (acc = acc.concat(Object.values(err.constraints)));
          }, []),
        },
      };
    } else {
      ctx.status = 500;
      ctx.state.error = err;
      ctx.throw(500, err.message || err.detail, err.stack);
    }
  }
};
