export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // En entorno de producción (sin mostrar el stack trace)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Errores de programación o desconocidos (no filtrar detalles)
  console.error('ERROR:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Ocurrió un error interno en el servidor'
  });
};