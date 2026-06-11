import express from "express";
import { hanldeRegister, handleLogin } from "../controller/apiController";
import {
  getAllUser,
  handleCreateNewUser,
  getUserWithId,
  handleUpdateUser,
} from "../controller/userController";
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
  router.get("/user/read-detail/:id", getUserWithId);
  router.put("/user/update/:id", handleUpdateUser);

  //Group
  router.get("/group/read", getAllGroup);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
