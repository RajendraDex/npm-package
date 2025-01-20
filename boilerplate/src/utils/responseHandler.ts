// utils/responseHandler.ts

import { Request, Response } from 'express';
import { ErrorMessages } from '../enums/responseMessages';
import { ResponseCodes } from '../enums/responseCodes';

export const handleSuccess = (res: Response, data: any, message: string, code: number = ResponseCodes.OK) => {
  return res.status(code).json({
    message,
    data,
  });
};

export const handleError = (res: Response, error: unknown, customMessages: Record<string, string>) => {
  if (error instanceof Error) {
    const message = customMessages[error.message] || ErrorMessages.InternalServerError;
    const statusCode = Object.keys(customMessages).includes(error.message)
      ? ResponseCodes.NOT_FOUND
      : ResponseCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({ message });
  }
  return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.UnknownError });
};
