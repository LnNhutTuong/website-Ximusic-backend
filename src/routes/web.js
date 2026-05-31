import express from 'express';
import { handleHellWord, handleUserPage } from '../controller/homeController';

const router = express.Router();

/**
 * @param {*} app: express app 
 */


const initWebRoutes = (app) => {
    // get, post, put, delete
    router.get("/",handleHellWord);

    router.get('/users',handleUserPage);

    return app.use("/", router);
}

export default initWebRoutes;