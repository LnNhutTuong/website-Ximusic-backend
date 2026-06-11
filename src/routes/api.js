import express from "express";
import { hanldeRegister, handleLogin } from "../controller/apiController";
import { getAllUser, handleCreateNewUser } from "../controller/userController";
import { getAllGroup } from "../controller/groupController";
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
  router.post("/user/create", handleCreateNewUser);

  //Group
  router.get("/group/read", getAllGroup);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
