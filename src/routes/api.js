import express from 'express';
import {testApi, hanldeRegister} from "../controller/apiController"
const router = express.Router();

/**
 * @param {*} app: express app 
 */


const initApiRoutes = (app) => {

    //Api
    router.get("/test-api", testApi);
    router.post("/register", hanldeRegister)
    return app.use("/api/v1", router);
}

export default initApiRoutes;