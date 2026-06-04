import express from 'express';
import {hanldeRegister, handleLogin} from "../controller/apiController"
const router = express.Router();

/**
 * @param {*} app: express app 
 */


const initApiRoutes = (app) => {

    //Register
    router.post("/register", hanldeRegister)
    
    //Login
    router.post("/login", handleLogin);

    return app.use("/api/v1", router);
}

export default initApiRoutes;