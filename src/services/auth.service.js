import jwt from "jsonwebtoken";

/**
 * Genera un token JWT firmado para el ID del usuario
 */
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secretkey", {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

/**
 * Crea el JWT, configura la cookie HttpOnly y envía la respuesta HTTP
 */
export const sendTokenCookie = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Opciones de seguridad para la Cookie HttpOnly
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 30) *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true, // Impide el acceso a la cookie mediante JavaScript en el navegador (Protección contra XSS)
    secure: process.env.NODE_ENV === "production", // Solo transmite por HTTPS en producción
    sameSite: "lax", // Protección contra ataques CSRF
  };

  // Adjuntar la cookie en los headers de la respuesta
  res.cookie("jwt", token, cookieOptions);

  // Ocultar la contraseña de la respuesta JSON por seguridad
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token, // Opcional por si el cliente también requiere guardar el token manualmente
    data: {
      user,
    },
  });
};
