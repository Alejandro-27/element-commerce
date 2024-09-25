import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT || "",
  //USERDB: process.env.USERDB || "",
  //PASSWORD: process.env.PASSWORD || "",
  SECRET: process.env.SECRET || "contra, token",
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/element",
  // NAMEGOOGLECLOUD: process.env.NAMEGOOGLECLOUD || "",
  // USER_EMAIL: process.env.USER_EMAIL || "",
  //PASS_EMAIL: process.env.PASS_EMAIL || "",

  // ! AUTH
  // CLIENT_ID: process.env.CLIENT_ID || "",
  // CLIENTE_SECRET: process.env.CLIENTE_SECRET || "",
  // CLIENT_URL: process.env.CLIENT_URL || "",
};