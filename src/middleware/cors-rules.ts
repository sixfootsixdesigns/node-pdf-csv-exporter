const isAllowedCorsOrigin = (origin: string) => {
  const dynamicOrigins = [/^http:\/\/localhost:\d{4}$/];
  const allowedOrigins = ['null'];

  const isAllowedDomain = dynamicOrigins.some(domain => {
    return origin ? origin.match(domain) : false;
  });

  if (isAllowedDomain || allowedOrigins.indexOf(origin) !== -1) {
    return true;
  }
  return false;
};

export const corsRules = req => {
  if (isAllowedCorsOrigin(req.headers.origin)) {
    return req.headers.origin;
  }
  return false;
};
