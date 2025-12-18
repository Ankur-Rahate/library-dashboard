import { config } from "../config/config.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorizationtoken is require"));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = jwt.verify(parsedToken, config.jwtSecret);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return next(createHttpError(401, "Token Expired"));
  }
};

export default authenticate;

