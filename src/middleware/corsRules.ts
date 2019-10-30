import * as cors from 'cors';

const isAllowedCorsOrigin = (origin: string) => {
  const dynamicOrigins = [/^http:\/\/localhost:\d{4}$/];
  const allowedOrigins = ['null'];

  const isAllowedDomain = dynamicOrigins.some(domain => {
    return origin ? origin.match(domain) : false;
  });

  if (origin === undefined || isAllowedDomain || allowedOrigins.indexOf(origin) !== -1) {
    return true;
  }
  return false;
};

export const corsRules: cors.CorsOptions = {
  origin: (origin: string, callback: any) => {
    if (isAllowedCorsOrigin(origin)) {
      callback(null, null);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
