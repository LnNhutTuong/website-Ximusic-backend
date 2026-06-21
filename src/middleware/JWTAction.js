require("dotenv").config();
import { response } from "express";
import jwt from "jsonwebtoken";

const createJwt = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key);
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

const checkJWT = (req, res, next) => {
  let cookies = req.cookies;

  if (cookies && cookies.jwt) {
    let token = cookies.jwt;
    let decoded = verifyToken(token);

    if (decoded) {
      req.user = decoded;
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
    let currenUrl = req.path;

    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EC: -1,
        EM: `You don't have permission to access this resource...`,
        DT: "",
      });
    }
    let canAccess = roles.some((item) => item.url === currenUrl);

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
