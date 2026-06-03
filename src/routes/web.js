import express from 'express';
import {handleUserList, handleCreateUser, handleCreateUserPage, handleUpdateUserPage, handleUpdateUser, handleDeleteUser } from '../controller/homeController';
import {testApi} from "../controller/apiController"
const router = express.Router();

/**
 * @param {*} app: express app 
 */


const initWebRoutes = (app) => {
    // get, post, put, delete
    router.get("/",handleUserList);

    //c
    router.get('/create-page',handleCreateUserPage);
    router.post('/create-user',handleCreateUser);

    //u
    router.get('/update-page/:id', handleUpdateUserPage);
    router.post('/update-user/:id', handleUpdateUser);

    //d
    router.post('/delete-user/:id', handleDeleteUser);


    //Api
    app.get("/api/test-api", testApi); 
    return app.use("/", router);
}

export default initWebRoutes;