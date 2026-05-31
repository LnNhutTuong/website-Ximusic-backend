import express from 'express';

const router = express.Router();

/**
 * @param {*} app: express app 
 */
const initWebRoutes = (app) => {
    // get, post, put, delete
    router.get('/', (req, res) => {
        return res.send ("Hell World");
    })

    return app.use("/", router);
}

export default initWebRoutes;