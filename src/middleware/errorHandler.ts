import { Response, Request, NextFunction } from 'express';

const statusByErrorName = (errorName: string | undefined): number => {
  switch (errorName) {
    case 'EntityNotFound':
      return 404;
    case 'ApiValidationError':
      return 400;
    case 'ExportError':
    default:
      return 500;
  }
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && Array.isArray(err)) {
    res.statusCode = 400;
    res.json({
      errors: err.map((err: Error) => {
        return err.toString();
      }),
    });
  } else if (err) {
    res.statusCode = err.status || statusByErrorName(err.name);
    res.json({
      errors: [err.toString()],
    });
  } else {
    res.statusCode = 500;
    res.json({
      errors: ['Server error'],
    });
  }
};
