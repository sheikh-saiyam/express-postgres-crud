import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(500).json({
          success: false,
          message: "Not allowed to perform this action!",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;
      console.log({ decoded });

      req.user = decoded as JwtPayload;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(500).json({
          success: false,
          message: "Not allowed to perform this action. Unauthorized!",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error)?.message,
      });
    }
  };
};

export default auth;
