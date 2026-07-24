const apiResponse = require('../../src/shared/utils/apiResponse');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('apiResponse.success', () => {
  it('responds with 200 and success envelope by default', () => {
    const res = mockRes();
    apiResponse.success(res, 'OK', { id: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'OK', data: { id: 1 } });
  });

  it('omits data field when data is null', () => {
    const res = mockRes();
    apiResponse.success(res, 'Created', null, 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json.mock.calls[0][0]).not.toHaveProperty('data');
  });

  it('uses the provided statusCode', () => {
    const res = mockRes();
    apiResponse.success(res, 'Created', { id: 2 }, 201);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('apiResponse.error', () => {
  it('responds with 500 and error envelope by default', () => {
    const res = mockRes();
    apiResponse.error(res, 'Something went wrong');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Something went wrong' });
  });

  it('uses the provided statusCode', () => {
    const res = mockRes();
    apiResponse.error(res, 'Not Found', 404);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('includes errors field when provided', () => {
    const res = mockRes();
    apiResponse.error(res, 'Bad Request', 400, [{ field: 'name', msg: 'Required' }]);
    expect(res.json.mock.calls[0][0]).toHaveProperty('errors');
  });

  it('omits errors field when null', () => {
    const res = mockRes();
    apiResponse.error(res, 'Error', 500, null);
    expect(res.json.mock.calls[0][0]).not.toHaveProperty('errors');
  });
});
