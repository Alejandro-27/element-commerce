import User from "../models/user.model.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { AppError } from "../utils/appError.js";


export const registerUserService = async (userData, file) => {
  const { firstName, lastName, email, password } = userData;

  // Validar si ya existe el correo
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Ese correo ya se encuentra registrado", 400);
  }

  // Subir avatar a Cloudinary si existe archivo
  let avatarUrl = "";
  if (file) {
    avatarUrl = await uploadToCloudinary(file.buffer, "element-commerce/users");
  }

  // Crear usuario directamente
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    avatar: avatarUrl,
  });

  return newUser;
};
/**
 * Servicio para autenticar a un usuario
 */
export const loginUserService = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Por favor proporciona correo y contraseña", 400);
  }

  // Buscar usuario seleccionando explícitamente la contraseña
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Correo o contraseña incorrectos", 401);
  }

  return user;
};

/**
 * Servicio para obtener la información de un usuario por su ID
 */
export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }
  return user;
};
