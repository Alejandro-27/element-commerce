import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('La variable de entorno MONGO_URI no está definida.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Conectado exitosamente: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Error MongoDB] Fallo de conexión: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;