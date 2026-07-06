import express from "express";

import {
  handleRegister,
  handleLogin,
} from "../controller/admin/auth/authController";
import { checkJWT, checkPermission } from "../middleware/JWTAction";
import createUploadMiddleware from "../middleware/uploadMiddleware";
import { getAllGroup } from "../controller/admin/group/groupController";
import {
  getAllUser,
  handleCreateNewUser,
  getUserWithId,
  handleUpdateUser,
  handleDelete,
  getUserAccount,
} from "../controller/admin/user/userController";

import {
  handleGetAllGenre,
  handleCreateNewGenre,
  handleGetGenreWithId,
} from "../controller/admin/music/genre/genreController";

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
  publicRouter.post("/register", handleRegister);
  //Login
  publicRouter.post("/login", handleLogin);

  router.use(publicRouter);

  //OUTLINE

  //PRIVATE ROUTE
  //middleware
  privateRouter.use(checkJWT);
  privateRouter.use(checkPermission);

  //User
  privateRouter.get("/user", getAllUser);
  privateRouter.post("/user/create", handleCreateNewUser);
  privateRouter.get("/user/:id", getUserWithId);
  privateRouter.put("/user/update/:id", handleUpdateUser);
  privateRouter.delete("/user/delete/:id", handleDelete);

  //Artist

  //Group
  privateRouter.get("/group", getAllGroup);

  //Genre
  const uploadGenre = createUploadMiddleware("genre");
  privateRouter.get("/genre", handleGetAllGenre);
  privateRouter.post(
    "/genre/create",
    uploadGenre.single("icon"),
    handleCreateNewGenre,
  );
  privateRouter.get("/genre/:id", handleGetGenreWithId);

  router.use(privateRouter);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
