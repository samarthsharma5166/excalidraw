import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import {JWT_SECRET} from '@repo/backend-common/config'
export function middleware(req: Request, res: Response,next:NextFunction) {
  // @ts-ignore
  const token = req?.headers.authorization
  console.log("dfjahs",token);
  if (!token) {
    res.status(401).json({
      message: "unauthorized",
    });
    return;
  }
  const decode = jwt.verify(token, JWT_SECRET);

  if (!decode) {
    res.status(401).json({
      message: "unauthorized",
    });
    return;
  }
  // @ts-ignore
  req.user = decode as {id: string; email: string; };
  next()
}