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

//! RUTAS DE PRODUCTOS
import Product from "./routes/product/product.routes.js";

//! RUTAS DE USUARIOS
import Users from "./routes/users/users.routes.js"

//! RUTAS DE PRODUCTOS
app.use("/api/products", Product);


//! RUTAS DE USUARIOS
app.use("/api/users", Users)


export default app;
