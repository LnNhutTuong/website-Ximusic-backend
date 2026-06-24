require("dotenv").config();
import { response } from "express";
import jwt from "jsonwebtoken";
import { match } from "path-to-regexp";
const createJwt = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.log(">>>>>>>>Check error: ", error);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;

  try {
    decoded = jwt.verify(token, key);
  } catch (e) {
    console.log(">>>Check error: ", e);
  }
  return decoded;
};
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkJWT = (req, res, next) => {
  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);

  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;

    let decoded = verifyToken(token);

    if (decoded) {
      req.user = decoded;
      console.log(">>>>>>>>check user: ", req.user);
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        EM: "Invalid token",
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "Token not found",
      DT: "",
    });
  }
};

const checkPermission = (req, res, next) => {
  if (req.user) {
    let email = req.user.email;
    let roles = req.user.groupWithRoles.Roles;
    let currentUrl = req.path;

    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EC: -1,
        EM: `You don't have permission to access this resource...`,
        DT: "",
      });
    }

    let canAccess = roles.some((item) => {
      return match(item.url)(currentUrl);
    });

    if (canAccess) {
      next();
    } else {
      return res.status(403).json({
        EC: -1,
        EM: `You don't have permission to access this URL, please stop baby ♥...`,
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "Token not found",
      DT: "",
    });
  }
};

module.exports = {
  createJwt,
  verifyToken,
  checkJWT,
  checkPermission,
};
