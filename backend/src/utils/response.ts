import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null
) => {
  const responsePayload: ApiResponse<T> = {
    success,
    message,
    data,
  };
  return res.status(statusCode).json(responsePayload);
};
