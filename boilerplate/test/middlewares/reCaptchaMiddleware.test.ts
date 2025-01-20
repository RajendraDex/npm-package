import { Request, Response, NextFunction } from 'express';
import { captchaMiddleware } from '..../../../src/middlewares/core/reCaptchaMiddleware';
import { ErrorMessages } from '../../src/enums/responseMessages';


// Mock fetch function
global.fetch = jest.fn();

describe('captchaMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = { header: jest.fn() };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should return 400 if reCAPTCHA token is missing', async () => {
    mockRequest.header = jest.fn().mockReturnValue(undefined);
    await captchaMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: 400,
      success: false,
      message: ErrorMessages.MissingRecaptchaToken,
    });
  });

  it('should return 400 if reCAPTCHA verification fails', async () => {
    mockRequest.header = jest.fn().mockReturnValue('mock-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: false, score: 0.3 }),
    });

    await captchaMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: 400,
      success: false,
      message: ErrorMessages.InvalidRecaptchaToken,
    });
  });

  it('should call next() if reCAPTCHA verification succeeds', async () => {
    mockRequest.header = jest.fn().mockReturnValue('mock-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true, score: 0.8 }),
    });

    await captchaMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs during verification', async () => {
    mockRequest.header = jest.fn().mockReturnValue('mock-token');
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await captchaMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: 500,
      success: false,
      message: ErrorMessages.RecaptchaVerificationFailed,
    });
  });
});