import express from 'express';
import initWebRoutes from './routes/web';
import configViewEngine from './configs/viewEngine'
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8081;
import bodyParser from 'body-parser';
import connectionDB from './configs/database'


//config view engine
configViewEngine(app);

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//test connection
connectionDB();

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(">>>> JWT Backend is running on PORT = " +PORT);
});
