import express from "express";
import { hanldeRegister, handleLogin } from "../controller/apiController";
import {
  getAllUser,
  handleCreateNewUser,
  getUserWithId,
  handleUpdateUser,
  handleDelete,
} from "../controller/userController";
import { getAllGroup } from "../controller/groupController";
const router = express.Router();

/**
 * @param {*} app: express app
 */

const testMiddleware = (req, res, next) => {
  console.log(">>>>>>calling a middleware");
  next();
};

const initApiRoutes = (app) => {
  //Register
  router.post("/register", hanldeRegister);

  //Login
  router.post("/login", testMiddleware, handleLogin);

  //User
  router.get("/user/read", getAllUser);
  router.post("/user/create", handleCreateNewUser);
  router.get("/user/read-detail/:id", getUserWithId);
  router.put("/user/update/:id", handleUpdateUser);
  router.delete("/user/delete/:id", handleDelete);
  //Group
  router.get("/group/read", getAllGroup);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
