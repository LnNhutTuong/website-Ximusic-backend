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
import { checkJWT, checkPermission } from "../middleware/JWTAction";
const router = express.Router();

/**
 * @param {*} app: express app
 */

// const checkUserLogin = (req, res, next) => {
//   const nonSecurePaths = ["/", "/register", "/login"];
//   if (nonSecurePaths.includes(req.path)) return next();

//   //authenticate user
//   if (user) {
//     next();
//   } else {
//   }
// };

const initApiRoutes = (app) => {
  //Register
  router.post("/register", hanldeRegister);

  //Login
  router.post("/login", handleLogin);

  //User
  router.get("/user/read", checkJWT, checkPermission, getAllUser);
  router.post("/user/create", handleCreateNewUser);
  router.get("/user/read-detail/:id", getUserWithId);
  router.put("/user/update/:id", handleUpdateUser);
  router.delete("/user/delete/:id", handleDelete);
  //Group
  router.get("/group/read", getAllGroup);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
