import express from "express";
import { hanldeRegister, handleLogin } from "../controller/apiController";
import {
  getAllUser,
  handleCreateNewUser,
  getUserWithId,
  handleUpdateUser,
  handleDelete,
  getUserAccount,
} from "../controller/userController";
import { getAllGroup } from "../controller/groupController";
import { checkJWT, checkPermission } from "../middleware/JWTAction";
const router = express.Router(); // router cha

/**
 * @param {*} app: express app
 */

const initApiRoutes = (app) => {
  const privateRouter = express.Router(); // router con
  const publicRouter = express.Router(); // router con

  //PUBLIC ROUTE
  //Account
  publicRouter.get("/account", checkJWT, getUserAccount);
  //Register
  publicRouter.post("/register", hanldeRegister);
  //Login
  publicRouter.post("/login", handleLogin);

  router.use(publicRouter);

  //OUTLINE

  //PRIVATE ROUTE
  //middleware
  privateRouter.use(checkJWT);
  privateRouter.use(checkPermission);

  //User
  privateRouter.get("/user/read", getAllUser);
  privateRouter.post("/user/create", handleCreateNewUser);
  privateRouter.get("/user/read-detail/:id", getUserWithId);
  privateRouter.put("/user/update/:id", handleUpdateUser);
  privateRouter.delete("/user/delete/:id", handleDelete);

  //Group
  privateRouter.get("/group/read", getAllGroup);

  router.use(privateRouter);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
