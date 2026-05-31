import express from 'express';
import { handleHellWord, handleUserPage, handleCreateUser } from '../controller/homeController';

const router = express.Router();

/**
 * @param {*} app: express app 
 */


const initWebRoutes = (app) => {
    // get, post, put, delete
    router.get("/",handleHellWord);

    //users
    router.get('/users',handleUserPage);

    router.post('/users/create-user',handleCreateUser);

    return app.use("/", router);
}

export default initWebRoutes;