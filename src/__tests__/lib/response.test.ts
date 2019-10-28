import { buildResponseBody } from '../../lib/response';

describe('response', () => {
  it('should have correct properties when not sending status', () => {
    const data = {
      name: 'foo',
    };

    const resp = buildResponseBody(data);

    expect(resp).toEqual({
      message: 'OK',
      data: {
        name: 'foo',
      },
    });
  });

  it('should have correct properties when sending status', () => {
    const data = {
      name: 'foo',
    };

    const resp = buildResponseBody(data, 'GOOD');

    expect(resp).toEqual({
      message: 'GOOD',
      data: {
        name: 'foo',
      },
    });
  });
});
