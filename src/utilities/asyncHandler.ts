/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

const asyncHandler =
  (reqHandlerfunction: (req: Request<any>, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(reqHandlerfunction(req, res, next)).catch((error) => next(error));
  };

export { asyncHandler };
