export const getFillable = (raw: object, fillable: string[]): any => {
  if (!fillable || !fillable.length) {
    return raw;
  }

  return Object.keys(raw)
    .filter(key => fillable.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
};
