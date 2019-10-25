import { expect } from 'chai';
import { buildResponseBody } from '../../lib/response';

describe('response', () => {
  it('should have correct properties when not sending status', () => {
    const data = {
      name: 'foo',
    };

    const resp = buildResponseBody(data);

    expect(resp).to.deep.equal({
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

    expect(resp).to.deep.equal({
      message: 'GOOD',
      data: {
        name: 'foo',
      },
    });
  });
});
