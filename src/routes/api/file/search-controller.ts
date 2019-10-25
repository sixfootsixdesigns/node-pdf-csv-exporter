import { ValidationError } from '../../../lib/error';

export const search = async (query: any) => {
  if (!query.uuid) {
    throw new ValidationError('uuid is required');
  }

  if (!query.orderBy) {
    query.orderBy = 'created_at,desc';
  }
};
