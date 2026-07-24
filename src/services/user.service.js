import User from "../models/user.model.js";
import { uploadFile } from "../config/firebase.js";
import { AppError } from "../utils/appError.js";

//  Servicio para registrar un nuevo usuario

export const registerUserService = async (userData, file) => {
  const { name, email, password } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Ese correo ya se encuentra registrado", 400);
  }

  // Subir avatar/foto a Firebase Storage si existe un archivo
  let photoUrl = "";
  if (file) {
    const folderPath = `users/${email}`;
    const fileName = `${Date.now()}_${file.originalname}`;
    photoUrl = await uploadFile(file.buffer, folderPath, fileName);
  }

  // Crear el nuevo usuario
  const newUser = await User.create({
    name,
    email,
    password, // La contraseña se encripta automáticamente con el hook pre('save') en user.model.js
    photo: photoUrl,
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
