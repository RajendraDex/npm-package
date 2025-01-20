import { Request, Response, NextFunction } from 'express';
import { logger } from '../../src/utils/logger';
import { apiMiddleware } from '../../src/middlewares/core/loggerMiddleware';

jest.mock('../../src/utils/logger');

describe('apiMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { method: 'GET', url: '/test', headers: {}, body: { key: 'value' } };
    res = {
      statusCode: 200,
      json: jest.fn(),
      on: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should log incoming request and outgoing response', () => {
    apiMiddleware(req as Request, res as Response, next);

    expect(logger.info).toHaveBeenCalledWith(
      'Incoming request: GET /test',
      expect.any(Object)
    );

    const jsonBody = { result: 'success' };
    res.json!(jsonBody);

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Outgoing response: GET /test - Status: 200'),
      expect.any(Object)
    );
    expect(next).toHaveBeenCalled();
  });

  it('should log non-JSON responses', () => {
    apiMiddleware(req as Request, res as Response, next);

    const finishCallback = (res.on as jest.Mock).mock.calls[0][1];
    finishCallback();

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Outgoing response: GET /test - Status: 200 - Duration:')
    );
  });
});