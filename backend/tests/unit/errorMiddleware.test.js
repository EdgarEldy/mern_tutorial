const errorMiddleware = require('../../src/middlewares/error.middleware');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorMiddleware', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });

  it('uses err.statusCode when set', () => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    const res = mockRes();

    errorMiddleware(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0]).toMatchObject({ success: false, message: 'Not Found' });
  });

  it('defaults to 500 when statusCode is not set', () => {
    const err = new Error('Unexpected');
    const res = mockRes();

    errorMiddleware(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('includes stack in development', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    const mw = require('../../src/middlewares/error.middleware');
    const err = new Error('Dev error');
    const res = mockRes();

    mw(err, {}, res, jest.fn());

    const body = res.json.mock.calls[0][0];
    expect(body.errors).toHaveProperty('stack');
  });

  it('omits stack in production', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    const mw = require('../../src/middlewares/error.middleware');
    const err = new Error('Prod error');
    const res = mockRes();

    mw(err, {}, res, jest.fn());

    const body = res.json.mock.calls[0][0];
    expect(body).not.toHaveProperty('errors');
  });
});
