export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Imprimir siempre el error detallado en consola durante la depuración
  console.error("❌ ERROR DETALLADO:", JSON.stringify(err, null, 2));
  if (err.stack) console.error(err.stack);

  const isDev =
    process.env.NODE_ENV && process.env.NODE_ENV.trim() === "development";

  if (isDev) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // En entorno de producción
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Ocurrió un error interno en el servidor",
  });
};
