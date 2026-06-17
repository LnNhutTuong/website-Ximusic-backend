import express from "express";
import initApiRoutes from "./routes/api";
import configViewEngine from "./configs/viewEngine";
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8081;
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectionDB from "./configs/database";
import configCors from "./configs/cors";

//config view engine
configViewEngine(app);

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie parser
app.use(cookieParser());

//config cors
configCors(app);

//test connection
connectionDB();

//init api routes
initApiRoutes(app);

app.use((req, res) => {
  return res.send("404 not found");
});
app.listen(PORT, () => {
  console.log(">>>> JWT Backend is running on PORT = " + PORT);
});
