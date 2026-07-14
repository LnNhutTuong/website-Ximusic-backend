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

import { handleGetAllArtistOption } from "../controller/admin/artist/artistController";

import { handleAlbumOptionWithIdOrNot } from "../controller/admin/music/album/albumController";

import {
  handleGetAllGenre,
  handleGetGenreOption,
  handleCreateNewGenre,
  handleGetGenreWithId,
  handleUpdateGenre,
  handleDeleteGenre,
} from "../controller/admin/music/genre/genreController";

import {
  handleGetAllSongs,
  handleCreateNewSong,
} from "../controller/admin/music/song/songController";

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
  privateRouter.get("/artist/option", handleGetAllArtistOption);

  //Album
  privateRouter.get("/album/option", handleAlbumOptionWithIdOrNot);

  //Group
  privateRouter.get("/group", getAllGroup);

  //Genre
  const uploadGenre = createUploadMiddleware("genre");
  privateRouter.get("/genre", handleGetAllGenre);
  privateRouter.get("/genre/option", handleGetGenreOption);
  privateRouter.post(
    "/genre/create",
    uploadGenre.single("icon"),
    handleCreateNewGenre,
  );
  privateRouter.get("/genre/:id", handleGetGenreWithId);
  privateRouter.put(
    "/genre/update/:id",
    uploadGenre.single("icon"),
    handleUpdateGenre,
  );
  privateRouter.delete("/genre/delete/:id", handleDeleteGenre);
  router.use(privateRouter);

  //Song
  const uploadSong = createUploadMiddleware("song");
  privateRouter.get("/song", handleGetAllSongs);
  privateRouter.post(
    "/song/create",
    uploadSong.fields([
      { name: "cover", maxCount: 1 },
      { name: "audioUrl", maxCount: 1 },
    ]),
    handleCreateNewSong,
  );

  return app.use("/api/v1", router);
};

export default initApiRoutes;
