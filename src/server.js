import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Conectar primero a MongoDB
  await connectDB();

  // Escuchar peticiones HTTP
  const server = app.listen(PORT, () => {
    console.log(`[Server] Corriendo en modo ${process.env.NODE_ENV || 'development'} sobre el puerto ${PORT}`);
  });

  // Apagado elegante del servidor (Graceful Shutdown)
  const shutdown = (signal) => {
    console.log(`\n[Server] Señal ${signal} recibida. Cerrando servidor...`);
    server.close(() => {
      console.log('[Server] Servidor HTTP cerrado de forma segura.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();