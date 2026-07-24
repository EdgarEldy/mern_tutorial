const catchAsync = require('../../src/shared/utils/catchAsync');

describe('catchAsync', () => {
  it('calls next with the error when the async fn rejects', async () => {
    const err = new Error('async failure');
    const handler = catchAsync(async () => { throw err; });
    const next = jest.fn();

    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it('does not call next when the async fn resolves', async () => {
    const handler = catchAsync(async (req, res) => { res.sent = true; });
    const next = jest.fn();
    const res = {};

    await handler({}, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sent).toBe(true);
  });
});
