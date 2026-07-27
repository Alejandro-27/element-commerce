import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * Middleware para proteger rutas mediante autenticación JWT
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  // Obtener el token de las cookies o del header Authorization
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  }

  if (!token) {
    return next(
      new AppError(
        "No has iniciado sesión. Por favor ingresa para obtener acceso.",
        401,
      ),
    );
  }

  // Verificar la validez del token
  const secret = process.env.JWT_SECRET || "secretkey";
  let decoded;

  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError(
          "Tu sesión ha expirado. Por favor inicia sesión de nuevo.",
          401,
        ),
      );
    }
    return next(
      new AppError("Token inválido. Por favor inicia sesión de nuevo.", 401),
    );
  }

  // Verificar si el usuario todavía existe en la base de datos
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("El usuario perteneciente a este token ya no existe.", 401),
    );
  }

  // Asignar el usuario al objeto request
  req.user = currentUser;
  next();
});

/**
 * Middleware para restringir el acceso según roles de usuario
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("No tienes permisos para realizar esta acción.", 403),
      );
    }
    next();
  };
};
