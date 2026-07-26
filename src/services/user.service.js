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

// Obtener todos los usuarios
export const getAllUsersService = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({ isActive: true })
    .select("-password")
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ isActive: true });
  return {
    users,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  };
};

// Optener un usuario por su ID

export const getUserByIdService = async (id) => {
  const user = await User.findOne({ _id: id, isActive: true }).select(
    "-password",
  );
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }
  return user;
};

// Actualizar un usuario

export const updateUserService = async (id, updateData, file) => {
  // Evitar actualizar la contraseña en esta ruta
  delete updateData.password;

  if (file && file.buffer) {
    updateData.avatar = await uploadToCloudinary(
      file.buffer,
      "element-commerce/users",
    );
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!updatedUser) {
    throw new AppError("Usuario no encontrado", 404);
  }
  return updatedUser;
};

// Eliminar un usuario

export const deleteUserService = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }
  return user;
};
