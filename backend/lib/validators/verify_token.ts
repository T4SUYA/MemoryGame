import environment from "../environment";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Acess denied");

  try {
    jwt.verify(token, environment.getSecret());
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}
