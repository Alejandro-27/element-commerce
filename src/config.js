export default {
  PORT: process.env.PORT || 5000,
  SECRET: process.env.JWT_SECRET || "contra_token_super_secreto",
  MONGODB_URL: process.env.MONGO_URI || "mongodb://admin:secretpassword@localhost:27017/element_commerce?authSource=admin",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};