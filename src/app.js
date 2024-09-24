import express from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config";
import dotenv from "dotenv";
dotenv.config();


//! Conecta a la base de datos
import initDB from "./config/database.js";
initDB();

const app = express();
console.log(config);

app.get("/", (req, res) => {
  res.send("hola,  probando desde aqui 🫡");
  return;
});

app.set("port", config.PORT);
app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

import Product from "./routes/product.routes";

app.use("/api/products", Product);

export default app;

//lo malo de bun es que no tiene un buen sistema de nodemon integrado, no recarga el servidor con cada cambio
//por ahi vi algo parecido a nodemon pero para bun, pero no se todavia como funciona esa vaina

//es que bun tiene "integrado" nodemon, socket y ootras dependencias "de forma nativa" pero funcionan como una mierda
//fuerce el nodemon, estoy viendo como configurarlo porque traté de meter socket t hay que configurarlo en el servidor 