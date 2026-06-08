import express from "express";
import { hanldeRegister, handleLogin } from "../controller/apiController";
import { getAllUser } from "../controller/userController";
const router = express.Router();

/**
 * @param {*} app: express app
 */

const initApiRoutes = (app) => {
  //Register
  router.post("/register", hanldeRegister);

  //Login
  router.post("/login", handleLogin);

  //User
  router.get("/user/read", getAllUser);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
