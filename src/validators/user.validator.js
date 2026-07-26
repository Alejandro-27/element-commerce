import { body, param, validationResult } from "express-validator";

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

export const updateUserValidator = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Ingresa un correo electrónico válido")
    .normalizeEmail(),
  body("phone").optional().trim(),
  validateResult,
];

export const mongoIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("El ID proporcionado no es un ObjectId válido de MongoDB"),
  validateResult,
];
