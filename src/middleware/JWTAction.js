require("dotenv").config();
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
  let data = null;

  try {
    let decoded = jwt.verify(token, key);
    data = decoded;
  } catch (e) {
    console.log(">>>Check error: ", err);
  }
  return data;
};

module.exports = {
  createJwt,
  verifyToken,
};
