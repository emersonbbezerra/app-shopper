import { NextFunction, Request, Response } from 'express';
import {
  DomainException,
  DriverNotFoundException,
  InvalidDataException,
  InvalidDistanceException,
  InvalidDriverException,
  NoRidesFoundException,
} from '../exceptions/DomainExceptions';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof InvalidDataException) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: error.message,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors: (error as any).issues,
    });
  }

  if (error instanceof DriverNotFoundException) {
    return res.status(404).json({
      error_code: 'DRIVER_NOT_FOUND',
      error_description: error.message,
    });
  }

  if (error instanceof InvalidDistanceException) {
    return res.status(406).json({
      error_code: 'INVALID_DISTANCE',
      error_description: error.message,
    });
  }

  if (error instanceof InvalidDriverException) {
    return res.status(400).json({
      error_code: 'INVALID_DRIVER',
      error_description: error.message,
    });
  }

  if (error instanceof NoRidesFoundException) {
    return res.status(404).json({
      error_code: 'NO_RIDES_FOUND',
      error_description: error.message,
    });
  }

  if (error instanceof DomainException) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: error.message,
    });
  }

  return res.status(500).json({
    error_code: 'UNKNOWN_ERROR',
    error_description: 'Um erro desconhecido ocorreu',
  });
};
